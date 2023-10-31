import React from 'react';
import { View, Text, Image } from 'remax/one';
import { useTitle, Space } from '@kqinfo/ui';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';
export default () => {
  useTitle('多学科门诊MDT');
  return (
    <View className={styles.page}>
      <Image src={`${IMAGE_DOMIN}/mdt/banner.png`} className={styles.banner} />
      <View className={styles.content}>
        {[
          {
            name: 'MDT门诊预约申请',
            icon: `${IMAGE_DOMIN}/mdt/menu1.png`,
            url: '/pages4/mdt/apply/index',
          },
          {
            name: '预约记录',
            icon: `${IMAGE_DOMIN}/mdt/menu2.png`,
            url: '/pages4/mdt/apply/index',
          },
        ].map((item, index) => (
          <Space
            className={styles.menu}
            key={index}
            alignItems="center"
            justify="center"
          >
            <Image src={item.icon} className={styles.icon} />
            <Text className={styles.menuTxt}>{item.name}</Text>
          </Space>
        ))}
      </View>
    </View>
  );
};
