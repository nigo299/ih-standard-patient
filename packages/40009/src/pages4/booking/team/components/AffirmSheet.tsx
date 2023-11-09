import React, { ReactNode } from 'react';
import { View } from 'remax/one';
import styles from './index.less';

export default ({ children }: { children?: ReactNode }) => {
  return (
    <View className={styles.mask}>
      <View className={styles.affirmSheet}>
        <View className={styles.affirmSheetTop}></View>
        <View className={styles.affirmSheetContent}>{children}</View>
      </View>
    </View>
  );
};
