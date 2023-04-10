import { useCallback } from 'react';
import useChooseImage from '../use-chooseImage';
import useApi from '@/apis/feedback';
import dayjs from 'dayjs';
import { uploadFile } from '@kqinfo/ui';

export const uploadFunc: (url: string) => Promise<string> = (file) =>
  new Promise(async (resolve) => {
    const { data: sign } = await useApi.OSS签名.request();
    const host = sign.host;
    const originalName = file;
    const dateName = dayjs().format('YYYY/MM/DD');
    const filename = `${sign.dir}/${dateName}-${sign.expire}.jpg`;
    const formData = {
      key: filename,
      policy: sign.policy,
      callback: sign.callback,
      signature: sign.sign,
      OSSAccessKeyId: sign.accessId,
      success_action_status: 200,
    };
    await uploadFile({
      url: sign.host,
      name: 'file',
      fileType: 'image',
      filePath: originalName,
      formData,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: () => {
        resolve(`${host}/${filename}`);
      },
      fail: (res: any) => {
        if (res?.statusCode === 203) {
          resolve(`${host}/${filename}`);
        }
      },
    });
  });

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
            const src = await uploadFunc(file.file);
            values.push(src);
          } catch (error) {
            console.log('upload_error: ', error);
          }
        }
        resolve(values.filter((x) => !!x));
      }),
    [chooseImage],
  );
};
