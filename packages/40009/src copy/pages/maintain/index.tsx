import React from 'react';
import { Space } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import useGetParams from '@/utils/useGetParams';
import setNavigationBar from '@/utils/setNavigationBar';
import styles from './index.less';

export default () => {
  const { msg } = useGetParams<{ msg: string }>();
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '维护中',
    });
  });
  return (
    <Space alignItems="center" vertical className={styles.page}>
      <Image
        src={`${IMAGE_DOMIN}/error/maintain.png`}
        mode="aspectFill"
        className={styles.img}
      />
      <Text className={styles.text}>维护中...</Text>
      <Text className={styles.text2}>
        {msg || '抱歉，系统正在维护中，请稍后访问！'}
      </Text>
    </Space>
  );
};
