import React from 'react';
import { View, Text, navigateTo } from 'remax/one';
import { Shadow, Exceed, Button, Space } from '@kqinfo/ui';
import { PreviewImage } from '@/components';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';
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
        <Space size={20} className={styles.itemBox}>
          <Space vertical>
            <PreviewImage
              url={content.avatarImage ?? `${IMAGE_DOMIN}/mdt/user_icon.png`}
              className={styles.user_icon}
            />
            <View className={styles.imgFooter}>
              {[MODE.线下, MODE.全部].includes(content.mode) && (
                <View className={`${styles.txt} ${styles.top}`}>线下会诊</View>
              )}
              {[MODE.线上, MODE.全部].includes(content.mode) && (
                <View className={`${styles.txt} ${styles.bottom}`}>
                  线上会诊
                </View>
              )}
            </View>
          </Space>
          <Space vertical className={styles.box_right}>
            <View className={styles.title}>{content.teamName}</View>
            <View className={styles.desc}>
              <View className={styles.hos_name}>{content.hospitalName}</View>
              <Exceed clamp={2}>简介：{content.summary}</Exceed>
            </View>
            <View className={styles.footer}>
              <Text className={`${styles.commonColor} ${styles.price}`}>
                {' '}
                ￥{Number(content.price || 0) / 100}/次
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
          </Space>
        </Space>
      </Shadow>
    </View>
  );
};

export default Item;
