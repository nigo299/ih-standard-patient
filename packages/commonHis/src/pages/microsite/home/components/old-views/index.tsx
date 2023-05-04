import React from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { Shadow, Space } from '@kqinfo/ui';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';
import classnames from 'classnames';

export default () => {
  const HEADER_ACTIONS: Array<{
    key: number;
    icon: string;
    title: string;
    action: string;
  }> = [
    {
      key: 0,
      icon: `${IMAGE_DOMIN}/newhome/yyjs.png`,
      title: '医院介绍',
      action: '/pages/microsite/hospital-summary/index',
    },
    {
      key: 1,
      icon: `${IMAGE_DOMIN}/newhome/ksfb.png`,
      title: '科室分布',
      action: '/pages/microsite/dept-distribute/index',
    },
  ];

  return (
    <View className={styles['container-warp']}>
      <View className={classnames(styles.header)}>
        {HEADER_ACTIONS.map((item) => (
          <Shadow key={`header-item-${item.key}`} shadowColor={'#5f848e'}>
            <Space
              alignItems="center"
              justify="center"
              flex="auto"
              className={styles['card-warp']}
              onTap={() => {
                if (item.action) {
                  navigateTo({
                    url: item.action,
                  });
                }
              }}
            >
              <Space
                justify="center"
                alignItems="center"
                className={styles.icon}
              >
                <Image src={item.icon} className={styles.image} />
              </Space>
              <View className={styles.label}>{item.title}</View>
            </Space>
          </Shadow>
        ))}
      </View>
    </View>
  );
};
