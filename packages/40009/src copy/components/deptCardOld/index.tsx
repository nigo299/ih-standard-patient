import React from 'react';
import { Image, View, navigateTo } from 'remax/one';
import { Space, Button } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { TextAudio } from '@/components';
import styles from './index.less';
import classNames from 'classnames';

export interface IProps {
  deptName: string;
  deptImg?: string;
  deptName2: string;
  doctorSkill?: string;
  deptId?: string;
  className?: string;
}

export default ({
  deptName,
  deptName2,
  deptImg,
  doctorSkill,
  deptId,
}: IProps) => {
  return (
    <Space
      vertical
      justify="space-between"
      className={classNames(styles.card, classNames)}
    >
      <Space justify="space-between">
        <Space className={styles.avatar} justify="center" alignItems="flex-end">
          <Image
            src={deptImg || `${IMAGE_DOMIN}/search/doctor-old.png`}
            className={styles.avatarImg}
            mode="aspectFit"
          />
        </Space>
        <Space flex="auto" vertical justify="flex-start">
          <View className={styles.deptName}>{deptName}</View>
          <View className={styles.deptName2}>{deptName2}</View>
          <View className={styles.skill}>科室简介:{doctorSkill || '暂无'}</View>
        </Space>
      </Space>
      <View className={styles.solid} />
      <Space justify="space-between" alignItems="center">
        <TextAudio
          text={doctorSkill || '当前科室暂无简介'}
          id={deptName}
          size="small"
        />
        <Button
          block={false}
          type="primary"
          elderly
          className={styles.button}
          onTap={() =>
            navigateTo({
              url: `/pages3/register/select-doctor/index?deptId=${deptId}`,
            })
          }
        >
          点击预约
        </Button>
      </Space>
    </Space>
  );
};
