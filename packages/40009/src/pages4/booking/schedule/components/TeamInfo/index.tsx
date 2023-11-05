import React from 'react';
import { Image, Text } from 'remax/one';
import { Shadow, Space, Exceed } from '@kqinfo/ui';
import cls from 'classnames';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';

export default ({ data = {} }: { data?: any }) => {
  return (
    <Shadow>
      <Space className={cls(styles.box)} vertical size={20}>
        <Space size={20} alignItems="center">
          <Image
            src={data?.avatarImage || `${IMAGE_DOMIN}/mdt/user_icon.png`}
            className={styles.headIcon}
          />
          <Space flex={1} vertical size={20}>
            <Space className={styles.title}>{data?.teamName}</Space>
            <Space className={styles.subTitle} size={20}>
              {data?.diseaseType}
              <Space className={styles.tag}>本部</Space>
            </Space>
          </Space>
        </Space>
        <Space alignItems="center">
          <Space flex={1} className={styles.desc}>
            <Exceed clamp={2}>{data?.intro}</Exceed>
          </Space>
          <Text className={styles.link}>{`详情 >`}</Text>
        </Space>
      </Space>
    </Shadow>
  );
};
