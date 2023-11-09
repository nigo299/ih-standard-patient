import React, { ReactNode, useEffect } from 'react';
import { View } from 'remax/one';
import styles from './index.less';
import { Icon, Space } from '@kqinfo/ui';

export default ({
  children,
  onClose,
}: {
  children?: ReactNode;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  return (
    <View className={styles.affirmSheetBox}>
      <View
        className={styles.mask}
        onTap={() => {
          onClose?.();
        }}
      />
      <View className={styles.affirmSheet}>
        <Space
          className={styles.affirmSheetTop}
          alignItems="center"
          justify="space-between"
        >
          团队成员{' '}
          <Icon
            name="kq-clear"
            onTap={() => {
              onClose?.();
            }}
          />
        </Space>
        <View className={styles.affirmSheetContent}>{children}</View>
      </View>
    </View>
  );
};
