import React from 'react';
import { Space } from '@kqinfo/ui';
import styles from './index.less';
interface Iprops {
  datas?: Array<{
    lable: string;
    value: number;
  }>;
}

export default (props: Iprops) => {
  const { datas = [] } = props;
  const showNumVal = (val: number) => {
    if (typeof val === 'number') {
      const num1 = ('' + val).split('.')[0];
      const num2 = ('' + val).split('.')[1];
      let str = num1.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
      if (num2) {
        str += '.';
        str += Number('0.' + num2)
          .toFixed(2)
          .substring(2, 4);
      }
      return str;
    } else {
      return val;
    }
    // return typeof val === 'number'
    //   ? ('' + val)
    //       .split('.')[0]
    //       .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
    //   : val;
  };
  return (
    <Space className={styles.dataPane}>
      {datas.map((item, index) => {
        return (
          <Space
            key={index}
            className={styles.paneItem}
            vertical
            justify={'center'}
            alignItems={'center'}
            size={20}
          >
            <Space className={styles.label}>{item.lable}</Space>
            <Space className={styles.value}>{showNumVal(item.value)}</Space>
          </Space>
        );
      })}
    </Space>
  );
};
