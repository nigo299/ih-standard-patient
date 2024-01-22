import React from 'react';
import { Space } from '@kqinfo/ui';
import styles from './index.less';
interface Iprops {
  //title为标题项
  title?: string | React.ReactElement;
  date?: string;
  datas?: Array<{ label: string; value: number }>;
}

export default (props: Iprops) => {
  const { title = '', date = '', datas = [] } = props;
  return (
    <Space
      className={styles.card}
      vertical
      justify={'center'}
      alignItems={'center'}
    >
      <Space className={styles.title}>{title}</Space>
      <Space className={styles.date}>{date}</Space>
      <Space className={styles.databox} flexWrap="wrap">
        {datas.map((item, index) => (
          <Space className={styles.item} key={index} alignItems="center">
            <Space className={styles.itemTitle} justify={'flex-end'}>
              {item.label}
            </Space>
            <Space className={styles.itemValue} flex={1} justify="center">
              {item.value}
            </Space>
            <Space>人</Space>
          </Space>
        ))}
      </Space>
    </Space>
  );
};
