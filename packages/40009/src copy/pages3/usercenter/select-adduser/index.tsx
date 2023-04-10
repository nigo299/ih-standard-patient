import React from 'react';
import { View, Image, reLaunch, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Button } from '@kqinfo/ui';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';
import classNames from 'classnames';

export default () => {
  const { patientType, jumpPage } = useGetParams<{
    patientType: '0' | '1';
    jumpPage: 'back' | 'home';
  }>();
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '添加就诊',
    });
  });

  return (
    <View className={styles.page}>
      <Space
        alignItems="center"
        className={styles.item}
        onTap={() =>
          navigateTo({
            url: `/pages3/usercenter/add-user/index?patientType=${patientType}&jumpPage=${
              jumpPage || 'back'
            }`,
          })
        }
      >
        <View className={styles.avatar}>
          <Image
            src={`${IMAGE_DOMIN}/usercenter/zzjd-old.png`}
            className={styles.avatarImg}
            mode="aspectFit"
          />
        </View>
        <Space className={styles.right} vertical>
          <Text className={styles.title}>自助建档</Text>
          <Text className={styles.subTitle}>
            持身份证、户口本在线自助 完成实名审核建档
          </Text>
        </Space>
      </Space>
      <Space
        alignItems="center"
        className={classNames(styles.item, styles.item2)}
        onTap={() =>
          navigateTo({
            url: `/pages3/usercenter/bind-user/index?jumpPage=${
              jumpPage || 'back'
            }`,
          })
        }
      >
        <View className={styles.avatar}>
          <Image
            src={`${IMAGE_DOMIN}/usercenter/bdjzk-old.png`}
            className={styles.avatarImg}
            mode="aspectFit"
          />
        </View>
        <Space className={styles.right} vertical>
          <Text className={styles.title}>绑定就诊卡</Text>
          <Text className={styles.subTitle}>
            通过医院实体就诊卡绑定完成 添加就诊人
          </Text>
        </Space>
      </Space>
      <View className={styles.button}>
        <Button
          type="primary"
          onTap={() => {
            if (PLATFORM === 'web') {
              navigateTo({
                url: '/pages3/home/index',
              });
            } else {
              reLaunch({
                url: '/pages3/home/index',
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
