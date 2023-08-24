import React from 'react';
import { navigateTo, Image, Text, View } from 'remax/one';
import { Space, QrCode } from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import classNames from 'classnames';
import styles from './index.less';

interface PropsType {
  patientName: string;
  patCardNo: string;
  className?: string;
  patientId: string;
  onQrCodeTab: () => void;
}

export default (props: PropsType) => (
  <Space
    vertical
    alignItems="center"
    className={classNames(styles.card, props.className)}
  >
    <Space
      vertical
      className={styles.content}
      justify="center"
      onTap={() =>
        navigateTo({
          url: `/pages2/usercenter/userinfo/index?patientId=${props.patientId}`,
        })
      }
    >
      <Space alignItems="center">
        <Image src={`${IMAGE_DOMIN}/mine/logo.png`} className={styles.logo} />
        <Text className={styles.title}>电子就诊卡</Text>
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
          onTap={(e) => {
            e.stopPropagation();
            props?.onQrCodeTab();
          }}
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
  </Space>
);
