import { useCallback } from 'react';
import { getBrowserUa } from '@/utils';
import { showToast } from '@kqinfo/ui';
import { PLATFORM } from '@/config/constant';
const wx = require('weixin-js-sdk');

export function dataURLtoFile(dataurl: string, filename: string) {
  // 获取到base64编码
  const arr = dataurl.split(',');
  // 将base64编码转为字符串
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n); // 创建初始化为0的，包含length个元素的无符号整型数组
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: 'image/jpeg',
  });
}

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

export default () =>
  useCallback(
    ({
      onStart,
      maxLength = 10,
    }: {
      onStart?: () => void;
      maxLength?: number;
    }) =>
      new Promise<{ file: File }[]>((resolve) => {
        // 微信公众号H5
        if (getBrowserUa() === 'wechat') {
          wx.chooseImage({
            count: maxLength,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: async (res: { tempFilePaths: any; localIds: any }) => {
              onStart && onStart();
              const localIds: string[] = res?.localIds || res?.tempFilePaths;
              const values = [];
              for (const localId of localIds) {
                try {
                  const file: File = await new Promise((resolve) => {
                    wx.getLocalImgData({
                      localId,
                      success: async (res: { localData: string }) => {
                        let data: File;
                        const photoName = `${new Date().getTime()}.jpg`;
                        if (res.localData.indexOf('data:image') != 0) {
                          data = dataURLtoFile(
                            'data:image/jpeg;base64,' + res.localData,
                            photoName,
                          );
                        } else {
                          data = dataURLtoFile(res.localData, photoName);
                        }
                        resolve(data);
                      },
                    });
                  });
                  const result = await compressImg(file, 0.28);
                  values.push(result);
                } catch (error) {
                  console.log(error);
                }
              }
              resolve(values);
            },
          });
        } else if (getBrowserUa() === 'alipay') {
          // 支付宝生活H5
          showToast({
            title: '暂不支持非微信公众号浏览器上传图片!',
          });
        } else {
          // 普通浏览器
          showToast({
            title: '暂不支持非微信公众号浏览器上传图片!',
          });
        }
      }),
    [],
  );
