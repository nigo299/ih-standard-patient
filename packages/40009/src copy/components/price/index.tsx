import { View } from 'remax/one';
import React from 'react';
import BigNumber from 'bignumber.js';
import styles from './index.less';
import classNames from 'classnames';

export default ({ payFee, elderly }: { payFee: number; elderly?: boolean }) => {
  const price = new BigNumber(payFee || 0).div(100);
  const precision = price?.toFixed(2)?.split('.')[1];
  return (
    <View
      className={classNames(styles.price, {
        [styles.elderly]: elderly,
      })}
    >
      <View className={styles.small}>{payFee === undefined ? '-' : '￥'}</View>
      <View>
        {payFee === undefined ? '-' : price.toFixed(0, BigNumber.ROUND_DOWN)}
      </View>
      <View className={styles.small}>
        {payFee === undefined ? '-' : `.${precision}`}
      </View>
    </View>
  );
};
