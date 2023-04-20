import React from 'react';
import { View, Text, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { HOSPITAL_NAME, IMAGE_DOMIN } from '@/config/constant';
import { Space, Shadow, PartTitle, RichText, Button } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import styles from './index.less';
import { PreviewImage } from '@/components';
import useApi from '@/apis/register';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { deptId, doctorId, reg, scheduleDate, type } = useGetParams<{
    deptId: string;
    doctorId: string;
    reg: boolean;
    scheduleDate: string;
    type: 'reserve' | 'day';
  }>();
  const {
    data: { data: doctorDetail },
  } = useApi.查询医生详情({
    params: {
      doctorId,
      deptNo: deptId,
    },
    needInit: !!doctorId,
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '医生介绍',
    });
  });
  return (
    <View className={styles.page}>
      <View className={styles.top} />
      <View className={styles.card}>
        <Shadow card>
          <Space alignItems="center" className={styles.cardWrap}>
            <PreviewImage
              url={doctorDetail?.image || `${IMAGE_DOMIN}/register/doctor.png`}
              className={styles.doctorImg}
            />
            <Space vertical size={10}>
              <Text className={styles.cardTitle}>
                {doctorDetail?.name || '医师'}
              </Text>
              <Text>{`${doctorDetail?.deptName || ''} | ${
                doctorDetail?.level || ''
              }`}</Text>
              <Text style={{ color: '#666' }}>{doctorDetail?.hisName}</Text>
            </Space>
          </Space>
        </Shadow>
      </View>
      <View className={styles.content}>
        <PartTitle className={styles.partTitle} bold full>
          执业点
        </PartTitle>
        <Space alignItems="center">
          <TextWrap text={doctorDetail?.hisName || HOSPITAL_NAME} />
          <Text className={styles.tag}>{doctorDetail?.hisDistrict}</Text>
        </Space>
        <PartTitle className={styles.partTitle} bold full>
          擅长领域
        </PartTitle>
        <TextWrap
          text={
            doctorDetail?.specialty && doctorDetail?.specialty !== 'null'
              ? doctorDetail?.specialty
              : '暂无'
          }
        />
        <PartTitle className={styles.partTitle} bold full>
          医生介绍
        </PartTitle>
        {doctorDetail?.introduction && doctorDetail?.introduction !== 'null' ? (
          <RichText
            nodes={doctorDetail?.introduction}
            className={styles.textWrap}
          />
        ) : (
          <TextWrap text={'暂无'} />
        )}
      </View>
      {!!reg && (
        <Button
          type={'primary'}
          ghost
          className={styles.btn}
          onTap={() => {
            console.log(doctorDetail);
            navigateTo({
              url: `/pages2/register/select-time/index?deptId=${deptId}&doctorId=${doctorDetail?.doctorId}&scheduleDate=${scheduleDate}&type=${type}`,
            });
          }}
        >
          进入医生挂号
        </Button>
      )}
    </View>
  );
};

const TextWrap = ({ text }: { text: string }) => (
  <View className={styles.textWrap}>{text}</View>
);
