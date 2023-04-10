import React from 'react';
import { View, Image, reLaunch, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Button } from '@kqinfo/ui';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import styles from './index.less';
import classNames from 'classnames';

export default () => {
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '就诊人管理',
    });
  });

  return (
    <View className={styles.page}>
      <Space
        alignItems="center"
        className={styles.item}
        onTap={() =>
          navigateTo({
            url: '/pages3/usercenter/select-adduser/index?patientType=0&jumpPage=home',
          })
        }
      >
        <View className={styles.avatar}>
          <Image
            src={`${IMAGE_DOMIN}/usercenter/aldult-old.png`}
            className={styles.avatarImg}
            mode="aspectFit"
          />
        </View>
        <View className={styles.text}>
          点击添加<Text className={styles.text2}>成人</Text>就诊人
        </View>
      </Space>
      <Space
        alignItems="center"
        className={classNames(styles.item, styles.item2)}
        onTap={() =>
          navigateTo({
            url: '/pages3/usercenter/select-adduser/index?patientType=1&jumpPage=home',
          })
        }
      >
        <View className={styles.avatar}>
          <Image
            src={`${IMAGE_DOMIN}/usercenter/child-old.png`}
            className={styles.avatarImg}
            mode="aspectFit"
          />
        </View>
        <View className={styles.text}>
          点击添加<Text className={styles.text2}>儿童</Text>就诊人
        </View>
      </Space>
      <View className={styles.tip}>注：选择成人或者儿童进行添加就诊人</View>
      <View className={styles.button}>
        <Button
          type="primary"
          ghost
          onTap={() => {
            if (PLATFORM === 'web') {
              navigateTo({
                url: '/pages/home/index',
              });
            } else {
              reLaunch({
                url: '/pages/home/index',
              });
            }
          }}
        >
          点击返回首页
        </Button>
      </View>
    </View>
  );
};
