import React from 'react';
import { Image, Text } from 'remax/one';
import { Space } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';

export default () => {
  return (
    <Space className={styles.noData} vertical alignItems="center">
      <Image
        src={`${IMAGE_DOMIN}/report/noData.png`}
        mode="aspectFit"
        className={styles.noDataImg}
      />
      <Text className={styles.noDataText}>暂无数据</Text>
    </Space>
  );
};
