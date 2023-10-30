import React, { useState } from 'react';
import { View, Text } from 'remax/one';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, CheckBox } from '@kqinfo/ui';
import styles from './index.less';

export default () => {
  setNavigationBar({
    title: '多学科门诊MDT',
  });
  const [checkValue, setCheckValue] = useState(false);
  return (
    <View className={styles.page}>
      <View className={styles.title}>申请须知</View>

      <View className={styles.bottomBar}>
        <Space className={styles.read} alignItems="center">
          <CheckBox />
          <Space>
            我已阅读<Text>《申请须知》</Text>并知晓相关内容
          </Space>
        </Space>
        <Space className={styles.action}>11</Space>
      </View>
    </View>
  );
};
