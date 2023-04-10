/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from 'react';

export enum FaceVerifyStatus {
  '未开始' = -1,
  '失败',
  '成功',
}

export default ({
  name,
  no,
}: {
  /**
   * 姓名
   */
  name: string;
  /**
   * 身份证号
   */
  no: string;
}) => {
  const [faceVerifyStatus, setFaceVerifyStatus] = useState<FaceVerifyStatus>(
    FaceVerifyStatus.未开始,
  );
  const handleFaceVerify = useCallback(() => {
    console.log('----支付宝人脸识别----');
  }, []);
  return { handleFaceVerify, faceVerifyStatus };
};
