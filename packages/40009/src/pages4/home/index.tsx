import React from 'react';
import { View, Text, Image, navigateTo } from 'remax/one';
import { useTitle, Space, Tip } from '@kqinfo/ui';
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
            url: '/pages4/booking/team/index',
          },
          {
            name: '预约记录',
            icon: `${IMAGE_DOMIN}/mdt/menu2.png`,
            url: '/pages4/bookRecords/index',
          },
        ].map((item, index) => (
          <Space
            className={styles.menu}
            key={index}
            alignItems="center"
            justify="center"
            onTap={() => {
              navigateTo({
                url: item.url,
              });
            }}
          >
            <Image src={item.icon} className={styles.icon} />
            <Text className={styles.menuTxt}>{item.name}</Text>
          </Space>
        ))}
        <Tip
          title={'服务简介'}
          items={[
            '多学科联合门诊（MDT） 是由多学科资深专家以共同讨论的方式，为患者制定个性化诊疗方案的过程，患者可得到由多学科专家组成的专家团队的综合评估，并共同制定系统性、专业化、规范化、个体化治疗方案。',
          ]}
        ></Tip>
      </View>
    </View>
  );
};
