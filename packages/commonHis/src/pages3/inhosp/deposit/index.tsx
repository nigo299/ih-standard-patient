import React, { useCallback, useState } from 'react';
import { View, Text, navigateTo } from '@remax/one';
import InhospHeader from '@/components/inhospHeader';
import { Button, Form, FormItem, ReInput, showToast, Space } from '@kqinfo/ui';
import { inhospMoneys } from '@/config/index';
import classNames from 'classnames';
import styles from './index.less';
import { usePageEvent } from '@remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import inhospState from '@/stores/inhosp';
import usePayApi from '@/apis/pay';
import useApi from '@/apis/inhosp';
import { PLATFORM } from '@/config/constant';
import { returnUrl } from '@/utils';
import BigNumber from 'bignumber.js';
import payState from '@/stores/pay';
import { analyzeIDCard } from '@/utils';
import { PatGender } from '@/config/dict';

export default () => {
  const {
    inhospPatientInfo: {
      hisName,
      admissionNum,
      deptName,
      patCardNo,
      patientName,
      patientId,
      idNo,
    },
  } = inhospState.useContainer();
  const { setOrderInfo } = payState.useContainer();
  const [activeIndex, setActiveIndex] = useState(10);
  const [payCash, setPayCash] = useState(0);
  const [payFlag, setPayFlag] = useState(false);
  const [inputVal, setInputVal] = useState('');
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '押金预缴',
    });
  });
  const handlePay = useCallback(async () => {
    setPayFlag(true);
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
          deptName: deptName,
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
        title: msg || '下单失败，请重试!',
      });
    }

    setPayFlag(false);
  }, [
    admissionNum,
    deptName,
    hisName,
    idNo,
    patCardNo,
    patientId,
    patientName,
    payCash,
    setOrderInfo,
  ]);
  return (
    <View className={styles.box}>
      <InhospHeader
        content={`就诊号：${patCardNo}`}
        title={`${patientName}｜${analyzeIDCard(idNo)?.analyzeAge}岁`}
      />
      <View className={styles.main}>
        <View className={styles.content}>
          <Form elderly>
            <FormItem className={styles.formItem} label={'医院名称'}>
              {hisName}
            </FormItem>
            <FormItem className={styles.formItem} label={'住院科室'}>
              {deptName}
            </FormItem>
            <FormItem label={'押金余额'}>
              <Text className={styles.mainPrice}>¥{payCash}</Text>
            </FormItem>
          </Form>
        </View>
        <View className={styles.content} style={{ marginTop: 20 }}>
          <View className={styles.priceTitle}>选择预缴金额：</View>
          <Space justify="space-between" flexWrap="wrap">
            {inhospMoneys.map((money, index) => (
              <Space
                key={money.key}
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
            ))}
            <View>
              <ReInput
                placeholder={'输入5000以内整数金额'}
                className={styles.cashInput}
                placeholderClassName={styles.cashPlaceholder}
                type="number"
                value={inputVal}
                onChange={(v: any) => {
                  const r = /^\+?[1-9][0-9]*$/;
                  if (!v) {
                    setPayCash(0);
                    return;
                  }
                  if (+v > 5000 || +v < 0 || !r.test(v)) {
                    showToast({
                      icon: 'none',
                      title: '请输入5000以内整数金额',
                    });
                    return;
                  }
                  setPayCash(v);
                  setActiveIndex(10);
                  setInputVal(v);
                }}
              />
            </View>
          </Space>
        </View>
        <Button
          className={styles.subBtn}
          type={'primary'}
          onTap={handlePay}
          loading={payFlag}
          elderly
          disabled={payFlag || !payCash}
        >
          我要缴费
        </Button>
      </View>
    </View>
  );
};
