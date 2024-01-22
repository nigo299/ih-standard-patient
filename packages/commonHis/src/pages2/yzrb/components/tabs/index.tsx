import React from 'react';
import { Image } from 'remax/one';
import { Space } from '@kqinfo/ui';
import classNames from 'classnames';
import styles from './index.less';
import tab1on from './images/tab1on.png';
import tab2on from './images/tab2on.png';
interface Iprops {
  active: string;
  onTap?: (v: string) => void;
}

export default (props: Iprops) => {
  const { active = '1', onTap } = props;
  console.log('active', active);
  return (
    <Space className={styles.tabs}>
      <Space
        onTap={() => {
          onTap?.('1');
        }}
        flex={1}
        alignItems={'center'}
        justify={'center'}
        className={classNames(styles.tabItem, {
          [styles.activeItem]: active === '1',
        })}
      >
        <Image src={tab2on} className={styles.tabsIco} />
        门诊数据
      </Space>
      <Space
        onTap={() => {
          onTap?.('2');
        }}
        flex={1}
        alignItems={'center'}
        justify={'center'}
        className={classNames(styles.tabItem, {
          [styles.activeItem]: active === '2',
        })}
      >
        <Image src={tab1on} className={styles.tabsIco} />
        住院数据
      </Space>
      <Space
        onTap={() => {
          onTap?.('3');
        }}
        flex={1}
        alignItems={'center'}
        justify={'center'}
        className={classNames(styles.tabItem, {
          [styles.activeItem]: active === '3',
        })}
      >
        <Image src={tab1on} className={styles.tabsIco} />
        其他数据
      </Space>
    </Space>
  );
};
