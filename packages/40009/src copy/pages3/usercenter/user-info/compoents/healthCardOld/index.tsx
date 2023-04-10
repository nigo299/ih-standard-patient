import React, { useState } from 'react';
import { Image, View } from 'remax/one';
import { Space, BackgroundImg } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { QrCodeModalOld } from '@/components';
import styles from './index.less';

interface PropsType {
  patientName: string;
  patCardNo: string;
  qrCode: string;
}

export default (props: PropsType) => {
  const [show, setShow] = useState(false);
  return (
    <Space vertical alignItems="center" className={styles.card}>
      <BackgroundImg img={`${IMAGE_DOMIN}/jkk.png`} className={styles.jkk}>
        <Space
          className={styles.content}
          justify="space-between"
          alignItems="flex-end"
        >
          <Space vertical>
            <View className={styles.name}>{props?.patientName}</View>
            <View className={styles.idno}>{props?.patCardNo}</View>
          </Space>
          <Image
            src={`data:image/jpeg;base64,${props?.qrCode}`}
            className={styles.img}
            onTap={() => setShow(true)}
          />
        </Space>
      </BackgroundImg>
      <QrCodeModalOld
        show={show}
        name="电子健康卡"
        content={props.patCardNo}
        close={() => setShow(false)}
      />
    </Space>
  );
};
