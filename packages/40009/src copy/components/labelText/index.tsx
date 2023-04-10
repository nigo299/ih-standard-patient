import React from 'react';
import { View, Text } from 'remax/one';
import cls from 'classnames';
import styles from './index.less';

interface LabelTextProps {
  label: string;
  hiderBorder?: boolean;
  content?: string | number;
  children?: React.ReactNode;
}

export default ({ label, content, hiderBorder, children }: LabelTextProps) => {
  return (
    <View
      className={cls(styles.wrap, {
        [styles.hideBorder]: hiderBorder,
      })}
    >
      <View className={styles.label}>{label}</View>
      {content === void 0 ? (
        children
      ) : (
        <Text className={styles.content}>{content}</Text>
      )}
    </View>
  );
};
