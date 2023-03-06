import React from 'react';
import { View, Image, Text, redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space } from '@kqinfo/ui';
import { ListItem } from '@/components';
import patientState from '@/stores/patient';
import { IMAGE_DOMIN } from '@/config/constant';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';

export default () => {
  const { patientId } = useGetParams<{ patientId: string }>();
  const {
    defaultPatientInfo: { patientName, patCardNo },
  } = patientState.useContainer();

  const clinicList = [
    {
      label: '就诊科室',
      text: '内分泌及代谢病科',
    },
    {
      label: '医生信息',
      text: '凯小桥',
    },
    {
      label: '住院号',
      text: '2021-03-30  08:48:00',
    },
    {
      label: '就诊位置',
      text: '1号楼门诊大楼3层A区301诊室',
    },
  ];

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '排队进度',
    });
    if (!patientId) {
      redirectTo({
        url: '/pages2/usercenter/user-list/index?pageRoute=/pages/queue/index',
      });
    }
  });
  return (
    <View className={styles.main}>
      <View className={styles.top} />
      <View className={styles.box}>
        <View className={styles.content}>
          <View className={styles.user}>
            <View className={styles.avatar}>
              <Image
                className={styles.avatarImg}
                src={`${IMAGE_DOMIN}/inhosp/jzr.png`}
              />
            </View>
            <View className={styles.titleBox}>
              <View className={styles.userName}>{patientName || '未知'}</View>
              <View className={styles.titleContent}>
                <View className={styles.titleLabel}>就诊号：</View>
                <View className={styles.titleName}>{patCardNo}</View>
              </View>
            </View>
          </View>
          <View className={styles.mainContent}>
            <Space size={20} justify="space-between">
              <Space
                className={styles.mainBox}
                vertical
                justify="center"
                alignItems="center"
              >
                <View className={styles.text}>前面还有</View>
                <View className={styles.text2}>2</View>
                <View className={styles.text3}>人在排队</View>
              </Space>
              <Space
                className={styles.mainBox2}
                vertical
                justify="center"
                alignItems="center"
              >
                <View className={styles.text}>您的就诊序号</View>
                <View className={styles.text2}>5</View>
                <View className={styles.text3}>等待叫号</View>
              </Space>
            </Space>
          </View>
        </View>

        <View className={styles.cards}>
          <View className={styles.card}>
            {clinicList.map((item) => (
              <ListItem key={item.label} {...item} elderly />
            ))}
          </View>
        </View>

        <View
          className={styles.changeBtn}
          onTap={() =>
            redirectTo({
              url: '/pages3/usercenter/select-user/index?pageRoute=/pages3/inhosp/home/index',
            })
          }
        >
          <Image
            src={`${IMAGE_DOMIN}/home/switch-old.png`}
            className={styles.switchImg}
            mode="aspectFit"
          />
          <Text>切换就诊人</Text>
        </View>
      </View>
    </View>
  );
};
