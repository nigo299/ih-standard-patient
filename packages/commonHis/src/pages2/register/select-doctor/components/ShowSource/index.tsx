import React from 'react';
import classNames from 'classnames';
import { View } from 'remax/one';
import { Space } from '@kqinfo/ui';
import styles from './index.less';

type RestProps = {
  leftSource: number;
  registerFee: number;
  item: {
    status: 0 | 1 | 2;
  };
};

const ShowSource: React.FC<RestProps> = ({ leftSource, registerFee, item }) => {
  const getNum = () => {
    if (item.status === 0) {
      return '停诊';
    } else if (item.status === 2) {
      return '满诊';
    } else {
      return `余号: ${leftSource > 0 ? leftSource : 0}`;
    }
  };

  const num = getNum();

  return (
    <View
      className={classNames(styles.rests, {
        [styles.disable]: leftSource === 0 || item.status === 2,
      })}
    >
      <Space className={styles.restPrice} alignItems="center" justify="center">
        <View className={styles.restPriceAfter} />¥
        {(registerFee / 100).toFixed(2)}
      </Space>
      <Space className={styles.restNum} alignItems="center" justify="center">
        {num}
      </Space>
    </View>
  );
};

export default ShowSource;
