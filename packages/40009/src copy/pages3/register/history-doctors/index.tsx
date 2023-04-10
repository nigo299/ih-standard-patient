import React from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space } from '@kqinfo/ui';
import { NoDataOld, SwitchPatient } from '@/components';
import useApi from '@/apis/register';
import patientState from '@/stores/patient';
import { IMAGE_DOMIN } from '@/config/constant';
import dayjs from 'dayjs';
import styles from './index.less';

export default () => {
  const {
    defaultPatientInfo: { patientName, patCardNo },
  } = patientState.useContainer();
  const {
    data: { data: historyData },
  } = useApi.查询历史挂号记录({
    initValue: {
      data: {
        depts: [],
        doctors: [],
      },
    },
    params: {
      patCardNo,
      size: 5,
    },
    needInit: !!patCardNo,
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '历史医生',
    });
  });
  return (
    <View className={styles.page}>
      <SwitchPatient
        patientName={patientName}
        redirectUrl="/pages3/usercenter/select-user/index?pageRoute=/pages3/register/history-doctors/index"
      />
      <View className={styles.content}>
        {historyData?.doctors?.length >= 1 ? (
          historyData.doctors.map((doctor) => (
            <Space
              className={styles.item}
              key={doctor.name}
              alignItems="center"
              onTap={() =>
                navigateTo({
                  url: `/pages3/register/select-time/index?deptId=${
                    doctor?.deptId
                  }&doctorId=${doctor?.no}&scheduleDate=${dayjs().format(
                    'YYYY-MM-DD',
                  )}`,
                })
              }
            >
              <Space
                className={styles.avatar}
                justify="center"
                alignItems="flex-end"
              >
                <Image
                  src={`${IMAGE_DOMIN}/search/doctor-old.png`}
                  className={styles.avatarImg}
                  mode="aspectFit"
                />
              </Space>
              <Space vertical>
                <View className={styles.name}>
                  {doctor.name}|{doctor.title}
                </View>
                <View className={styles.deptName}>暂无</View>
                <View className={styles.number}>
                  就诊次数：{doctor.visitTimes}
                </View>
              </Space>
            </Space>
          ))
        ) : (
          <NoDataOld />
        )}
      </View>
    </View>
  );
};
