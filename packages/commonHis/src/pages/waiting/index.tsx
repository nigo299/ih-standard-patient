import React, { memo, useEffect, useCallback, useRef } from 'react';
import { Image, View, Text, reLaunch, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { reLaunchUrl, sleep } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Button, showToast } from '@kqinfo/ui';
import { IMAGE_DOMIN, PAY_TYPE, PLATFORM } from '@/config/constant';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/pay';
import { useDownCount } from 'parsec-hooks';
import { PayMode } from '@/stores/pay';
import globalState from '@/stores/global';
import styles from './index.less';
import classNames from 'classnames';
import monitor from '@/alipaylog/monitor';
import storage from '@/utils/storage';

export default memo(() => {
  const { elderly } = globalState.useContainer();
  const {
    orderId = storage.get('orderId'),
    bizType = storage.get('bizType') as PayMode,
  } = useGetParams<{
    orderId: string;
    bizType: PayMode;
  }>();
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const countRef = useRef(1);
  const clearTimer = useCallback(() => {
    countRef.current = 0;
    clearCountdownTimer();
  }, [clearCountdownTimer]);
  const goDetail = useCallback(() => {
    const url = PAY_TYPE[bizType].detail;
    // const detailUrl = elderly
    //   ? `${url}?orderId=${orderId}`.replace('pages2', 'pages3')
    //   : `${url}?orderId=${orderId}`;
    const detailUrl = `${url}?orderId=${orderId}`;
    if (PLATFORM === 'web') {
      window.history.pushState(null, 'index', '#/pages/home/index');
      navigateTo({
        url: detailUrl,
      });
    } else if (
      PLATFORM === 'ali' &&
      (bizType === 'YYGH' || bizType === 'DBGH')
    ) {
      reLaunch({
        url: `${detailUrl}&mysl=1`,
      });
    } else {
      reLaunch({
        url: detailUrl,
      });
    }
    clearTimer();
  }, [bizType, clearTimer, orderId]);
  const getOrderStatus = useCallback(async () => {
    if (countRef.current > 0) {
      await sleep(2500);
      if (bizType && orderId) {
        const { data, code, msg } = await useApi.查询订单支付状态.request({
          orderId,
          bizType: PAY_TYPE[bizType].type,
        });
        if (code === 0) {
          if (data.status === 'S') {
            if (bizType === 'DBGH' || bizType === 'YYGH') {
              monitor.api({
                api: '挂号缴费',
                success: true,
                c1: 'taSR_YL',
                time: 200,
              });
            }
            if (bizType === 'MZJF') {
              monitor.api({
                api: '门诊缴费',
                success: true,
                c1: 'taSR_YL',
                time: 200,
              });
            }
            if (bizType === 'ZYYJBJ') {
              monitor.api({
                api: '住院缴费',
                success: true,
                c1: 'taSR_YL',
                time: 200,
              });
            }
          } else {
            if (bizType === 'DBGH' || bizType === 'YYGH') {
              monitor.api({
                api: '挂号缴费',
                success: false,
                c1: 'taSR_YL',
                time: 200,
              });
            }
            if (bizType === 'MZJF') {
              monitor.api({
                api: '门诊缴费',
                success: false,
                c1: 'taSR_YL',
                time: 200,
              });
            }
            if (bizType === 'ZYYJBJ') {
              monitor.api({
                api: '住院缴费',
                success: false,
                c1: 'taSR_YL',
                time: 200,
              });
            }
          }
          if (
            data?.status === 'S' ||
            data?.status === 'F' ||
            data?.status === 'C' ||
            data?.status === 'H'
          ) {
            goDetail();
          } else if (data?.status || 'L') {
            getOrderStatus();
          }
        } else {
          showToast({
            icon: 'fail',
            title: msg || '未查询到订单记录',
          }).then(() => {
            reLaunchUrl('/pages/home/index');
            clearTimer();
          });
        }
      }
    }
  }, [bizType, clearTimer, goDetail, orderId]);
  usePageEvent('onLoad', () => {
    getOrderStatus();
    setCountdown(60).then(() => {
      goDetail();
    });
    setNavigationBar({
      title: '收银台',
    });
  });
  usePageEvent('onHide', () => {
    clearTimer();
  });
  useEffect(() => {
    countRef.current = countdown;
  }, [countdown]);

  return (
    <Space
      vertical
      alignItems="center"
      className={classNames(styles.page, {
        [styles.elderly]: elderly,
      })}
    >
      <View className={styles.timeText}>
        {countdown}
        <Text className={styles.timeText2}>s</Text>
      </View>
      <Image
        src={`${IMAGE_DOMIN}/waiting/time.png`}
        className={styles.img}
        mode="aspectFit"
      />
      <Text className={styles.text}>正在获取支付结果，请稍后...</Text>
      {countdown < 50 && (
        <Button
          type="primary"
          className={styles.button}
          onTap={() => {
            clearTimer();
            goDetail();
          }}
        >
          返回
        </Button>
      )}
    </Space>
  );
});
