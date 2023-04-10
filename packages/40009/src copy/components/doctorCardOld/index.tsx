import React from 'react';
import { Image, View, Text, navigateTo } from 'remax/one';
import { Space, Button } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { TextAudio } from '@/components';
import styles from './index.less';
import classNames from 'classnames';

export interface IProps {
  doctorImg?: string;
  doctorName: string;
  doctorTitle?: string;
  deptName: string;
  doctorSkill?: string;
  doctorId?: string;
  deptId?: string;
  className?: string;
}

export default ({
  deptName,
  doctorImg,
  doctorName,
  doctorSkill,
  doctorTitle,
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
            src={doctorImg || `${IMAGE_DOMIN}/search/doctor-old.png`}
            className={styles.avatarImg}
            mode="aspectFit"
          />
        </Space>
        <Space flex="auto" vertical justify="flex-start">
          <View className={styles.doctorName}>
            {doctorName}
            {doctorTitle && `|${doctorTitle}`}
          </View>
          <View className={styles.deptName}>{deptName}</View>
          <View className={styles.skill}>
            擅长:
            <Text>{doctorSkill || '暂无'}</Text>
          </View>
        </Space>
      </Space>
      <View className={styles.solid} />
      <Space justify="space-between" alignItems="center">
        <TextAudio
          text={doctorSkill || '当前医生暂无擅长'}
          id={doctorName}
          size="small"
        />
        <Button
          type="primary"
          elderly
          className={styles.button}
          block={false}
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
