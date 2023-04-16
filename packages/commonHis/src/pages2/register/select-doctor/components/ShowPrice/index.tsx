import React from 'react';
import classNames from 'classnames';
import { View } from 'remax/one';
import { Space } from '@kqinfo/ui';
import styles from './index.less';

type RestProps = {
  leftSource: number;
  extFields: {
    doctorInitialRegFee: string | number;
  };
  registerFee: number;
  item?: {
    status?: number;
  };
};

const ShowPrice: React.FC<RestProps> = ({
  leftSource = 0,
  extFields = { doctorInitialRegFee: 0 },
  registerFee = 0,
  item = { status: 0 },
}) => {
  const getPrice = () => {
    if (extFields.doctorInitialRegFee === '0') {
      return '';
    }
    return `¥${((extFields.doctorInitialRegFee as any) / 100).toFixed(2)}`;
  };

  const price = getPrice();
  const num = `¥${(registerFee / 100).toFixed(2)}`;

  return (
    <View
      className={classNames(styles.rests, {
        [styles.disable]: leftSource === 0 || item.status === 2,
      })}
    >
      <Space className={styles.restPrice} alignItems="center" justify="center">
        {price}
      </Space>
      <Space className={styles.restNum} alignItems="center" justify="center">
        {num}
      </Space>
    </View>
  );
};

export default ShowPrice;
