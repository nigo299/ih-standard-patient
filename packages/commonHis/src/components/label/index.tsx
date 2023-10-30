import React from 'react';
import { View, Text } from 'remax/one';
import cls from 'classnames';
import { pxToRpx } from '@kqinfo/ui';
import styles from './index.less';

interface LabelTextProps {
  children?: string;
  width?: number;
  className?: string;
}

export default ({ width, children, className }: LabelTextProps) => {
  return (
    <View
      className={cls(styles.wrap, className)}
      style={width ? { width: pxToRpx(width) } : {}}
    >
      {(children?.split('') || []).map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </View>
  );
};
