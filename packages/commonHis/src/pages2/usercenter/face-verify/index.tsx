import React, { useCallback, useEffect, useState } from 'react';
import { usePageEvent } from 'remax/macro';
import { Image, Text, navigateBack, navigateTo } from 'remax/one';
import { Space, Button, showToast } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import setNavigationBar from '@/utils/setNavigationBar';
import globalState from '@/stores/global';
import patientState from '@/stores/patient';
import classNames from 'classnames';
import { useFaceVerify } from '@/hooks';
import { FaceVerifyStatus } from '@/hooks/use-face-verify';
import styles from './index.less';
import { analyzeIDCard } from '@/utils';
import { Dialog } from '@/components';
import { useUnmount } from 'ahooks';

export default () => {
  const { elderly } = globalState.useContainer();
  const { faceInfo, setFaceInfo, setNeedGuardian } =
    patientState.useContainer();
  const [visible, setVisible] = useState(false);
  const { handleFaceVerify, faceVerifyStatus } = useFaceVerify({
    name: faceInfo.name,
    no: faceInfo.idNo,
    request_verify_pre_info: JSON.stringify({
      name: faceInfo.name,
      id_card_number: faceInfo.idNo,
    }),
  });
  const { analyzeAge } = analyzeIDCard(faceInfo.idNo);

  useEffect(() => {
    if (faceVerifyStatus === FaceVerifyStatus.失败 && analyzeAge >= 60) {
      setNeedGuardian(true);
      setVisible(true);
    }
  }, [analyzeAge, faceVerifyStatus]);
  useUnmount(() => {
    if (faceVerifyStatus !== FaceVerifyStatus.成功) {
      setFaceInfo({
        name: '',
        idNo: '',
        success: false,
      });
    }
  });
  const handleSuccess = useCallback(() => {
    if (faceInfo?.checkMedical) {
      navigateTo({
        url: '/pages/mine/index/index?faceVerify=1',
      });
      return;
    }
    setFaceInfo({ ...faceInfo, success: true });
    navigateBack();
  }, [faceInfo, setFaceInfo]);
  usePageEvent('onShow', () => {
    if (!faceInfo.idNo && faceInfo.success) {
      showToast({
        icon: 'none',
        title: '身份证信息不能为空!',
      }).then(() => navigateBack());
    }
    setNavigationBar({
      title: '开始人脸识别',
    });
  });

  return (
    <Space vertical className={styles.page}>
      <Space
        justify="center"
        className={classNames(styles.title, {
          [styles.elderlyTitle]: elderly,
        })}
      >
        {faceVerifyStatus === FaceVerifyStatus.成功
          ? '人脸识别成功'
          : '请衣着整齐，平视屏幕，并正对光源'}
      </Space>
      {faceVerifyStatus === FaceVerifyStatus.成功 ? (
        <Space justify="center">
          <Image
            src={`${IMAGE_DOMIN}/usercenter/faceSuccess.png`}
            className={styles.face}
            mode="widthFix"
          />
        </Space>
      ) : (
        <>
          <Image
            src={`${IMAGE_DOMIN}/usercenter/rlsb-old.png`}
            mode="aspectFit"
            className={styles.img}
          />
          <Text className={styles.text}>拍摄须知</Text>
          <Space
            justify="space-between"
            alignItems="center"
            flex="auto"
            className={styles.content}
          >
            <Image
              src={`${IMAGE_DOMIN}/usercenter/zdqjk-old.png`}
              mode="aspectFit"
              className={styles.img2}
            />
            <Image
              src={`${IMAGE_DOMIN}/usercenter/bzdlb-old.png`}
              mode="aspectFit"
              className={styles.img2}
            />
            <Image
              src={`${IMAGE_DOMIN}/usercenter/ldsz-old.png`}
              mode="aspectFit"
              className={styles.img2}
            />
          </Space>
        </>
      )}

      {faceVerifyStatus === FaceVerifyStatus.成功 ? (
        <Button type="primary" elderly={elderly} onTap={handleSuccess}>
          人脸认证成功，点击返回
        </Button>
      ) : (
        <Button
          type="primary"
          elderly={elderly}
          onTap={() => handleFaceVerify()}
        >
          点击开始人脸验证
        </Button>
      )}
      <Dialog
        hideFail
        show={visible}
        title={'温馨提示'}
        successText={'确定'}
        onSuccess={() => navigateBack()}
      >
        <Space style={{ lineHeight: 1.2, padding: 20 }}>
          60岁以上患者可以填写代理人信息由代理人进行认证。
        </Space>
      </Dialog>
    </Space>
  );
};
