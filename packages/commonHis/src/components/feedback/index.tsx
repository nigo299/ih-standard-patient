import React from 'react';
import { View } from 'remax/one';
import WxOpenLaunchWeapp from '../wxOpenLaunchWeapp';
import styles from './index.less';
export default ({
  path,
  text,
  textSty,
}: {
  path: string;
  text?: string | React.ReactNode;
  textSty?: React.CSSProperties;
}) => (
  <View className={styles.text} style={textSty}>
    {text || '意见反馈'}
    <WxOpenLaunchWeapp username="gh_a8c5ff51e201" path={path} />
  </View>
);
