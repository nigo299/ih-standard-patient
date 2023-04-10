import React from 'react';
import { Space } from '@kqinfo/ui';
import styles from './index.less';
import { navigateTo, reLaunch, View } from 'remax/one';
import { PLATFORM } from '@/config/constant';

export default () => {
  return PLATFORM === 'web' ? null : (
    <Space
      className={styles.ball}
      justify="center"
      alignItems="center"
      vertical
      size={8}
      onTap={() => {
        if (PLATFORM === 'web') {
          navigateTo({
            url: '/pages/home/index',
          });
        } else {
          reLaunch({
            url: '/pages/home/index',
          });
        }
      }}
    >
      <View>返回</View>
      <View>首页</View>
    </Space>
  );
};
