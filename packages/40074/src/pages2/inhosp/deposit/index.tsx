import React, { useState, useCallback } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { analyzeIDCard } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Space,
  BackgroundImg,
  Button,
  Shadow,
  Divider,
  ReInput,
  showToast,
} from '@kqinfo/ui';
import payState from '@/stores/pay';
import { IMAGE_DOMIN, THEME_COLOR } from '@/config/constant';
import { inhospMoneys } from '@/config/index';
import classNames from 'classnames';
import useApi from '@/apis/inhosp';
import usePayApi from '@/apis/pay';
import { PLATFORM } from '@/config/constant';
import { returnUrl } from '@/utils';
import BigNumber from 'bignumber.js';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import { PatGender } from '@/config/dict';

export default () => {
  const { patientId } = useGetParams<{ patientId: string }>();
  const {
    data: { data: inhospPatientInfo },
  } = useApi.查询住院信息({
    params: {
      patientId,
    },
    needInit: !!patientId,
  });
  const { setOrderInfo } = payState.useContainer();
  const [payCash, setPayCash] = useState(0);
  const [payFlag, setPayFlag] = useState(false);
  const [activeIndex, setActiveIndex] = useState(10);
  const [inputVal, setInputVal] = useState('');
  const handlePay = useCallback(async () => {
    if (inhospPatientInfo?.patientName) {
      setPayFlag(true);
      const { admissionNum, hisName, patCardNo, patientName, deptName, idNo } =
        inhospPatientInfo;
      const { code, data, msg } = await useApi.生成住院订单.request({
        patientId,
        admissionNum,
        price: Number(new BigNumber(payCash).times(100)),
        hisName,
        extFields: JSON.stringify({
          patientName,
          patCardNo,
          idNo,
        }),
      });

      if (code === 0 && data?.payOrderId) {
        if (PLATFORM === 'web') {
          // H5逻辑
          const result = await usePayApi.h5支付下单.request({
            orderId: data.payOrderId,
            callbackUrl: `${returnUrl()}#/pages/waiting/index?bizType=ZYYJBJ&orderId=${
              data.orderId
            }`,
          });
          if (result.code === 0 && result.data) {
            window.location.href = result.data;
          }
        } else {
          // 小程序收银台
          setOrderInfo({
            bizType: 'ZYYJBJ',
            hisName: hisName,
            deptName,
            doctorName: '',
            patientName: `${patientName} | ${
              PatGender[analyzeIDCard(idNo)?.analyzeSex as string] || ''
            } | ${analyzeIDCard(idNo)?.analyzeAge || '未知'}岁`,
            patCardNo: patCardNo,
            totalFee: Number(new BigNumber(payCash).times(100)),
            orderId: data.orderId,
            payOrderId: data.payOrderId,
          });
          navigateTo({
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
    }
  }, [inhospPatientInfo, patientId, payCash, setOrderInfo]);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '押金预缴',
    });
  });

  return (
    <View>
      <View className={styles.banner}>
        <Space className={styles.userInfo} alignItems={'center'}>
          <Image
            src={`${IMAGE_DOMIN}/inhosp/avatar.png`}
            mode="aspectFit"
            className={styles.avatar}
          />
          <Space vertical className={styles.userDesc}>
            <Space className={styles.userName}>
              {inhospPatientInfo?.patientName}
            </Space>
            <Space>{inhospPatientInfo?.patientId}</Space>
          </Space>
        </Space>
        <BackgroundImg
          img={`${IMAGE_DOMIN}/inhosp/kp.png`}
          className={styles.card}
        >
          <View className={styles.cardInner}>
            <View className={styles.hospital}>
              {inhospPatientInfo?.hisName}
            </View>
            <View className={styles.dep}>{inhospPatientInfo?.deptName}</View>
            <View className={styles.cash}>￥{payCash}.00</View>
            <View className={styles.desc}>押金金额</View>
          </View>
        </BackgroundImg>
        <Image
          src={`${IMAGE_DOMIN}/inhosp/zdw.png`}
          mode="aspectFit"
          className={styles.bannerft}
        />
      </View>
      <View className={styles.contentWrap}>
        <Divider color={THEME_COLOR}>选择预缴金额</Divider>
        <Space
          className={styles.numbers}
          justify="space-between"
          flexWrap="wrap"
        >
          {inhospMoneys.map((money, index) => (
            <Shadow key={money.value}>
              <Space
                justify="center"
                alignItems="center"
                className={classNames(styles.btn, {
                  [styles.active]: activeIndex === index,
                })}
                onTap={() => {
                  if (inputVal) {
                    setInputVal('');
                  }
                  setPayCash(money.value);
                  setActiveIndex(index);
                }}
              >
                {money.key}
              </Space>
            </Shadow>
          ))}
        </Space>
        <ReInput
          placeholder={'请输入5000以内整数金额'}
          className={styles.cashInput}
          type="number"
          value={inputVal}
          placeholderStyle={{
            color: '#ccc',
            fontWeight: 400,
          }}
          onChange={(v: any) => {
            const r = /^\+?[1-9][0-9]*$/;
            if (!v) {
              setPayCash(0);
              setInputVal('');
              return;
            }
            if (+v > 5000 || +v < 0 || !r.test(v)) {
              // if (+v > 5000 || +v < 0) {
              showToast({ icon: 'none', title: '输入5000以内整数金额' });
              return;
            }
            setPayCash(v);
            setActiveIndex(10);
            setInputVal(v);
          }}
        />
        <Button
          className={styles.subBtn}
          type={'primary'}
          onTap={handlePay}
          loading={payFlag}
          disabled={payFlag || !payCash}
        >
          我要缴费
        </Button>
      </View>
    </View>
  );
};
