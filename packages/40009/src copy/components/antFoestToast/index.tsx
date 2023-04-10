import React from 'react';
import { Space } from '@kqinfo/ui';
import { View, Image } from 'remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import Mask from '@/components/mask';

interface IProps {
  show: boolean;
  close: () => void;
  number: number;
  type: 'search' | 'register';
}
export default ({ show, close, type, number }: IProps) => {
  return (
    <Mask mask show={show} close={close} center>
      <Space justify="center" alignItems="center" className={styles.antToast}>
        <Image
          src={`${IMAGE_DOMIN}/alipay/nlq.png`}
          className={styles.nlqImg}
        />
        本次{type === 'search' ? '查询' : '预约'}得绿色能量
        <View className={styles.text}>{number}g</View>
      </Space>
    </Mask>
  );
};
