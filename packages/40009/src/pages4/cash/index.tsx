import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { date2hour } from '@/utils';
import { useDownCount } from 'parsec-hooks';
import { Price } from '@/components';
import {
  Button,
  Loading,
  Shadow,
  Space,
  Tip,
  showToast,
  useTitle,
} from '@kqinfo/ui';
import { ListItem } from '@/components';
import classNames from 'classnames';
import { useLockFn } from 'ahooks';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/mdt';

export default () => {
  useTitle('收银台');
  const { id } = useGetParams<{
    id: string;
  }>();
  const {
    data: detail,
    loading: prePayLoading,
    request: prePay,
  } = useApi.线下MDT预支付({
    initValue: { data: {} },
    params: { id, payMethod: 'MINI' },
    needInit: false,
  });
  const handlePay = useCallback(async () => {
    setPaydisabled(true);
    try {
      const { data } = await prePay({ id, payMethod: 'H5' });
      window.location.href = data?.payUrl;
    } catch (error) {
      showToast({
        title: '支付下单失败，请稍后重试',
        icon: 'fail',
      });
      setPaydisabled(false);
    }
  }, [id, prePay]);
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const [payDisabled, setPaydisabled] = useState(false);
  const columns = [
    {
      key: '多学科联合门诊（MDT）',
      title: '业务类型',
    },
    {
      key: detail?.data?.districtName || '暂无',
      title: '就诊院区',
    },
    {
      key: detail?.data?.teamName || '暂无',
      title: '会诊团队',
    },
    {
      key: detail?.data?.mdtTime || '暂无',
      title: '会诊时间',
    },
  ];
  const columns2 = [
    {
      key: detail?.data?.patName,
      title: '就诊人',
    },
    {
      key: detail?.data?.patientId,
      title: '就诊卡号',
    },
  ];
  usePageEvent('onShow', async () => {
    const { data } = await prePay({ id, payMethod: 'MINI' });
    if (data?.leftPayTime > 0) {
      setCountdown(data.leftPayTime).then(() => {
        setPaydisabled(false);
      });
    } else {
      setCountdown(0);
      setPaydisabled(true);
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
      {prePayLoading && <Loading />}
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
                payFee={Number(detail?.data?.totalFee)}
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

        <Tip
          items={[
            <View key={'tip'} className={styles.tipText}>
              1.目前仅支持自费会诊
            </View>,
            <View key={'tip'} className={styles.tipText}>
              2.请在预约挂号成功后60分钟内完成支付，超出时间后系统将自动取消订单；
            </View>,
            <View key={'tip'} className={styles.tipText}>
              3.本次参与会诊人员，将根据会诊团队内部成员实际情况酌情安排。
            </View>,
          ]}
        />
      </View>
      <View className={styles.buttons}>
        <Button
          type="primary"
          onTap={useLockFn(handlePay)}
          loading={prePayLoading}
          disabled={payDisabled}
        >
          立即支付
        </Button>
      </View>
    </View>
  );
};
