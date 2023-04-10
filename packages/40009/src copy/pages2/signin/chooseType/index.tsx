import React, { useState } from 'react';
import { View, Image, navigateTo, Text } from 'remax/one';
import { Shadow, showToast } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import { usePageEvent } from 'remax/macro';
import { Tip } from '@/components';
import setNavigationBar from '@/utils/setNavigationBar';

export default () => {
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '选择签到',
    });
  });
  const [types] = useState(() => {
    return [
      {
        key: 'gh',
        icon: `${IMAGE_DOMIN}/signin/register.png`,
        title: '挂号签到',
        onTap: () => {
          navigateTo({
            url: '/pages2/signin/search/index',
          });
        },
      },
      {
        key: 'jc',
        icon: `${IMAGE_DOMIN}/signin/exam.png`,
        title: '检查签到',
        onTap: () => {
          navigateTo({
            url: '/pages2/signin/search/index',
          });
        },
      },
      {
        key: 'jy',
        icon: `${IMAGE_DOMIN}/signin/test.png`,
        title: '检验签到',
        onTap: () => {
          showToast({
            icon: 'none',
            title: '暂未开通',
          });
        },
      },
    ];
  });

  return (
    <View className={styles.page}>
      <View
        className={styles.banner}
        onLongTap={() => {
          navigateTo({
            url: '/pages/search/index',
          });
        }}
      >
        <Image
          className={styles.bannerImage}
          src={`${IMAGE_DOMIN}/signin/topBg.png`}
          mode="aspectFit"
        />
      </View>
      <View className={styles.types}>
        {types.map((type) => {
          return (
            <Shadow key={type.key}>
              <View className={styles.typesItem} onTap={type.onTap}>
                <Image
                  className={styles.typesItemIcon}
                  src={type.icon}
                  mode="aspectFit"
                />
                <View className={styles.typesItemText}>{type.title}</View>
              </View>
            </Shadow>
          );
        })}
      </View>

      <View className={styles.tips}>
        <Tip
          items={[
            <View key={1} className={styles.itemCls}>
              1、为保证定位准确，请开启手机定位功能
            </View>,
            <View key={2} className={styles.itemCls}>
              2、
              <Text className={styles.important}>
                请提前就诊时间30分钟到院签到；
              </Text>
              若超过就诊开始时间视为超时签到，签到后患者将按当前医生队列末尾；
              <Text className={styles.important}>
                上午签到终止时间为12:00，下午签到终止时间为18:00。超过签到终止时间无法签到，
              </Text>
              视为号源作废，患者可到 线下窗口进行退费。
            </View>,
            <View key={3} className={styles.itemCls}>
              3、签到成功后排队显示屏将有您的名字，请在候诊区候诊等待呼叫（如签到成功后未显示您的名字请咨询分诊处）
            </View>,
          ]}
        />
      </View>
    </View>
  );
};
