import React from 'react';
import { Space, Button } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { Image, View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import styles from './index.less';

export default () => {
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '订单结果',
      fontColor: '#FFFFFF',
      backgroundColor: '#3B71E8',
    });
  });
  return (
    <Space alignItems="center" vertical className={styles.page}>
      <View className={styles.top}>
        <Space
          alignItems="center"
          justify="space-between"
          className={styles.banner}
        >
          <Space alignItems="center">
            <Image
              src={`${IMAGE_DOMIN}/medical/icon.png`}
              className={styles.iconImg}
            />
            <View>就医费用支付成功</View>
          </Space>
          <View>￥180.00</View>
        </Space>
      </View>
      <View className={styles.wrap}>
        <View className={styles.title}>支付账单明细</View>
        <Space vertical className={styles.card}>
          <Space
            alignItems="center"
            justify="space-between"
            className={styles.subTitle}
          >
            <View>医保支付总金额</View>
            <View>100.00元</View>
          </Space>
          <View className={styles.dotted} />

          <Space
            alignItems="center"
            justify="space-between"
            className={styles.label}
          >
            <View>医保基金支付</View>
            <View>20.00元</View>
          </Space>

          <Space
            alignItems="center"
            justify="space-between"
            className={styles.label}
          >
            <View>个人账户支付</View>
            <View>70.00元</View>
          </Space>

          <Space
            alignItems="center"
            justify="space-between"
            className={styles.label}
          >
            <View>其他抵扣金额</View>
            <View>10.00元</View>
          </Space>

          <Space
            alignItems="center"
            justify="space-between"
            className={styles.primary}
          >
            <View>自费支付金额</View>
            <View>80.00元</View>
          </Space>
        </Space>
        <Button className={styles.btn} block>
          完成
        </Button>
      </View>
    </Space>
  );
};
