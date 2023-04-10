import React from 'react';
import { Image, View } from 'remax/one';
import { Space } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import classNames from 'classnames';
import styles from './index.less';

export default (props: any) => {
  return (
    <Space
      className={classNames(styles.mask, { [styles.nomask]: !props.noshow })}
      alignItems={'center'}
      justify={'center'}
    >
      <Space
        size={40}
        className={styles.loadingBox}
        vertical
        alignItems={'center'}
        justify={'center'}
      >
        <Image
          className={styles.loadingIcon}
          src={`${IMAGE_DOMIN}/loading.gif`}
        />
        <View className={styles.loadingTxt}>加载中</View>
      </Space>
    </Space>
  );
};
