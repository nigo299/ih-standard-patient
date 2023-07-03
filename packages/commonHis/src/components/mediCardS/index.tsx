import React, { useState } from 'react';
import { navigateTo, Image, Text, View } from 'remax/one';
import { Space, QrCode, FormItem } from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import classNames from 'classnames';
import styles from './index.less';
import { QrCodeModal } from '@/components';

interface PropsType {
  patientName: string;
  patCardNo: string;
  className?: string;
  patientId: string;
  isDetail?: boolean;
}

export default ({
  patCardNo,
  patientId,
  patientName,
  isDetail,
  className,
}: PropsType) => {
  const [show, setShow] = useState(false);
  return (
    <Space
      vertical
      alignItems="center"
      className={classNames(styles.card, className)}
    >
      <View className={styles.jzk}>
        <Space
          vertical
          className={styles.content}
          justify="center"
          alignItems="flex-start"
          onTap={(e) => {
            e.stopPropagation();
            if (!isDetail) {
              navigateTo({
                url: `/pages2/usercenter/user-info/index?patientId=${patientId}`,
              });
            }
          }}
        >
          <Space
            justify="space-between"
            alignItems="center"
            className={styles.mediaTop}
          >
            <Space alignItems="center">
              <Image
                src={`${IMAGE_DOMIN}/mine/logo.png`}
                className={styles.logo}
              />
              <Text className={styles.title}>{HOSPITAL_NAME}</Text>
            </Space>
            <Space
              justify="center"
              alignItems="center"
              className={styles.mediaTag}
            >
              电子就诊卡
            </Space>
          </Space>

          <Space
            justify="space-between"
            alignItems="flex-end"
            className={styles.wrap}
          >
            <Space vertical size={24}>
              <Space className={styles.mediItem}>
                <FormItem label="就诊人" labelWidth={'4em'} />
                {patientName || patientName}
              </Space>
              <Space className={styles.mediItem}>
                <FormItem label="就诊号" labelWidth={'4em'} />
                {patCardNo}
              </Space>
            </Space>

            <Space
              className={styles.qrcode}
              onTap={(e) => {
                e.stopPropagation();
                setShow(true);
              }}
              justify="center"
              alignItems="center"
            >
              <QrCode content={patCardNo || ''} className={styles.qrcodeImg} />
            </Space>
          </Space>
        </Space>
        <QrCodeModal
          show={show}
          name={`${name || patientName} | ${patCardNo}`}
          content={patCardNo}
          close={() => setShow(false)}
        />
      </View>
    </Space>
  );
};
