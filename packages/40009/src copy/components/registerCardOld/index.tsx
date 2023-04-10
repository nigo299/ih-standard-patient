import React, { useState } from 'react';
import { View } from 'remax/one';
import { Space, QrCode, BarCode } from '@kqinfo/ui';
import { QrCodeModalOld } from '@/components';
import { HOSPITAL_NAME } from '@/config/constant';
import setPageStyle from '@/utils/setPageStyle';
import styles from './index.less';

export interface IProps {
  payName: 'register' | 'payment';
  patCardNo: string;
  barCanvasShow?: boolean;
}

export default ({ payName, patCardNo, barCanvasShow = true }: IProps) => {
  const [show, setShow] = useState(false);
  const [barCodeShow, setBarCodeShow] = useState(true);
  return (
    <Space
      vertical
      className={styles.card}
      justify="center"
      alignItems="center"
    >
      <View className={styles.hospitalName}>{HOSPITAL_NAME}</View>
      <View className={styles.payName}>
        {payName === 'payment' && '门诊检查申请单'}
        {payName === 'register' && '挂号电子凭证'}
      </View>
      {patCardNo && (
        <Space
          justify="space-between"
          onTap={() => {
            setPageStyle({
              overflow: 'hidden',
            });
            setBarCodeShow(false);
            setShow(true);
          }}
        >
          <QrCode content={patCardNo} className={styles.qrcode} />
          {barCodeShow && barCanvasShow ? (
            <BarCode content={patCardNo} className={styles.barcode} />
          ) : (
            <View className={styles.barcode} />
          )}
        </Space>
      )}
      <View className={styles.tip}>拿报告时点击可放大显示</View>

      <QrCodeModalOld
        show={show}
        name="电子就诊卡"
        content={patCardNo}
        close={() => {
          setBarCodeShow(true);
          setPageStyle({
            overflow: 'inherit',
          });
          setShow(false);
        }}
      />
    </Space>
  );
};
