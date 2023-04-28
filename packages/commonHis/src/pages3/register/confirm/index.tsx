import React, { useState, useCallback } from 'react';
import { View, navigateTo, reLaunch, Text, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { analyzeIDCard } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { ListItem, TextAudio } from '@/components';
import { PartTitle, Button, Space, showToast } from '@kqinfo/ui';
import payState from '@/stores/pay';
import { IMAGE_DOMIN } from '@/config/constant';
import registerState from '@/stores/register';
import patientState from '@/stores/patient';
import useApi from '@/apis/register';
import usePayApi from '@/apis/pay';
import { returnUrl } from '@/utils';
import { PLATFORM, PAY_TYPE } from '@/config/constant';
import dayjs from 'dayjs';
import styles from './index.less';
import { PatGender } from '@/config/dict';

export default () => {
  const {
    confirmInfo: {
      deptId,
      hisName,
      deptName,
      doctorName,
      totalFee,
      doctorTitle,
      doctorId,
      scheduleId,
      scheduleDate,
      visitBeginTime,
      visitEndTime,
      visitPeriod,
    },
  } = registerState.useContainer();
  const { defaultPatientInfo } = patientState.useContainer();
  const { setOrderInfo } = payState.useContainer();
  const hospitalData = [
    {
      label: '就诊医院',
      text: hisName,
    },
    {
      label: '就诊科室',
      text: deptName,
    },
    {
      label: '就诊医生',
      text: doctorName,
    },
    {
      label: '医生职称',
      text: doctorTitle,
    },
    {
      label: '就诊时间',
      text: `${scheduleDate} ${visitBeginTime}-${visitEndTime}`,
    },
    {
      label: '就诊位置',
      text: '暂无',
      // text: selectedDept?.address
    },
  ];
  const [payFlag, setPayFlag] = useState(false);
  const handleRegisterConfim = useCallback(async () => {
    setPayFlag(true);
    const { code, data, msg } = await useApi.锁号.request({
      deptId,
      doctorId,
      scheduleDate,
      scheduleId,
      visitBeginTime,
      visitEndTime,
      visitPeriod,
      patientId: defaultPatientInfo.patientId,
    });
    if (code === 0 && data.orderId) {
      const isTody = scheduleDate === dayjs().format('YYYY-MM-DD');
      // 0元支付
      if (Number(totalFee) === 0) {
        const url = PAY_TYPE[isTody ? 'DBGH' : 'YYGH'].detail;
        if (PLATFORM === 'web') {
          navigateTo({
            url: `${url}?orderId=${data.orderId}`.replace('pages2', 'pages3'),
          });
        } else {
          reLaunch({
            url: `${url}?orderId=${data.orderId}`.replace('pages2', 'pages3'),
          });
        }
        return;
      }
      if (PLATFORM === 'web') {
        // H5 支付逻辑
        const result = await usePayApi.h5支付下单.request({
          orderId: data.payOrderId,
          callbackUrl: `${returnUrl()}#/pages/waiting/index?bizType=${
            isTody ? 'DBGH' : 'YYGH'
          }&orderId=${data.orderId}`,
        });
        if (result.code === 0 && result.data) {
          window.location.href = result.data;
        }
      } else {
        // 小程序收银台
        setOrderInfo({
          bizType: isTody ? 'DBGH' : 'YYGH',
          hisName: hisName,
          deptName: deptName,
          doctorName: doctorName,
          patientName: `${defaultPatientInfo?.patientName} | ${
            PatGender[defaultPatientInfo?.patientSex] || ''
          } | ${
            analyzeIDCard(defaultPatientInfo?.patientFullIdNo)?.analyzeAge ||
            '未知'
          }岁`,
          patCardNo: defaultPatientInfo?.patCardNo,
          registerTime: `${scheduleDate} ${visitBeginTime}-${visitEndTime}`,
          totalFee: totalFee,
          orderId: data.orderId,
          payOrderId: data.payOrderId,
        });
        reLaunch({
          url: '/pages/pay/index',
        });
      }
    } else {
      showToast({
        icon: 'fail',
        title: msg || '下单失败，请重试!',
      });
    }
    setPayFlag(false);
  }, [
    defaultPatientInfo?.patCardNo,
    defaultPatientInfo?.patientFullIdNo,
    defaultPatientInfo.patientId,
    defaultPatientInfo?.patientName,
    defaultPatientInfo?.patientSex,
    deptId,
    deptName,
    doctorId,
    doctorName,
    hisName,
    scheduleDate,
    scheduleId,
    setOrderInfo,
    totalFee,
    visitBeginTime,
    visitEndTime,
    visitPeriod,
  ]);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '确认信息',
    });
  });
  return (
    <View className={styles.page}>
      <Space className={styles.header}>
        <View className={styles.avatar}>
          <Image
            src={`${IMAGE_DOMIN}/usercenter/aldult-old.png`}
            className={styles.avatarImg}
            mode="aspectFit"
          />
        </View>
        <View>
          
          <View className={styles.headName}>
            {defaultPatientInfo?.patientName || '-'}
          </View>
          <View className={styles.headText}>
            <Text>{`性别:   ${
              PatGender[defaultPatientInfo?.patientSex] || ''
            }`}</Text>
            <Text className={styles.headText2}>{`年龄:   ${
              defaultPatientInfo?.patientAge || ''
            }岁`}</Text>
          </View>
        </View>
      </Space>
      <Space className={styles.content} vertical>
        <Space justify="space-between" alignItems="center">
          <PartTitle full elderly bold>
            确认信息
          </PartTitle>
          <View className={styles.rightImg}>
            <TextAudio
              size="small"
              text={`您的挂号信息是，就诊科室：${deptName}；就诊时间：${scheduleDate} ${visitBeginTime}至${visitEndTime}；挂号费：${Number(
                totalFee / 100,
              )}元`}
              id={deptName}
            />
          </View>
        </Space>
        <View className={styles.wrap}>
          <View className={styles.card}>
            {hospitalData.map((item) => (
              <ListItem key={item.label} {...item} elderly />
            ))}
          </View>

          <View className={styles.tip}>
            注：请在5分钟内完成线上支付，超出时间将自动退号处理
          </View>
        </View>
      </Space>
      <Space
        className={styles.footer}
        justify="space-between"
        alignItems="center"
      >
        <View className={styles.totalFee}>{`挂号费: ¥${Number(
          totalFee / 100,
        )}`}</View>
        <Button
          type="primary"
          elderly
          onTap={handleRegisterConfim}
          loading={payFlag}
          block={false}
          className={styles.button}
          disabled={payFlag}
        >
          支付
        </Button>
      </Space>
    </View>
  );
};
