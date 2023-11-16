import React, { useCallback } from 'react';
import { View, redirectTo, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { getPatientAge } from '@/utils';
import { WhiteSpace, ListItem, Tip } from '@/components';
import {
  Shadow,
  PartTitle,
  Button,
  Space,
  showToast,
  useTitle,
  Price,
} from '@kqinfo/ui';
import classNames from 'classnames';
import useApi from '@/apis/mdt';
import { PLATFORM } from '@/config/constant';
import { useEffectState } from 'parsec-hooks';
import useGetParams from '@/utils/useGetParams';
import patientState from '@/stores/patient';
import styles from './index.less';
import { PatGender } from '@/config/dict';

export default () => {
  useTitle('确认会诊信息');
  const {
    roomId,
    roomName,
    teamId,
    resourceId,
    mdtFee,
    hospitalName,
    hospitalZone,
    teamName,
    Time,
    position,
  } = useGetParams<{
    roomId: string;
    roomName: string;
    teamId: string;
    resourceId: string;
    mdtFee: string;
    hospitalName: string;
    hospitalZone: string;
    teamName: string;
    Time: string;
    position: string;
  }>();
  const { defaultPatientInfo, originalBindPatientList, getPatientList } =
    patientState.useContainer();
  const hospitalData = [
    {
      label: '就诊医院',
      text: decodeURIComponent(hospitalName),
    },
    {
      label: '就诊院区',
      text: decodeURIComponent(hospitalZone),
    },
    {
      label: '会诊团队',
      text: decodeURIComponent(teamName),
    },
    {
      label: '会诊时间',
      text: decodeURIComponent(Time),
    },
    {
      label: '诊室位置',
      text: decodeURIComponent(position),
    },
  ];
  console.log('mdtFee', mdtFee);
  const [selectedPatient, setSelectedPatient] =
    useEffectState(defaultPatientInfo);
  const patientData = [
    {
      label: '会诊费用',
      text: <Price price={+mdtFee || 0} />,
    },
    {
      label: '就诊号',
      text: selectedPatient?.patCardNo || '-',
    },
    {
      label: '患者姓名',
      text: selectedPatient?.patientName
        ? `${selectedPatient?.patientName} | ${
            PatGender[selectedPatient?.patientSex] || ''
          } | ${getPatientAge(selectedPatient?.patientAge)}`
        : '-',
    },
  ];
  const { loading, request: orderRequest } = useApi.线下MDT下单({
    initValue: { data: {} },
    needInit: false,
  });
  const handleRegisterConfim = useCallback(async () => {
    if (!selectedPatient?.patientId) {
      showToast({
        title: '请选择就诊人',
      });
      return;
    }
    orderRequest({
      roomId: decodeURIComponent(roomId),
      roomName: decodeURIComponent(roomName),
      patientId: selectedPatient?.patientId,
      teamId: decodeURIComponent(teamId),
      resourceId: decodeURIComponent(resourceId),
      mdtFee: +mdtFee,
    }).then((res) => {
      if (res.data) {
        redirectTo({
          url: `/pages4/cash/index?id=${res.data.id}`,
        });
      }
    });
  }, [
    mdtFee,
    orderRequest,
    resourceId,
    roomId,
    roomName,
    selectedPatient.patientId,
    teamId,
  ]);
  usePageEvent('onShow', () => {
    getPatientList();
  });

  return (
    <View className={styles.page}>
      <PartTitle>请确认会诊信息</PartTitle>
      <WhiteSpace />
      <Shadow card>
        <Space vertical>
          {hospitalData.map((item) => (
            <ListItem key={item.label} {...item} aligin="flex-end" />
          ))}
        </Space>
      </Shadow>
      <WhiteSpace />
      <Shadow card>
        <Space vertical>
          {patientData.map((item) => (
            <ListItem key={item.label} {...item} aligin="flex-end" />
          ))}
          <Space className={styles.patients} size={22} ignoreNum={5}>
            {(originalBindPatientList || [])?.map((item, index) => (
              <Space
                justify="center"
                alignItems="center"
                key={index}
                className={classNames(styles.patient, {
                  [styles.patientSelect]:
                    item?.patientId === selectedPatient?.patientId,
                })}
                onTap={() => {
                  setSelectedPatient(item);
                }}
              >
                {item.patientName}
              </Space>
            ))}
            {originalBindPatientList?.length < 5 && (
              <Space
                alignItems="center"
                justify="center"
                className={classNames(styles.patient, styles.add)}
                onTap={() => {
                  navigateTo({
                    url: '/pages2/usercenter/add-user/index',
                  });
                }}
              >
                +新增
              </Space>
            )}
          </Space>
        </Space>
      </Shadow>
      <WhiteSpace />
      <Tip
        className={styles.tip}
        items={[
          <View className={styles.tipText} key="confirm-text">
            <View>1.目前仅支持自费会诊；</View>
            <View>
              2.请在预约挂号成功后60分钟内完成支付，超出时间后系统将自动取消订单；
            </View>
            <View>
              3.本次参与会诊人员，将根据会诊团队内部成员实际情况酌情安排。
            </View>
          </View>,
        ]}
      />
      <Button
        type="primary"
        className={classNames(styles.button, {
          [styles.buttonAli]: PLATFORM === 'ali',
        })}
        onTap={() => {
          handleRegisterConfim();
        }}
        loading={loading}
        disabled={!selectedPatient?.patientId || loading}
      >
        确定预约
      </Button>
    </View>
  );
};
