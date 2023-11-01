import React from 'react';
import { View, Text, navigateTo } from 'remax/one';
import { Shadow, Exceed, Button, ListItem } from '@kqinfo/ui';
import styles from './index.less';
import { Team } from '@/apis/mdt';

interface Props {
  content: Team;
}

const MODE = {
  线下: 1,
  线上: 2,
  全部: 3,
};

const Item: React.FC<Props> = (props) => {
  const { content } = props;
  const handleTap = (teamId: string) => {
    navigateTo({ url: `/pages4/booking/team/detail?teamId=${teamId}` });
  };
  return (
    <View className={styles.box}>
      <Shadow>
        <ListItem
          className={styles.itemBox}
          img={content.avatarImage}
          imgFooterCls={styles.imgFooter}
          imgFooter={
            <View className={styles.imgFooter}>
              {[MODE.线下, MODE.全部].includes(content.mode) && (
                <Text className={`${styles.txt} ${styles.top}`}>线下会诊</Text>
              )}
              {[MODE.线上, MODE.全部].includes(content.mode) && (
                <Text className={`${styles.txt} ${styles.bottom}`}>
                  线上会诊
                </Text>
              )}
            </View>
          }
          title={<Text className={styles.title}>{content.teamName}</Text>}
          text={
            <View>
              <Text className={styles.commonTxt}>{content.hospitalName}</Text>
              <Exceed className={styles.commonTxt} clamp={1}>
                {content.intro}
              </Exceed>
            </View>
          }
          footer={
            <View className={styles.footer}>
              <Text className={`${styles.commonColor} ${styles.price}`}>
                {' '}
                ￥{Number(content.price) / 100}/次
              </Text>
              <Button
                type={'primary'}
                block={false}
                size="small"
                onTap={() => handleTap(content.id)}
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
