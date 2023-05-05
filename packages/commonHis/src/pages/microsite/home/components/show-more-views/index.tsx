import React, { useCallback } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { Space, showToast } from '@kqinfo/ui';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';
import openLocation from '@/utils/openLocation';
import regsiterState from '@/stores/register';
export default () => {
  const { getDeptList } = regsiterState.useContainer();
  const HEADER_ACTIONS: Array<{
    key: number;
    icon: string;
    title: string;
    action: string;
    onTap?: () => void;
  }> = [
    {
      title: '医院介绍',
      action: '/pages/microsite/hospital-summary/index',
      icon: `${IMAGE_DOMIN}/microsite/yyjs.png`,
      key: 0,
    },
    {
      title: '科室分布',
      action: '/pages/microsite/dept-distribute/index',
      icon: `${IMAGE_DOMIN}/microsite/ksfb.png`,
      key: 1,
    },
    {
      title: '科室介绍',
      action: '/pages/microsite/dept-summary/index?type=default',
      icon: `${IMAGE_DOMIN}/microsite/ksjs.png`,
      key: 2,
    },
    {
      title: '医生介绍',
      action: '/pages/microsite/dept-summary/index?type=default&doctor=true',
      icon: `${IMAGE_DOMIN}/microsite/ysjs.png`,
      key: 3,
    },
    {
      title: '来院导航',
      action: '',
      icon: `${IMAGE_DOMIN}/microsite/lydh.png`,
      onTap: () => openLocation(),
      key: 4,
    },
  ];
  const handleNavClick = useCallback(
    async (nav) => {
      if (nav?.open) {
        showToast({
          title: '功能开发中，敬请期待',
          icon: 'none',
        });
        return;
      }
      if (nav?.onTap) {
        nav.onTap();
        return;
      }
      if (nav?.title === '科室介绍' || '医生介绍') {
        getDeptList('default');
      }
      navigateTo({
        url: nav.action,
      });
    },
    [getDeptList],
  );
  return (
    <View className={styles['container-warp']}>
      <Space className={styles.cardNav} flexWrap="wrap">
        {HEADER_ACTIONS.map((item) => (
          <Space
            vertical
            key={item.key}
            alignItems="center"
            className={styles.card}
            onTap={() => handleNavClick(item)}
          >
            <Image src={item.icon} className={styles.cardImg} />
            <View className={styles.cardTitle}>{item.title}</View>
          </Space>
        ))}
      </Space>
    </View>
  );
};
