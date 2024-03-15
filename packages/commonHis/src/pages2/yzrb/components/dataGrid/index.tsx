import React from 'react';
import { Image } from 'remax/one';
import { Space } from '@kqinfo/ui';
import styles from './index.less';
import S from './images/s.png';
import J from './images/j.png';
interface Iprops {
  datas: Array<{
    title: string;
    value: number | string;
    extra?: {
      tb: {
        value: string | undefined;
        change: 0 | 1 | 2;
      };
      hb: {
        value: string | undefined;
        change: 0 | 1 | 2;
      };
    };
  }>;
}

export default (props: Iprops) => {
  const { datas = [] } = props;
  const showNumVal = (val: number | string) => {
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
    <Space className={styles.databox} flexWrap={'wrap'}>
      {datas
        .filter((item) => item)
        .map((item, index) => {
          return (
            <Space
              key={index}
              className={styles.dataItem}
              alignItems={'center'}
              justify={'center'}
              vertical
            >
              <Space className={styles.itemTitle}>{item.title}</Space>
              <Space className={styles.itemValue}>
                {showNumVal(item.value)}
              </Space>
              {item?.extra && (
                <Space
                  alignItems={'center'}
                  justify={'space-between'}
                  className={styles.itemBottom}
                >
                  {item?.extra?.tb && (
                    <Space alignItems={'center'}>
                      同比 {item.extra?.tb?.value}
                      {item?.extra?.tb?.change === 1 && (
                        <Image src={S} className={styles.change} />
                      )}
                      {item?.extra?.tb?.change === 2 && (
                        <Image src={J} className={styles.change} />
                      )}
                    </Space>
                  )}
                  {item?.extra?.hb && (
                    <Space alignItems={'center'}>
                      环比 {item.extra?.hb?.value}
                      {item?.extra?.hb?.change === 1 && (
                        <Image src={S} className={styles.change} />
                      )}
                      {item?.extra?.hb?.change === 2 && (
                        <Image src={J} className={styles.change} />
                      )}
                    </Space>
                  )}
                </Space>
              )}
            </Space>
          );
        })}
    </Space>
  );
};
