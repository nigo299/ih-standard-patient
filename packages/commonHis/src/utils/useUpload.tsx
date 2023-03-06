import { useCallback } from 'react';
import useApi from '@/apis/feedback';
import dayjs from 'dayjs';
import * as uuid from 'uuid';
import { chooseImage, uploadFile } from '@kqinfo/ui';
import { PLATFORM } from '@/config/constant';

/**
 * 压缩图片方法
 * @param {file} file 文件
 * @param {Number} quality 图片质量(取值0-1之间默认0.92)
 */
export const compressImg = (
  file: File,
  quality: number,
): Promise<{
  file: File;
  origin?: File;
  beforeSrc?: string;
  afterSrc?: string;
  beforeKB?: number;
  afterKB?: number;
}> => {
  let qualitys = 0.52;
  console.log('图片size大小: ', parseInt((file?.size / 1024).toFixed(2)));
  if (parseInt((file?.size / 1024).toFixed(2)) < 1024) {
    qualitys = 0.85;
  }
  if (5 * 1024 < parseInt((file?.size / 1024).toFixed(2))) {
    qualitys = 0.92;
  }
  if (quality) {
    qualitys = quality;
  }
  return new Promise((resolve) => {
    // 小程序环境无需压缩图片
    if (Number((file?.size / 1024).toFixed(2)) < 100 || PLATFORM !== 'web') {
      resolve({
        file: file,
      });
    } else {
      const reader = new FileReader(); // 创建 FileReader
      reader.onload = ({ target: { result: src } }) => {
        const image = new Image(); // 创建 img 元素
        image.onload = async () => {
          const canvas = document.createElement('canvas'); // 创建 canvas 元素
          const context = canvas.getContext('2d');
          let targetWidth = image.width;
          let targetHeight = image.height;
          const originWidth = image.width;
          const originHeight = image.height;
          let maxWidth = 1600;
          let maxHeight = 1600;
          if (
            1 * 1024 <= parseInt((file.size / 1024).toFixed(2)) &&
            parseInt((file.size / 1024).toFixed(2)) <= 10 * 1024
          ) {
            targetWidth = originWidth;
            targetHeight = originHeight;
            // 图片尺寸超过的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth),
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight),
                );
              }
            }
          }
          if (
            10 * 1024 <= parseInt((file.size / 1024).toFixed(2)) &&
            parseInt((file.size / 1024).toFixed(2)) <= 20 * 1024
          ) {
            maxWidth = 1400;
            maxHeight = 1400;
            targetWidth = originWidth;
            targetHeight = originHeight;
            // 图片尺寸超过的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth),
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight),
                );
              }
            }
          }
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          context?.clearRect(0, 0, targetWidth, targetHeight);
          context?.drawImage(image, 0, 0, targetWidth, targetHeight); // 绘制 canvas
          const canvasURL = canvas.toDataURL('image/jpeg', qualitys);
          const buffer = atob(canvasURL.split(',')[1]);
          let length = buffer.length;
          const bufferArray = new Uint8Array(new ArrayBuffer(length));
          while (length--) {
            bufferArray[length] = buffer.charCodeAt(length);
          }
          const miniFile = new File([bufferArray], file.name, {
            type: 'image/jpeg',
          });
          console.log('图片压缩后的数据: ', {
            file: miniFile,
            origin: file,
            beforeSrc: src,
            afterSrc: canvasURL,
            beforeKB: Number((file.size / 1024).toFixed(2)),
            afterKB: Number((miniFile.size / 1024).toFixed(2)),
            qualitys: qualitys,
          });
          resolve({
            file: miniFile,
            origin: file,
            beforeSrc: src,
            afterSrc: canvasURL,
            beforeKB: Number((file.size / 1024).toFixed(2)),
            afterKB: Number((miniFile.size / 1024).toFixed(2)),
          });
        };
        image.src = src;
      };
      reader.readAsDataURL(file);
    }
  });
};

const uploadFunc: (file: any) => Promise<string> = async (file) => {
  const { data: sign } = await useApi.OSS签名.request();
  const host = sign.host;
  const originalName = PLATFORM === 'web' ? file?.name : file;
  const dateName = dayjs().format('YYYY/MM/DD');
  const filename =
    PLATFORM === 'web'
      ? `PIC/${dateName}/${uuid.v4()}-${originalName}`
      : `PIC/${dateName}/${originalName}`;
  const formData = {
    key: filename,
    policy: sign.policy,
    callback: sign.callback,
    signature: sign.sign,
    OSSAccessKeyId: sign.accessId,
  };
  await uploadFile({
    url: sign.host,
    name: PLATFORM === 'web' ? '' : 'file',
    fileType: 'image',
    filePath: originalName,
    formData: PLATFORM === 'web' ? { ...formData, file } : formData,
    header: { Accept: '*/*' },
  });
  return `${host}/${filename}`;
};

export default () =>
  useCallback(
    ({
      onStart,
      onEnd,
      maxLength = 10,
    }: {
      onStart?: () => void;
      onEnd?: () => void;
      /**
       * 最多同时上传
       */
      maxLength?: number;
      /**
       * 是否可以多选
       */
      multiple?: boolean;
      /**
       * 限制上传文件类型
       * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
       */
      accept?: string;
    }) =>
      new Promise<string[]>((resolve) => {
        chooseImage({
          count: maxLength,
        }).then(async (res) => {
          onStart && onStart();
          const values: string[] = [];
          for (const path of res.tempFilePaths) {
            try {
              const file = path as unknown as File & { path: string };
              console.log('file', file);
              const result = await compressImg(file, 0.28);
              console.log('result', result);
              const src = await uploadFunc(result.file);
              values.push(src);
            } catch (error) {
              console.log(error);
            }
          }
          onEnd && onEnd();
          resolve(values.filter((x) => !!x));
        });
      }),
    [],
  );
