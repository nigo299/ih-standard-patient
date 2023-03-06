import { navigateToMiniProgram } from '@kqinfo/ui';
import React from 'react';
import { View } from 'remax/one';
import styles from './index.less';

export default () => (
  <View
    className={styles.text}
    onTap={() =>
      navigateToMiniProgram({
        appId: 'wxa32e92eee745b33c',
        path: `pages/chat/index?subhospitalId=30&hospitalId=19`,
      })
    }
  >
    意见反馈
  </View>
);
