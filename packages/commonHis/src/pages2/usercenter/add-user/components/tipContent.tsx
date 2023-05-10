import React, { memo } from 'react';
import { View, Text } from 'remax/one';
import { Tip } from '@/components';
import styles from './index.less';
export default memo(() => {
  return (
    <Tip
      className={styles.tip}
      items={[
        <View key={'add-tip'} className={styles.tipText}>
          本院实行实名制就诊，
          <Text style={{ color: '#D95E38' }}>请如实填写就诊人信息，</Text>
          如因信息错误产生的一切后果自行负责。
        </View>,
      ]}
    />
  );
});
