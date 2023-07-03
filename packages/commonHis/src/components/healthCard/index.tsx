import React, { useState } from 'react';
import { Image, View } from 'remax/one';
import { Space, BackgroundImg } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import { QrCodeModal } from '@/components';
interface PropsType {
  patientName: string;
  patCardNo: string;
  idNo: string;
  qrCode: string;
  healthCardId: string;
  errorMsg?: string;
  patientId?: string;
}

export default ({
  patientName,
  idNo,
  qrCode,
  healthCardId,
  patCardNo,
  errorMsg,
  patientId,
}: PropsType) => {
  const [show, setShow] = useState(false);
  return (
    <Space vertical alignItems="center" className={styles.card}>
      <BackgroundImg img={`${IMAGE_DOMIN}/jkk.png`} className={styles.jkk}>
        <Space
          className={styles.content}
          justify="space-between"
          alignItems="flex-end"
        >
          <Space vertical alignItems="flex-start">
            <View className={styles.name}>{name || patientName}</View>
            <View className={styles.idno}>{idNo}</View>
          </Space>
          <Image
            src={`data:image/jpeg;base64,${qrCode}`}
            className={styles.img}
            onTap={(e) => {
              e.stopPropagation();
              if (healthCardId) {
                setShow(true);
              }
            }}
          />
        </Space>
        {errorMsg && (
          <Space
            justify="center"
            alignItems="center"
            className={styles.healthPropmt}
          >
            {errorMsg || '电子健康卡领取失败!'}
          </Space>
        )}
      </BackgroundImg>

      {healthCardId && (
        <QrCodeModal
          show={show}
          name={`${patientName} | ${patCardNo}`}
          content={healthCardId}
          type="health"
          close={() => setShow(false)}
        />
      )}
    </Space>
  );
};
