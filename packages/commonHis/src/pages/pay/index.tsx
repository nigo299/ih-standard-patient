import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  navigateBack,
  navigateTo,
  // navigateTo,
  reLaunch,
  redirectTo,
} from 'remax/one';
import { usePageEvent } from 'remax/macro';
import {
  date2hour,
  decrypt,
  getBrowserUa,
  isYuKangJianH5,
  reLaunchUrl,
} from '@/utils';
import { useDownCount } from 'parsec-hooks';
import { Price } from '@/components';
import useApi, { ChoosepayType } from '@/apis/pay';
import useRegisterApi from '@/apis/register';
import setNavigationBar from '@/utils/setNavigationBar';
import useLoginApi from '@/apis/login';
import usePatientApi from '@/apis/usercenter';
import { Button, Shadow, Space, showModal, showToast } from '@kqinfo/ui';
import payState, { OrderInfoType } from '@/stores/pay';
// import globalState from '@/stores/global';
import { PAY_TYPE, HOSPITAL_NAME, PLATFORM, APPID } from '@/config/constant';
import { ListItem } from '@/components';
import classNames from 'classnames';
import monitor from '@/alipaylog/monitor';
import navigateToAlipayPage from '@/utils/navigateToAlipayPage';
import storage from '@/utils/storage';
import { useLockFn } from 'ahooks';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import { useHisConfig } from '@/hooks';

