import React, { useState, useCallback } from 'react';
import { Space, Button, showToast } from '@kqinfo/ui';
import { MedicallItem } from '@/components';
import { APPID, HOSPITAL_NAME, IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import { Image, navigateBack, navigateTo, reLaunch, View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import useGetParams from '@/utils/useGetParams';
import setNavigationBar from '@/utils/setNavigationBar';
import storage from '@/utils/storage';
import useApi from '@/apis/pay';
import useRegisterApi, { MedicalPayType } from '@/apis/register';
import styles from './index.less';
import { getBrowserUa, reLaunchUrl, sleep } from '@/utils';
import { OrderInfoType } from '@/stores/pay';
import monitor from '@/alipaylog/monitor';
import { useLockFn } from 'ahooks';
import classNames from 'classnames';
import showModal from '@/utils/showModal';

import Loading from '@/components/Loading';
export default () => {
  const [sLoading, setSloading] = useState(false);
  const { authCode } = useGetParams<{ authCode: string }>();
  const [medicalData, setMedicalData] = useState<MedicalPayType>({
    ordStas: '',
    hisName: '',
    payOrdId: '',
    psnAcctPay: 0,
    othFeeAmt: 0,
    ownPayAmt: 0,
    feeSumamt: 0,
    fundPay: 0,
    deposit: 0,
    medicalReq: {},
    extData: {
      preSetl: {
        certno: '',
      },
    },
  });
  const [show, setShow] = useState(false);
  const initMedInsureData = useCallback(
    async (orderInfoData: OrderInfoType) => {
      const {
        payOrderId,
        totalFee,
        bizType,
        extFields,
        orderId,
        patientFullIdNo,
        patCardNo,
      } = orderInfoData;
      let payAuthNo = '';
      try {
        if (PLATFORM === 'ali') {
          setSloading(true);
          const { code, data } = await useApi.支付宝医保免密授权.request({
            reqBizNo: storage.get('aliPayReqBizNo') || '',
            totalAmount: String(totalFee),
            callUrl: `alipays://platformapi/startapp?appId=${APPID}&page=pages/medical/order-item/index`,
            bizChannel: 'insuranceAliPay',
          });
          setSloading(false);
          if (code === 0 && data?.payAuthNo) {
            payAuthNo = data.payAuthNo;
          } else {
            reLaunchUrl('/pages/pay/index');
            return;
          }
        }
        if (getBrowserUa() === 'wechat') {
          if (!authCode) {
            reLaunchUrl('/pages/pay/index');
            return;
          }
          setSloading(true);
          const { code, data } = await useApi.微信医保免密授权.request({
            qrcode: authCode,
            bizChannel: 'insuranceWxPay',
          });
          setSloading(false);
          if (code === 0 && data?.payAuthNo) {
            if (patientFullIdNo !== data.userCardNo) {
              showModal({
                title: '提示',
                content: `非本人暂不支持医保在线支付, 请重新选择就诊人`,
                showCancel: false,
              }).then(({ confirm }) => {
                if (confirm) {
                  const url =
                    bizType === 'MZJF'
                      ? `/pages2/payment/order-list/index?patCardNo=${patCardNo}`
                      : `/pages2/register/order-detail/index?orderId=${orderId}`;
                  storage.del('medinsurePayOrderInfo');
                  if (PLATFORM === 'web') {
                    window.history.pushState(
                      null,
                      'index',
                      '#/pages/home/index',
                    );
                    navigateTo({
                      url,
                    });
                  } else {
                    reLaunch({
                      url,
                    });
                  }
                }
              });
              return;
            }
            payAuthNo = data.payAuthNo;
          }
        }
        setSloading(true);
        const result = await useRegisterApi.医保下单.request({
          orderId,
          payOrderId,
          uniqueCode: bizType === 'DBGH' ? 13 : bizType === 'YYGH' ? 10 : 11,
          totalFee: 0,
          selfFee: 0,
          payAuthNo,
          ocToken: '',
          insuCode: '',
          // backUrl:
          //   PLATFORM === 'ali'
          //     ? `alipays://platformapi/startapp?appId=${APPID}&page=pages/medical/order-detail/index`
          //     : `${window.location.origin}${window?.location?.pathname}#/pages/medical/order-detail/index`,
          backUrl:
            PLATFORM === 'ali'
              ? `alipays://platformapi/startapp?appId=${APPID}&page=pages/waiting/index?bizType=${bizType}&orderId=${orderId}`
              : `${window.location.origin}${window?.location?.pathname}#/pages/waiting/index?bizType=${bizType}&orderId=${orderId}`,
          extFields:
            typeof extFields === 'string'
              ? extFields
              : JSON.stringify(extFields),
        });
        setSloading(false);
        if (result.code === 0 && typeof result.data === 'string') {
          setMedicalData(JSON.parse(result.data) as MedicalPayType);
        } else {
          showToast({
            icon: 'fail',
            title: result.msg || '医保下单失败',
          });
          Promise.reject();
        }
      } catch (e) {
        setTimeout(() => {
          reLaunchUrl('/pages/home/index');
        }, 3000);
      }
    },
    [authCode],
  );
  const hanldeMedInsurePay = useCallback(async () => {
    const medinsurePayOrderInfo = storage.get('medinsurePayOrderInfo');
    if (medinsurePayOrderInfo) {
      const { bizType, orderId, deptName, payOrderId } = JSON.parse(
        medinsurePayOrderInfo,
      ) as OrderInfoType;
      try {
        if (PLATFORM === 'ali') {
          setSloading(true);
          const { code, msg, data } = await useApi.医保移动支付.request({
            orderId,
            payOrderId,
            uniqueCode: bizType === 'DBGH' ? 13 : bizType === 'YYGH' ? 10 : 11,
          });
          setSloading(false);
          if (code === 0 && data) {
            const { tradePay } = require('remax/ali');
            const payResultData = await tradePay({
              orderStr: data,
            });
            if (payResultData.resultCode === '9000') {
              showToast({
                title: '支付成功!',
                icon: 'success',
              }).then(() => {
                if (deptName?.includes('核酸检测')) {
                  monitor.api({
                    api: '核酸检测预约',
                    success: true,
                    c1: 'taSR_YL',
                    time: 200,
                  });
                }
                storage.del('medinsurePayOrderInfo');
                reLaunch({
                  url: `/pages/waiting/index?bizType=${bizType}&orderId=${orderId}`,
                });
              });
            } else if (payResultData.resultCode === '6001') {
              // 取消支付
              showToast({
                title: '取消支付!',
                icon: 'fail',
              });
            } else {
              // 支付失败
              showToast({
                title: '支付失败，请稍后重试!',
                icon: 'fail',
              }).then(() => navigateBack());
            }
          } else {
            showToast({
              icon: 'fail',
              title: msg || '医保支付失败',
            });
          }
        }
        if (getBrowserUa() === 'wechat') {
          setSloading(true);
          const payResult = await useApi.医保移动支付.request({
            orderId,
            payOrderId,
            uniqueCode: bizType === 'DBGH' ? 13 : bizType === 'YYGH' ? 10 : 11,
          });
          setSloading(false);
          if (payResult.code === 0 && payResult.data) {
            storage.del('medinsurePayOrderInfo');
            window.location.href = payResult.data;
          } else {
            showToast({
              icon: 'fail',
              title: payResult?.msg || '医保支付失败',
            });
          }
        }
      } catch (e) {
        setTimeout(() => {
          reLaunchUrl('/pages/home/index');
        }, 3000);
      }
    }
  }, []);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '确认支付',
      fontColor: '#FFFFFF',
      backgroundColor: '#3B71E8',
    });
    const medinsurePayOrderInfo = storage.get('medinsurePayOrderInfo');
    if (medinsurePayOrderInfo) {
      if (!medicalData?.hisName) {
        initMedInsureData(JSON.parse(medinsurePayOrderInfo) as OrderInfoType);
      }
    } else {
      showToast({
        icon: 'fail',
        title: '支付数据丢失, 请重新下单!',
      }).then(() => {
        reLaunchUrl('/pages/home/index');
      });
    }
  });
  return (
    <Space alignItems="center" vertical className={styles.page}>
      {medicalData?.hisName && (
        <MedicallItem
          show={show}
          close={() => setShow(false)}
          medicalData={medicalData}
        />
      )}
      <View className={styles.top}>
        <Space
          alignItems="flex-end"
          justify="space-between"
          className={styles.logoWrap}
        >
          <View>
            <View className={styles.text}>付款给</View>
            <View className={styles.hospitalName}>
              {medicalData?.hisName || HOSPITAL_NAME}
            </View>
          </View>
          <Image
            src={`${IMAGE_DOMIN}/medical/logo.png`}
            className={styles.logo}
          />
        </Space>
      </View>
      <View className={styles.card}>
        <Space
          alignItems="center"
          justify="space-between"
          className={styles.cardTitle}
        >
          <View>费用总额</View>
          <View>{medicalData?.feeSumamt}元</View>
        </Space>
        <View className={styles.dotted} />
        <Space
          alignItems="center"
          justify="space-between"
          className={styles.cardText}
        >
          <View>医保基金支付</View>
          <View>{medicalData?.fundPay}元</View>
        </Space>
        <Space
          alignItems="center"
          justify="space-between"
          className={styles.cardText2}
        >
          <View>个人帐户支付</View>
          <View>{medicalData?.psnAcctPay}元</View>
        </Space>
        {Number(medicalData?.othFeeAmt) > 0 && (
          <Space
            alignItems="center"
            justify="space-between"
            className={styles.cardText2}
          >
            <View>其他抵扣金额</View>
            <View>{medicalData?.othFeeAmt}元</View>
          </Space>
        )}
        <Space
          alignItems="center"
          justify="space-between"
          className={styles.cardText3}
        >
          <View>现金支付</View>
          <View>{medicalData?.ownPayAmt}元</View>
        </Space>
        <View className={styles.dotted} />
        <Space
          justify="center"
          className={styles.cardText4}
          onTap={useLockFn(async () => {
            await sleep(100);
            setShow(true);
          })}
        >
          查看明细
        </Space>
      </View>

      <Space alignItems="center" justify="center" className={styles.footerlogo}>
        <Image
          src={`${IMAGE_DOMIN}/medical/logo2.png`}
          className={styles.logo2}
        />
        <View className={styles.logoText}>医保移动支付</View>
      </Space>
      <Space
        alignItems="center"
        justify="space-between"
        className={styles.footer}
      >
        <Space alignItems="center">
          <View>您还需支付：</View>
          <View className={styles.total}>¥{medicalData?.ownPayAmt}</View>
        </Space>
        <Button
          className={classNames(styles.btn, {
            [styles.disabled]: !medicalData?.feeSumamt,
          })}
          onTap={useLockFn(hanldeMedInsurePay)}
          // disabled={!medicalData?.feeSumamt}
        >
          去支付
        </Button>
      </Space>
      {sLoading && <Loading />}
    </Space>
  );
};
