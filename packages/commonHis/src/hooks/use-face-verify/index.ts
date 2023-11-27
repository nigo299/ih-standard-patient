import { useCallback, useState } from 'react';
import useApi from '@/apis/login';
const wx = require('weixin-js-sdk');

export enum FaceVerifyStatus {
  '未开始' = -1,
  '失败',
  '成功',
}

export interface Options {
  /**
   * 姓名，小程序需要
   */
  name?: string;
  /**
   * 身份证号，小程序需要
   */
  no?: string;
  /**
   * web端需要，用户身份信息
   */
  request_verify_pre_info?: string;
}

export default ({ request_verify_pre_info }: Options) => {
  const [faceVerifyStatus, setFaceVerifyStatus] = useState<FaceVerifyStatus>(
    FaceVerifyStatus.未开始,
  );
  const handleFaceVerify = useCallback(
    () =>
      new Promise(async (resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { code, data } = await useApi.获取配置信息.request();
        if (code == 0 && data?.appId && data?.signature) {
          const { appId, signature, timestamp, noncestr } = data;
          wx.config({
            appId,
            beta: true,
            signature,
            timestamp,
            nonceStr: noncestr,
            jsApiList: [
              'checkIsSupportFaceDetect',
              'requestWxFacePictureVerify',
              'scanQRCode',
            ],
          });
          wx.ready(() => {
            wx.invoke(
              'requestWxFacePictureVerify',
              {
                appid: appId,
                check_alive_type: 2,
                request_verify_pre_info,
              },
              (data: any) => {
                console.log('--------', data);
                const { err_code } = data;
                if ([0, '0'].includes(err_code)) {
                  setFaceVerifyStatus(FaceVerifyStatus.成功);
                  resolve(data);
                } else {
                  setFaceVerifyStatus(FaceVerifyStatus.失败);
                  reject(data);
                }
              },
            );
          });
        }
      }),
    [request_verify_pre_info],
  );
  return { handleFaceVerify, faceVerifyStatus, setFaceVerifyStatus };
};
