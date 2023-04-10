import { useCallback } from 'react';
import { chooseImage } from '@kqinfo/ui';

export default () =>
  useCallback(
    ({
      onStart,
      maxLength = 10,
    }: {
      onStart?: () => void;
      maxLength?: number;
    }) =>
      new Promise<{ file: File | any }[]>((resolve) => {
        chooseImage({
          count: maxLength,
        }).then(async (res) => {
          onStart && onStart();
          const values = [];
          for (const path of res.tempFilePaths) {
            try {
              const file = path as unknown as File & { path: string };
              // 小程序无需压缩
              values.push({ file });
            } catch (error) {
              console.log('chooseImage_error: ', error);
            }
          }
          resolve(values);
        });
      }),
    [],
  );
