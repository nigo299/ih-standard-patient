import React from 'react';
import { Image, Text } from 'remax/one';
import { Space } from '@kqinfo/ui';
import styles from './index.less';
import Line from './images/line.png';
interface Iprops {
  datas?: Array<{
    title: string;
    value: string;
  }>;
}

export default (props: Iprops) => {
  const { datas = [] } = props;

  return (
    <Space className={styles.statisBox} alignItems={'center'}>
      {datas.map((item, index) => (
        <Space
          key={index}
          className={styles.item}
          vertical
          flex={1}
          alignItems={'center'}
          justify={'center'}
        >
          <Space className={styles.itemTitle}>{item.title}</Space>
          <Space alignItems={'flex-end'}>
            <Text className={styles.cash}>{item.value}</Text>
            <Text className={styles.unit}>人</Text>
          </Space>
          {index !== datas.length - 1 && datas.length !== 1 && (
            <Image src={Line} className={styles.line} />
          )}
        </Space>
      ))}
    </Space>
  );
};
