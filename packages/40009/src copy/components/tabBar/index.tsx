import React from 'react';
import { Text, View, Image, redirectTo, navigateTo } from 'remax/one';
import { Space } from '@kqinfo/ui';
import { tabBarConfig } from '@/config';
import classNames from 'classnames';
import styles from './index.less';

export default (props: { active: '首页' | '我的'; className?: string }) => (
  <View className={classNames(styles.fixed, props.className)}>
    <View className={styles.tabBar}>
      {tabBarConfig.map((tab) => (
        <Space
          key={tab.title}
          vertical
          justify="center"
          alignItems="center"
          className={classNames(styles.item, {
            [styles.active]: props.active === tab.title,
          })}
          onTap={() => {
            if (process.env.REMAX_PLATFORM === 'web') {
              navigateTo({
                url: tab.url,
              });
            } else {
              redirectTo({ url: tab.url });
            }
          }}
        >
          <Image
            src={props.active === tab.title ? tab.activeImage : tab.image}
            className={styles.img}
          />
          <Text>{tab.title}</Text>
        </Space>
      ))}
    </View>
  </View>
);
