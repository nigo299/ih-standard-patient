import React from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { RichText, Space } from '@kqinfo/ui';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/microsite';

export default () => {
  const { id } = useGetParams<{ title: string; id: string }>();
  const { data } = useApi.获取文章详情({
    initValue: {
      data: {},
    },
    params: { id: Number(id) },
    needInit: !!id,
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '文章详情',
    });
  });
  return (
    <View className={styles.main}>
      <View className={styles.title}>{data?.data?.title}</View>
      <Space className={styles.detail}>
        <View>{data?.data?.author || ''}</View>
        <View>{data?.data?.publishTime}</View>
      </Space>
      <View className={styles.article}>
        <RichText nodes={data?.data?.content} />
      </View>
    </View>
  );
};