export default () => {
  const { mode = '', hidden = '0' } = useGetParams<{
    mode: string;
    hidden: string;
  }>();
  const { config } = useHisConfig();
  const {
    orderInfo: {
      deptName,
      doctorName,
      doctorTitle,
      patCardNo,
      hisName,
      registerTime,
      patientName,
      bizType,
      totalFee,
      orderId,
      payOrderId,
      patientFullIdNo,
      extFields,
      h5PayUrl = '',
    },
    setOrderInfo,
  } = payState.useContainer();
  // const { elderly } = globalState.useContainer();
  const { loading: payLoading, request: payRequest } = useApi.缴费支付下单({
    needInit: false,
  });
  const { data: hospitialConfigData } = usePatientApi.获取医院挷卡配置信息({
    needInit: true,
  });
  const { loading: aliPayLoading, request: aliPayRequest } =
    useApi.支付宝医保免密授权({
      needInit: false,
    });
  const { loading: wechatPayLoading, request: wechatPayRequest } =
    useApi.微信医保渠道免密授权URL获取({
      needInit: false,
    });
  const { data: userInfoData } = useLoginApi.获取用户信息({
    needInit: PLATFORM === 'ali',
  });
  const [regOrderInfo, setRegOrderInfo] = useState<any>(null);
  const [payDisabled, setPaydisabled] = useState(false);
  const [payDisabled2, setPaydisabled2] = useState(false);
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const columns = [
    {
      key: PAY_TYPE[bizType].title,
      title: '业务类型',
    },
    {
      key: HOSPITAL_NAME || hisName,
      title: '就诊医院',
    },
    {
      key: deptName,
      title: '就诊科室',
    },
    {
      key: doctorName,
      title: '就诊医生',
    },
    {
      key: doctorTitle,
      title: '医生职称',
    },
    {
      key: registerTime,
      title: '就诊时间',
    },
  ];
  const columns2 = [
    {
      key: patientName,
      title: '就诊人',
    },
    {
      key: patCardNo,
      title: '就诊卡号',
    },
  ];

  const chooseWechatAppPay = useCallback(
    async (data: ChoosepayType) => {
      const { requestPayment } = require('remax/wechat');
      const { timeStamp, nonceStr, signType, paySign, packages } = data;
      // 唤起微信支付
      let requestPaymentRes;
      try {
        requestPaymentRes = await requestPayment({
          timeStamp,
          nonceStr,
          package: packages,
          signType,
          paySign,
        });
      } catch (error) {
        requestPaymentRes = error;
      }
      if (requestPaymentRes.errMsg === 'requestPayment:fail cancel') {
        // 取消支付
        showToast({
          title: '取消支付!',
          icon: 'fail',
        });
        setPaydisabled2(false);
        setPaydisabled(false);
      } else if (requestPaymentRes.errMsg === 'requestPayment:ok') {
        // 支付成功
        showToast({
          title: '支付成功!',
          icon: 'success',
        }).then(() => {
          reLaunch({
            url: `/pages/waiting/index?bizType=${bizType}&orderId=${orderId}`,
          });
        });
      } else {
        // 支付失败
        showToast({
          title: '支付失败，请稍后重试!',
          icon: 'fail',
        }).then(() => navigateBack());
      }
    },
    [bizType, orderId],
  );
  const chooseAliAppPay = useCallback(
    async (tradeNO: string) => {
      const { tradePay } = require('remax/ali');
      const result = await tradePay({
        tradeNO,
      });
      if (result.resultCode === '9000') {
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
          redirectTo({
            url: `/pages/waiting/index?bizType=${bizType}&orderId=${orderId}`,
          });
          return;
        });
      } else if (result.resultCode === '6001') {
        // 取消支付
        showToast({
          title: '取消支付!',
          icon: 'fail',
        });
        setPaydisabled2(false);
        setPaydisabled(false);
      } else {
        // 支付失败
        showToast({
          title: '支付失败，请稍后重试!',
          icon: 'fail',
        }).then(() => navigateBack());
      }
    },
    [bizType, deptName, orderId],
  );
  const handlePay = useCallback(async () => {
    setPaydisabled2(true);
    setPaydisabled(true);
    if (
      config.isOldManRegFree &&
      regOrderInfo?.totalRealFee == 0 &&
      regOrderInfo?.preferentialFlag === 1 &&
      !isYuKangJianH5()
    ) {
      // do something
      const data = await useRegisterApi.零元单通知his.request({
        payOrderId: regOrderInfo?.payOrderId,
      });
      if (data?.code === 0) {
        showToast({
          title: '支付成功!',
          icon: 'success',
        }).then(() => {
          navigateTo({
            url: `/pages2/register/order-detail/index?orderId=${orderId}`,
          });
        });
      }
      console.log('data', data);
      return;
    }
    console.log('pay页面', payOrderId);
    if (PLATFORM === 'web' && !isYuKangJianH5()) {
      window.location.href = h5PayUrl;
      return;
    }
    if (getBrowserUa() === 'wechat' && isYuKangJianH5()) {
      showToast({
        title: '支付开发中，请使用公众号进行支付',
        icon: 'fail',
      });
      return;
    }
    const { data, code, msg } = await payRequest({
      orderId: payOrderId,
    });
    if (code === 0) {
      if (
        (PLATFORM === 'wehcat' || getBrowserUa() === 'wechat') &&
        data?.paySign
      ) {
        chooseWechatAppPay(data);
      }
      if (
        (PLATFORM === 'ali' || getBrowserUa() === 'alipay') &&
        data?.alipayTradeNo
      ) {
        chooseAliAppPay(data?.alipayTradeNo);
      }
    } else {
      showToast({
        title: msg || '支付下单失败，请稍后重试',
        icon: 'fail',
      });
      setPaydisabled2(false);
      setPaydisabled(false);
    }
  }, [
    chooseAliAppPay,
    chooseWechatAppPay,
    config?.isOldManRegFree,
    h5PayUrl,
    orderId,
    payOrderId,
    payRequest,
    regOrderInfo?.payOrderId,
    regOrderInfo?.preferentialFlag,
    regOrderInfo?.totalRealFee,
  ]);
  const hanldeMedInsurePay = useCallback(async () => {
    setPaydisabled2(true);
    setPaydisabled(true);
    storage.set(
      'medinsurePayOrderInfo',
      JSON.stringify({
        deptName,
        doctorName,
        doctorTitle,
        patCardNo,
        hisName,
        registerTime,
        patientName,
        patientFullIdNo,
        bizType,
        totalFee,
        orderId,
        payOrderId,
        extFields,
        h5PayUrl,
      }),
    );
    try {
      if (PLATFORM === 'ali') {
        const aliPayReqBizNo = `${payOrderId}${new Date().getTime()}`;
        storage.set('aliPayReqBizNo', aliPayReqBizNo);
        const { code, data, msg } = await aliPayRequest({
          reqBizNo: aliPayReqBizNo,
          totalAmount: String(totalFee),
          callUrl: `alipays://platformapi/startapp?appId=${APPID}&page=pages/medical/order-item/index`,
          bizChannel: 'insuranceAliPay',
        });
        if (code === 0 && data?.authUrl) {
          navigateToAlipayPage({
            path: encodeURI(data.authUrl),
          });
        } else {
          showToast({
            icon: 'fail',
            title: msg || '医保授权链接返回失败',
          });
        }
      }
      if (getBrowserUa() === 'wechat') {
        const { code, msg, data } = await wechatPayRequest({
          callUrl: encodeURIComponent(
            `${window?.location?.origin}${window?.location?.pathname}#/pages/medical/order-item/index`,
          ),
          bizChannel: 'insuranceWxPay',
        });
        if (code === 0 && data?.authUrl) {
          window.location.href = data.authUrl;
        } else {
          showToast({
            icon: 'fail',
            title: msg || '医保授权链接返回失败',
          });
        }
      }
    } finally {
      setPaydisabled2(false);
      setPaydisabled(false);
    }
  }, [
    aliPayRequest,
    bizType,
    deptName,
    doctorName,
    doctorTitle,
    extFields,
    h5PayUrl,
    hisName,
    orderId,
    patCardNo,
    patientFullIdNo,
    patientName,
    payOrderId,
    registerTime,
    totalFee,
    wechatPayRequest,
  ]);
  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '收银台',
    });
    const medinsurePayOrderInfo = storage.get('medinsurePayOrderInfo');
    let params: any = {};
    try {
      params = JSON.parse(medinsurePayOrderInfo || '{}') as OrderInfoType;
    } catch (err) {
      params = {};
    }
    if (medinsurePayOrderInfo && !payOrderId) {
      setOrderInfo(params);
    }
    if (!medinsurePayOrderInfo && !payOrderId) {
      showToast({
        icon: 'fail',
        title: '支付数据丢失, 请重新下单!',
      }).then(() => {
        reLaunchUrl('/pages/home/index');
      });
      return;
    }
    if (mode === 'medical' && config.showMedicalModal) {
      showModal({
        title: '提示',
        content: '医保移动支付仅支持患者本人电子医保凭证使用!',
        showCancel: false,
        confirmText: '我知道了',
      });
    }
    if (bizType === 'YYGH' || bizType === 'DBGH') {
      const { data } = await useRegisterApi.查询挂号订单详情.request({
        orderId,
      });
      setRegOrderInfo(data);
      if (data?.leftPayTime > 0) {
        setCountdown(data.leftPayTime).then(() => {
          setPaydisabled(true);
        });
      } else {
        setCountdown(0);
        setPaydisabled(true);
      }
    }
  });
  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  return (
    <View
      className={classNames(styles.page, {
        // [styles.elderly]: elderly,
      })}
    >
      {countdown > 0 && (
        <View className={styles.tips}>
          请在 {date2hour(countdown * 1000)} 内完成支付
        </View>
      )}
      <View className={styles.content}>
        <View className={styles.cards}>
          <Shadow
            card
            // card={!elderly}
          >
            <Space
              vertical
              justify="center"
              alignItems="center"
              className={styles['pay-price']}
            >
              <View className={styles['pay-price-title']}>支付金额(元)</View>
              <Price
                payFee={Number(totalFee)}
                // elderly={elderly}
              />
            </Space>
          </Shadow>
        </View>
        <View className={styles.items}>
          {columns.map(
            (item, i) =>
              item.key && (
                <ListItem
                  key={i}
                  label={item.title}
                  text={item.key}
                  // elderly={elderly}
                />
              ),
          )}

          <View className={styles.dotted} />
          {columns2.map((item, i) => (
            <ListItem
              key={i}
              label={item.title}
              text={item.key}
              // elderly={elderly}
            />
          ))}
        </View>
      </View>
      <View className={styles.buttons}>
        {/* 先隐藏移动医保支付 */}
        {
          // mode === 'medical' &&
          // !isYuKangJianH5() &&
          // hospitialConfigData?.data?.medicalPay?.indexOf('WeChat') > -1 &&
          getBrowserUa() === 'wechat' && (
            <Button
              type="primary"
              className={styles.medInsureBtn}
              onTap={hanldeMedInsurePay}
              disabled={payDisabled2 || payLoading}
              loading={wechatPayLoading}
            >
              医保移动支付
            </Button>
          )
        }

        {mode === 'medical' &&
          !isYuKangJianH5() &&
          hospitialConfigData?.data?.medicalPay?.indexOf('Alipay') > -1 &&
          PLATFORM === 'ali' && (
            <Button
              type="primary"
              className={classNames(styles.medInsureBtn, {
                [styles.disabled]:
                  decrypt(userInfoData?.data?.aliPayCertNo || '') !==
                  patientFullIdNo,
              })}
              onTap={() => {
                if (
                  decrypt(userInfoData?.data?.aliPayCertNo || '') !==
                  patientFullIdNo
                ) {
                  showToast({
                    duration: 1000,
                    icon: 'none',
                    title: '非本人暂不支持医保在线支付',
                  });
                } else {
                  hanldeMedInsurePay();
                }
              }}
              disabled={payDisabled2 || payLoading}
              loading={aliPayLoading}
            >
              医保移动支付
            </Button>
          )}

        {hidden !== '1' && (
          <Button
            type="primary"
            ghost
            onTap={useLockFn(handlePay)}
            disabled={payDisabled}
            loading={payLoading}
          >
            {mode === 'medical' && !isYuKangJianH5() ? '自费支付' : '立即支付'}
          </Button>
        )}
      </View>
    </View>
  );
};
