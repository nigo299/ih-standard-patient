import React from 'react';
import { View, Text, navigateTo } from 'remax/one';
import { Shadow, Exceed, Button, ListItem } from '@kqinfo/ui';
import userSrc from '../assets/images/user.png';
import styles from './index.less';

const Item: React.FC = () => {
  const handleTap = () => {
    navigateTo({ url: '/pages4/booking/team/detail' });
  };
  return (
    <View className={styles.box}>
      <Shadow>
        <ListItem
          className={styles.itemBox}
          img={userSrc}
          imgFooterCls={styles.imgFooter}
          imgFooter={
            <View className={styles.imgFooter}>
              <Text className={`${styles.txt} ${styles.top}`}>线下会诊</Text>
              <Text className={`${styles.txt} ${styles.bottom}`}>线上会诊</Text>
            </View>
          }
          title={
            <Text className={styles.title}>
              多学科联合肥厚性心肌病321奋达科技
            </Text>
          }
          text={
            <View>
              <Text className={styles.commonTxt}>重庆松山医院</Text>
              <Exceed className={styles.commonTxt} clamp={1}>
                简介：23321321321福达合金卡回放进度款怀旧服大会老客户福达合金啊可好看发的哈健康
              </Exceed>
            </View>
          }
          footer={
            <View className={styles.footer}>
              <Text className={`${styles.commonColor} ${styles.price}`}>
                {' '}
                ￥{300}/次
              </Text>
              <Button
                type={'primary'}
                block={false}
                size="small"
                onTap={() => handleTap()}
              >
                预约会诊
              </Button>
            </View>
          }
        ></ListItem>
      </Shadow>
    </View>
  );
};

export default Item;
