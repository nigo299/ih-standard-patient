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
          本院实行实名制就诊，请如实填写就诊人信息（如需修改，请持本人有效证件到人工窗口处理），如因信息错误产生的一切后果自行负责。实名认证：儿童必须由监护人进行认证，60岁及以上老年人可由代理人进行认证。
        </View>,
      ]}
    />
  );
});
