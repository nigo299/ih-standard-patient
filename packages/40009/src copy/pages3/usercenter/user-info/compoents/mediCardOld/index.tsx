import React, { useState } from 'react';
import { Text, View } from 'remax/one';
import { Space, BackgroundImg, QrCode } from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import { QrCodeModalOld } from '@/components';
import classNames from 'classnames';
import styles from './index.less';

interface PropsType {
  patientName: string;
  patCardNo: string;
  className?: string;
}

export default (props: PropsType) => {
  const [show, setShow] = useState(false);
  return (
    <Space
      vertical
      alignItems="center"
      className={classNames(styles.card, props.className)}
    >
      <BackgroundImg img={`${IMAGE_DOMIN}/jzk.png`} className={styles.jzk}>
        <Space vertical className={styles.content} justify="center">
          <Space alignItems="center" justify="space-between">
            <View className={styles.title}>电子就诊卡</View>
            <View className={styles.rightTitle}>no:0012345678</View>
          </Space>
          <Space justify="space-between" alignItems="flex-end">
            <Space vertical justify="flex-end">
              <View className={styles.text2}>
                就诊人
                <Text className={styles.bold}>{props?.patientName}</Text>
              </View>
              <View className={styles.text}>
                就诊号
                <Text className={styles.bold}>{props?.patCardNo}</Text>
              </View>
            </Space>
            <Space
              className={styles.qrcode}
              onTap={() => setShow(true)}
              justify="center"
              alignItems="center"
            >
              <QrCode
                content={props?.patCardNo || ''}
                className={styles.qrcodeImg}
              />
            </Space>
          </Space>
          <Space justify="center" className={styles.hospital}>
            {HOSPITAL_NAME}
          </Space>
        </Space>
      </BackgroundImg>
      <QrCodeModalOld
        show={show}
        name="电子就诊卡"
        content={props.patCardNo}
        close={() => setShow(false)}
      />
    </Space>
  );
};
