import React from 'react';
import { View, Image, Text } from '@remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import { Space } from '@kqinfo/ui';
import styles from './index.less';

export interface IHeaderProps {
  title: React.ReactNode;
  content: React.ReactNode;
}

export default (props: IHeaderProps) => {
  return (
    <View className={styles.box}>
      <View className={styles.avatar}>
        <Image
          className={styles.avatarImg}
          src={`${IMAGE_DOMIN}/inhosp/jzr.png`}
        />
      </View>
      <View>
        <Space vertical size={20}>
          <Text className={styles.title}>{props.title}</Text>
          <Text className={styles.content}>{props.content}</Text>
        </Space>
      </View>
    </View>
  );
};
