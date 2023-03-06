import React from 'react';
import { View, redirectTo } from 'remax/one';
import { Space } from '@kqinfo/ui';
import styles from './index.less';

export interface IProps {
  patientName: string;
  redirectUrl: string;
}

export default ({ patientName, redirectUrl }: IProps) => (
  <Space className={styles.user} justify="space-between" alignItems="center">
    <View className={styles.name}>{`就诊人：${patientName}`}</View>
    <Space
      justify="center"
      alignItems="center"
      className={styles.toggle}
      onTap={() => {
        redirectTo({
          url: redirectUrl,
        });
      }}
    >
      切换就诊人
    </Space>
  </Space>
);
