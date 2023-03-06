import React, { useState } from 'react';
import { View } from 'remax/one';
import { Space, BarCode } from '@kqinfo/ui';
import setPageStyle from '@/utils/setPageStyle';
import { PLATFORM } from '@/config/constant';
import styles from './index.less';
import classNames from 'classnames';

export interface Props {
  patCardNo: string;
  mode: 'register' | 'payment';
}

export default ({ patCardNo, mode }: Props) => {
  const [show, setShow] = useState(false);
  const [barCodeShow, setBarCodeShow] = useState(true);
  return (
    <>
      {show && (
        <Space
          alignItems="center"
          justify="center"
          className={styles.barCodeModal}
          onTap={() => {
            setPageStyle({
              overflow: 'inherit',
            });
            setBarCodeShow(true);
            setShow(false);
          }}
        >
          <BarCode
            content={patCardNo}
            className={styles.barCodeSheet}
            width={520}
            height={330}
          />
        </Space>
      )}

      {barCodeShow && (
        <Space justify="space-between" alignItems="flex-start">
          {/* {mode === 'register' && (
            <QrCode content={patCardNo || ''} className={styles.qrcodeImg} />
          )} */}
          <BarCode
            onTap={() => {
              setPageStyle({
                overflow: 'hidden',
              });
              if (PLATFORM !== 'web') {
                setBarCodeShow(false);
              }
              setShow(true);
            }}
            content={patCardNo || ''}
            className={classNames(styles.barCode, {
              [styles.barCodeWeb]: PLATFORM === 'web',
            })}
            width={360}
            height={150}
            style={{ background: 'none' }}
          />
        </Space>
      )}

      <View
        className={styles.text}
        onTap={() => {
          setPageStyle({
            overflow: 'hidden',
          });
          if (PLATFORM !== 'web') {
            setBarCodeShow(false);
          }
          setShow(true);
        }}
      >
        {mode === 'payment' ? '取药时出示' : '就诊时出示点击可放大显示'}
      </View>
    </>
  );
};
