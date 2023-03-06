import { useCallback } from 'react';
import useApi from '@/apis/feedback';
import { axios } from '@kqinfo/ui';
import dayjs from 'dayjs';
import * as uuid from 'uuid';
import useChooseImage from '../use-chooseImage';

export const uploadWebFunc: (file: File) => Promise<string> = async (file) => {
  const { data: sign } = await useApi.OSS签名.request();
  const host = sign.host;
  const originalName = file?.name;
  const dateName = dayjs().format('YYYY/MM/DD');
  const filename = `PIC/${dateName}/${uuid.v4()}-${originalName}`;
  const formData = new FormData();
  formData.append('key', filename);
  formData.append('policy', sign.policy);
  formData.append('callback', sign.callback);
  formData.append('signature', sign.sign);
  formData.append('OSSAccessKeyId', sign.accessId);
  formData.append('file', file, originalName);
  await axios.post(sign.host, formData, {
    headers: { Accept: '*/*' },
  });
  return `${host}/${filename}`;
};

export default () => {
  const chooseImage = useChooseImage();
  return useCallback(
    ({
      onStart,
      maxLength = 5,
    }: {
      onStart?: () => void;
      maxLength?: number;
    }) =>
      new Promise<string[]>(async (resolve) => {
        const values: string[] = [];
        const files = await chooseImage({ maxLength, onStart });
        for (const file of files) {
          try {
            const src = await uploadWebFunc(file.file);
            values.push(src);
          } catch (error) {
            console.log('error', error);
          }
        }
        resolve(values.filter((x) => !!x));
      }),
    [chooseImage],
  );
};
