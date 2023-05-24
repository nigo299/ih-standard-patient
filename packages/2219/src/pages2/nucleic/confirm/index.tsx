import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  FormItem,
  Space,
  PartTitle,
  ColorText,
  Button,
  showToast,
} from '@kqinfo/ui';
import {
  HOSPITAL_NAME,
  IMAGE_DOMIN,
  NUCLEIC_INVESTIGATION,
  PLATFORM,
} from '@/config/constant';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/usercenter';
import useRegisterApi from '@/apis/register';
import usePaymentApi from '@/apis/payment';
import useCommonApi from '@/apis/common';
import { NucleicQrcode } from '@/components';
import styles from './index.less';
import showModal from '@/utils/showModal';
import storage from '@/utils/storage';
import useNucleicJump from '@/utils/useNucleicJump';
import { getCurrentPageUrl, sleep } from '@/utils';
import { useDownCount } from 'parsec-hooks';
import dayjs from 'dayjs';

export default () => {
  const {
    nucleicName,
    regFee,
    endTime,
    startTime,
    resourceId,
    patientId,
    feeCode,
    deptCode,
    doctorCode,
    scheduleDate,
    timeFlag,
  } = useGetParams<{
    nucleicName: string;
    endTime: string;
    startTime: string;
    resourceId: string;
    regFee: string;
    patientId: string;
    feeCode: string;
    deptCode: string;
    doctorCode: string;
    scheduleDate: string;
    timeFlag: string;
  }>();
  const [show, setShow] = useState(false);
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const countRef = useRef(0);
  const {
    data: { data: patientInfo },
  } = useApi.查询就诊人详情({
    params: {
      patientId,
      idFullTransFlag: '1',
    },
  });

  const { request, loading } = useCommonApi.透传字段({
    needInit: false,
  });

  const { jumpNucleic, nucleicJumpParams } = useNucleicJump({ patientId });

  const clearTimer = useCallback(() => {
    setShow(false);
    countRef.current = 0;
    clearCountdownTimer();
  }, [clearCountdownTimer]);
  const getPatientQuestionnaire = useCallback(async () => {
    await sleep(3000);
    if (countRef.current > 0) {
      const resultData = await useRegisterApi.查询是否填写问卷.request({
        patientId: patientInfo?.patientId,
      });
      if (resultData?.data?.length !== 0) {
        clearTimer();
        handleNext();
      } else {
        getPatientQuestionnaire();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, patientInfo?.patientId]);
  const handleNucleConfirm = useCallback(() => {
    request({
      transformCode: 'KQ00022',
      patCardNo: patientInfo?.patCardNo,
      patHisNo: patientInfo?.patHisNo,
      patType: patientInfo?.patientType,
      patName: patientInfo?.patientName,
      patSex: patientInfo?.patientSex,
      patAge: patientInfo?.patientAge,
      patMobile: patientInfo?.patientMobile,
      patIdNo: patientInfo?.patientFullIdNo,
      patCardType: patientInfo?.patCardType,
      resourceId,
      payTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      beginTime: startTime,
      endTime,
      feeCode,
      deptCode,
      doctorCode,
      scheduleDate,
      timeFlag,
      regFee,
    }).then((res) => {
      if (res?.data?.data?.resultCode === '0') {
        showModal({
          content: '核酸开单成功，是否前往缴费',
        }).then(({ confirm }) => {
          if (confirm) {
            navigateTo({
              url: `/pages2/payment/order-list/index?patientId=${patientInfo?.patientId}&patCardNo=${patientInfo?.patCardNo}&patHisNo=${patientInfo?.patHisNo}`,
            });
          }
        });
      } else {
        usePaymentApi.查询门诊待缴费列表
          .request({
            patientId: patientInfo?.patientId,
          })
          .then((res) => {
            if (res.data.length > 0) {
              showModal({
                content: '您已有核酸开单记录, 请前往付费',
              }).then(({ confirm }) => {
                if (confirm) {
                  navigateTo({
                    url: `/pages2/payment/order-list/index?patientId=${patientInfo?.patientId}&patCardNo=${patientInfo?.patCardNo}&patHisNo=${patientInfo?.patHisNo}`,
                  });
                }
              });
            } else {
              showToast({
                title: '核酸自助开单失败，请稍后重试',
              });
            }
          });
      }
    });
  }, [
    endTime,
    patientInfo?.patCardNo,
    patientInfo?.patHisNo,
    patientInfo?.patientId,
    request,
    resourceId,
    startTime,
  ]);
  const handleNext = useCallback(async () => {
    // 没有注册不允许核酸开单
    if (!storage.get('openid')) {
      showToast({
        icon: 'fail',
        title: '抱歉，请进行注册再进行核酸开单!',
      }).then(() => {
        storage.set('jumpUrl', getCurrentPageUrl());
        navigateTo({
          url: '/pages/auth/login/index',
        });
      });
      return;
    }
    // 核酸问卷调查判断
    if (NUCLEIC_INVESTIGATION) {
      if (PLATFORM === 'ali') {
        // if (!storage.get(`${patientInfo?.patientId}`)) {
        //   storage.set(`${patientInfo?.patientId}`, 'true');
        //   navigateToMiniProgram({
        //     appId: NUCLEIC_APPID,
        //     path: `/pages/index/index?${nucleicJumpParams}`,
        //     fail: () =>
        //       showToast({
        //         title: '跳转小程序失败，请重试!',
        //       }),
        //   });
        //   return;
        // }
        const resultData = await useRegisterApi.查询是否填写流调问卷.request({
          userId: patientInfo?.patientId,
          formId: '4',
        });
        if (
          !resultData?.data ||
          dayjs(resultData.data.createTime).format('YYYY-MM-DD') !==
            dayjs().format('YYYY-MM-DD')
        ) {
          jumpNucleic();
          return;
        }
      } else {
        const resultData = await useRegisterApi.查询是否填写问卷.request({
          patientId: patientInfo?.patientId,
        });
        if (resultData?.data?.length === 0) {
          if (PLATFORM === 'web') {
            setShow(true);
            getPatientQuestionnaire();
            setCountdown(180).then(() => {
              clearTimer();
            });
          } else if (PLATFORM === 'wechat') {
            showModal({
              title: '提示',
              content:
                '遵照有关部门疫情防控要求，需要您填写一份流行病调查登记，感谢您的配合！',
            }).then(({ confirm }) => {
              if (confirm) {
                jumpNucleic();
              }
            });
          }
          return;
        }
      }
    }
    handleNucleConfirm();
  }, [
    clearTimer,
    getPatientQuestionnaire,
    handleNucleConfirm,
    jumpNucleic,
    patientInfo?.patientId,
    setCountdown,
  ]);

  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '确认核酸缴费信息',
    });
  });
  usePageEvent('onHide', () => {
    clearTimer();
  });
  useEffect(() => {
    countRef.current = countdown;
  }, [countdown]);
  return (
    <View className={styles.page}>
      <Space className={styles.top} alignItems="flex-start">
        <Space alignItems="center">
          <Image src={`${IMAGE_DOMIN}/auth/logo.png`} className={styles.logo} />
          <View>核酸检测</View>
        </Space>
      </Space>
      <Space className={styles.content} vertical>
        <Space className={styles.comboUser} vertical size={26} justify="center">
          <Space alignItems="center">
            <FormItem
              label="就诊人"
              labelWidth={'4em'}
              className={styles.label}
            />
            {patientInfo?.patientName}
          </Space>
          <Space alignItems="center">
            <FormItem
              label="执行科室"
              labelWidth={'4em'}
              className={styles.label}
            />
            新冠核酸检测
          </Space>
          <Space alignItems="center">
            <FormItem
              label="就诊院区"
              labelWidth={'4em'}
              className={styles.label}
            />
            {HOSPITAL_NAME}
          </Space>
        </Space>
        <PartTitle bold className={styles.partTitle}>
          费用明细
        </PartTitle>

        <Space className={styles.card} vertical size={30} justify="center">
          <View className={styles.nucleicName}>{nucleicName}</View>
          <Space alignItems="center" className={styles.regFee}>
            <View>单价：</View>
            {regFee}元
          </Space>
          <View className={styles.solid} />

          <Space
            alignItems="center"
            className={styles.itemText}
            justify="flex-end"
          >
            <View>合计：</View>
            <ColorText fontWeight={600}>{regFee}元</ColorText>
          </Space>
        </Space>
      </Space>

      <Space className={styles.footer}>
        <Space alignItems="center" flex="auto" className={styles.footerWrap}>
          已选择<ColorText>1</ColorText>个项目
        </Space>
        <Button
          className={styles.button}
          type="primary"
          loading={loading}
          onTap={handleNext}
        >
          下一步
        </Button>
      </Space>
      <NucleicQrcode
        show={show}
        nucleicJumpParams={nucleicJumpParams}
        close={() => {
          clearTimer();
          setShow(false);
        }}
      />
    </View>
  );
};
