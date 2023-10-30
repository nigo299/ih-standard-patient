import React, { useState } from 'react';
import { View, Text } from 'remax/one';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, CheckBox, useSafeArea } from '@kqinfo/ui';
import styles from './index.less';

export default () => {
  setNavigationBar({
    title: '多学科门诊MDT',
  });
  const { bottomHeight } = useSafeArea();
  const [checkValue, setCheckValue] = useState(false);
  return (
    <View className={styles.page}>
      <View className={styles.warp}>
        <View className={styles.title}>申请须知</View>
        <View className={styles.p}>
          1.请提供既往病情诊疗的详细病史资料，保证真实性
        </View>
        <View className={styles.p}>
          2.MDT门诊就诊人群为门诊患者，住院患者请勿申请。危重病人请就近线下就诊。
        </View>
        <View className={styles.p}>3.MDT申请后请耐心等待审核后反馈。</View>
      </View>

      <View className={styles.bottomBar}>
        <Space className={styles.read} alignItems="center">
          <CheckBox />
          <Space>
            我已阅读<Text className={styles.link}>《申请须知》</Text>
            并知晓相关内容
          </Space>
        </Space>
        <Space
          className={styles.action}
          style={{ paddingBottom: bottomHeight }}
        >
          <Space className={styles.actionCancel}>取消预约</Space>
          <Space className={styles.actionOk}>确认预约</Space>
        </Space>
      </View>
    </View>
  );
};
