import React, { useState } from 'react';
import { View, Text } from 'remax/one';
import { Space, QrCode, BarCode, BackgroundImg } from '@kqinfo/ui';
import { QrCodeModalOld } from '@/components';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import setPageStyle from '@/utils/setPageStyle';
import styles from './index.less';
import classNames from 'classnames';
import { useHisConfig } from '@/hooks';
export interface IProps {
  payName: 'register' | 'payment';
  patCardNo: string;
  healthCardNo?: string;
  barCanvasShow?: boolean;
  hospitalName: string;
}

export default ({ payName, patCardNo, healthCardNo, hospitalName }: IProps) => {
  const { config } = useHisConfig();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [barCodeShow, setBarCodeShow] = useState(true);
  return (
    <Space justify="center">
      <BackgroundImg
        innerProps={{ className: styles.pannel }}
        imgProps={{
          className:
            config.registerCardChange === 'DEFAULT_STYLE'
              ? styles.pannel
              : styles.kouQiangPannel,
        }}
        img={`${IMAGE_DOMIN}/payment/bg.png`}
      >
        {config.registerCardChange === '2219_STYLE' && (
          <View className={styles.kqBarCodeText}>
            ID
            <Text style={{ marginLeft: '16px', marginRight: '16px' }}>
              {patCardNo}
            </Text>
            (扫码签到)
          </View>
        )}

        <Space vertical justify="center" alignItems="center">
          {config.registerCardChange === 'DEFAULT_STYLE' && (
            <View className={styles.hospitalName}>{hospitalName}</View>
          )}
          <View
            className={
              config.registerCardChange === '2219_STYLE'
                ? styles.KQpayName
                : styles.payName
            }
          >
            {payName === 'payment' && '门诊检查申请单'}
            {payName === 'register' && '挂号电子凭证'}
          </View>

          <Space justify="center">
            {healthCardNo && (
              <QrCode
                content={healthCardNo || patCardNo}
                className={styles.qrcode}
                onTap={() => {
                  if (PLATFORM !== 'web') {
                    setBarCodeShow(false);
                  }
                  setPageStyle({
                    overflow: 'hidden',
                  });
                  setShow2(true);
                }}
              />
            )}
            {patCardNo && (
              <BarCode
                content={patCardNo}
                className={classNames(styles.barCode, {
                  [styles.barCodeWeb]: PLATFORM === 'web',
                  [styles.barCodeShow]: !barCodeShow,
                  [styles.KQbarCodeWeb]:
                    config.registerCardChange === '2219_STYLE',
                })}
                onTap={() => {
                  if (PLATFORM !== 'web') {
                    setBarCodeShow(false);
                  }
                  setPageStyle({
                    overflow: 'hidden',
                  });
                  setShow(true);
                }}
                width={260}
                height={132}
              />
            )}
          </Space>

          <View className={styles.tip}>
            {config.registerCardChange !== '2219_STYLE' &&
              (payName === 'register'
                ? `${
                    healthCardNo ? '(电子健康卡)' : '(就诊卡号)'
                  }就诊时出示点击可放大显示`
                : `${
                    healthCardNo ? '(电子健康卡)' : '(就诊卡号)'
                  }取药时出示点击可放大显示`)}
          </View>

          <QrCodeModalOld
            show={show}
            name={
              payName === 'payment'
                ? '门诊检查申请单'
                : payName === 'register'
                ? '挂号电子凭证'
                : '电子健康卡'
            }
            healthCardNo={healthCardNo || patCardNo || '0'}
            patCardNo={patCardNo || '0'}
            isQRCode={false}
            close={() => {
              setBarCodeShow(true);
              setPageStyle({
                overflow: 'inherit',
              });
              setShow(false);
            }}
          />
          {healthCardNo && (
            <QrCodeModalOld
              show={show2}
              name={'电子健康卡'}
              healthCardNo={healthCardNo}
              patCardNo={patCardNo}
              isBarCode={false}
              close={() => {
                setBarCodeShow(true);
                setPageStyle({
                  overflow: 'inherit',
                });
                setShow2(false);
              }}
            />
          )}
        </Space>
      </BackgroundImg>
    </Space>
  );
};
