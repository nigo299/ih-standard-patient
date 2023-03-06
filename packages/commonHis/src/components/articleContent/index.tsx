import React from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { Space, Exceed } from '@kqinfo/ui';
import styles from './index.less';
import useApi from '@/apis/microsite';

interface PropsType {
  title: string;
  content: string;
  time: string;
  img: string;
  id: number;
}

export default (props: PropsType) => {
  return (
    <View className={styles.box}>
      <Space
        onTap={() => {
          useApi.新增浏览量.request({ id: props.id });
          navigateTo({
            url: `/pages/microsite/article-detail/index?id=${props.id}`,
          });
        }}
      >
        <View className={styles.imgBox}>
          <Image src={props.img} className={styles.img} />
        </View>
        <View className={styles.main}>
          <Exceed clamp={1} className={styles.title}>
            {props.title}
          </Exceed>
          <Exceed clamp={2} className={styles.content}>
            {props.content}
          </Exceed>
          <View className={styles.time}>{props.time}</View>
        </View>
      </Space>
    </View>
  );
};
