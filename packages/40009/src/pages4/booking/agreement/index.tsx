import React, { useState } from 'react';
import { View, Text, navigateBack, navigateTo } from 'remax/one';
import { Space, CheckBox, useSafeArea, showToast, useTitle } from '@kqinfo/ui';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';

export default () => {
  useTitle('多学科门诊MDT');
  const { teamId } = useGetParams<{
    teamId: string;
  }>();
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
        <Space
          className={styles.read}
          alignItems="center"
          onTap={() => {
            setCheckValue(!checkValue);
          }}
        >
          <CheckBox checked={checkValue} disabled />
          <Space>
            我已阅读<Text className={styles.link}>《申请须知》</Text>
            并知晓相关内容
          </Space>
        </Space>
        <Space
          className={styles.action}
          style={{ paddingBottom: bottomHeight }}
        >
          <Space
            className={styles.actionCancel}
            onTap={() => {
              navigateBack();
            }}
          >
            取消预约
          </Space>
          <Space
            className={styles.actionOk}
            onTap={() => {
              if (!checkValue) {
                showToast({
                  icon: 'none',
                  title: '请阅读并同意《申请须知》',
                });
              } else {
                navigateTo({
                  url: `/pages4/booking/schedule/index?teamId=${teamId}`,
                });
              }
            }}
          >
            确认预约
          </Space>
        </Space>
      </View>
    </View>
  );
};
