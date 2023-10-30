import React from 'react';
import { View, Image, Text, navigateTo } from 'remax/one';
import { Shadow, Space, Exceed, Price, Button } from '@kqinfo/ui';
import userSrc from '../assets/images/user.png';
import styles from './index.less';
const ListItem: React.FC = () => {
  const handleTap = () => {
    navigateTo({ url: '/pages4/booking/team/detail' });
  };
  return (
    <Shadow>
      <View className={styles.box}>
        <Space size={'10px'}>
          <View className={styles.box_left}>
            <Image
              src={`${userSrc}`}
              style={{ width: '60px', height: '60px' }}
              mode="aspectFill"
            />
            <Text className={`${styles.txt} ${styles.top}`}>线下会诊</Text>
            <Text className={`${styles.txt} ${styles.bottom}`}>线上会诊</Text>
          </View>
          <View className={styles.box_right}>
            <Text className={styles.title}>多学科联合肥厚性心肌病</Text>
            <Text className={styles.commonTxt}>重庆松山医院</Text>
            <Exceed className={styles.commonTxt} clamp={1}>
              简介：23321321321
            </Exceed>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text className={styles.commonColor}> ￥{300}/次</Text>
              <Button
                type={'primary'}
                block={false}
                size="small"
                onTap={() => handleTap()}
              >
                预约会诊
              </Button>
            </View>
          </View>
        </Space>
      </View>
    </Shadow>
  );
};

export default ListItem;
