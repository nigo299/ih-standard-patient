import React from 'react';
import { View, Image } from 'remax/one';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import styles from './index.less';
import useApi from '@/apis/payment';
import { ListItem, RegisterCardOld } from '@/components';
import useGetParams from '@/utils/useGetParams';
import { PartTitle } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';

export default () => {
  const {
    hisOrderNo,
    deptName,
    doctorName,
    patCardNo,
    patientId,
    patientName,
  } = useGetParams<{
    hisOrderNo: string;
    deptName: string;
    doctorName: string;
    patientName: string;
    patCardNo: string;
    patientId: string;
  }>();
  const {
    data: { data: waitOpDetail },
  } = useApi.查询门诊待缴费详情({
    initValue: {
      data: { waitOpList: [] },
    },
    params: {
      patientId,
      hisOrderNo: decodeURIComponent(hisOrderNo),
    },
    needInit: !!patientId && !!hisOrderNo,
  });
  const infoList = [
    {
      label: '就诊人',
      text: patientName,
    },
    {
      label: '性别',
      text: waitOpDetail?.gender === 'M' ? '男' : '女',
    },
    {
      label: '年龄',
      text: `${waitOpDetail?.age}岁`,
    },
    {
      label: '就诊号',
      text: patCardNo,
    },
  ];
  const clinicList = [
    {
      label: '开单医院',
      text: waitOpDetail?.hisName,
    },
    {
      label: '开单科室',
      text: deptName,
    },
    {
      label: '开单医生',
      text: doctorName,
    },
    {
      label: '开单时间',
      text: waitOpDetail?.date,
    },
    {
      label: '项目类别',
      text: waitOpDetail?.payName || '检查项目',
    },
  ];
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '订单详情',
    });
  });
  return (
    <View className={styles.page}>
      <View className={styles.top}>
        <Image
          src={`${IMAGE_DOMIN}/payment/wait.png`}
          className={styles.statusImg}
        />
        <View>
          <View className={styles.status}>等待缴费</View>
          <View className={styles.statusInfo}>
            请在今日23:59分前完成缴费，超时订单将自动取消
          </View>
        </View>
      </View>
      <RegisterCardOld payName="register" patCardNo={patCardNo || ''} />
      <PartTitle full bold elderly>
        就诊人信息
      </PartTitle>
      <View className={styles.cards}>
        <View className={styles.card}>
          {infoList.map((item) => (
            <ListItem key={item.label} {...item} elderly />
          ))}
        </View>
      </View>
      <PartTitle full bold elderly>
        开单信息
      </PartTitle>
      <View className={styles.cards}>
        <View className={styles.card}>
          {clinicList.map((item) => (
            <ListItem key={item.label} {...item} elderly />
          ))}
        </View>
      </View>
    </View>
  );
};
