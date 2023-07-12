import React from 'react';
import { Image, View } from 'remax/one';
import styles from './index.less';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { IMAGE_DOMIN } from '@/config/constant';
import dayjs from 'dayjs';
import { Space } from '@kqinfo/ui';

export default () => {
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '取药签到',
    });
  });

  return (
    <View className={styles.pageSignList}>
      <View className={styles.header}>{dayjs().format('YYYY年MM月DD日')}</View>
      <View className={styles.noData}>
        <Image
          src={`${IMAGE_DOMIN}/sign/zwsj.png`}
          className={styles.noDataImg}
        />
        <Space
          className={styles.textContainer}
          vertical
          alignItems={'center'}
          size={20}
        >
          <View className={styles.noDataTitle}>当前没有可签到的记录！</View>
          <View className={styles.noDataContent}>
            若您有今日实际有预约，请前往分诊台进行处理
          </View>
        </Space>
      </View>
    </View>
  );
};
