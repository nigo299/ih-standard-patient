import React, { useCallback, useEffect } from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { date2hour } from '@/utils';
import { useDownCount } from 'parsec-hooks';
import { Price } from '@/components';
import setNavigationBar from '@/utils/setNavigationBar';
import { Button, Loading, Shadow, Space, Tip } from '@kqinfo/ui';
import { ListItem } from '@/components';
import classNames from 'classnames';
import { useLockFn } from 'ahooks';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/mdt';
import dayjs from 'dayjs';

export default () => {
  const { id } = useGetParams<{
    id: string;
  }>();
  const { data: detail, loading } = useApi.查询线下MDT详情({
    initValue: { data: {} },
    params: { id },
    needInit: !!id,
  });
  const { loading: prePayLoading, request: prePay } = useApi.线下MDT预支付({
    initValue: { data: {} },
    params: { id, payMethod: 'H5' },
    needInit: !!id,
  });
  const handlePay = useCallback(async () => {
    prePay({ id, payMethod: 'H5' }).then((res: any) => {
      if (res.data) {
        window.location.href = res.data?.payUrl;
      }
    });
  }, [id, prePay]);
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
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
      key: detail?.data?.mdtStartTime
        ? `${dayjs(detail?.data?.mdtStartTime).format('YYYY-MM-DD')} ${dayjs(
            detail?.data?.mdtStartTime,
          ).format('HH:mm')}-${dayjs(detail?.data?.mdtEndTime).format('HH:mm')}`
        : '暂无',
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
    setNavigationBar({
      title: '收银台',
    });
  });
  useEffect(() => {
    setCountdown(15 * 60);
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer, setCountdown]);

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
      {loading && <Loading />}
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
                payFee={Number(detail?.data?.mdtFee)}
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
        <Button
          type="primary"
          onTap={useLockFn(handlePay)}
          loading={prePayLoading}
        >
          立即支付
        </Button>
      </View>
      <Tip
        style={{ marginTop: '160px', marginLeft: '20px' }}
        items={[
          <View key={'tip'} className={styles.tipText}>
            1.目前仅支持自费会诊
          </View>,
          <View key={'tip'} className={styles.tipText}>
            1.目前仅支持自费会诊
          </View>,
          <View key={'tip'} className={styles.tipText}>
            1.目前仅支持自费会诊
          </View>,
        ]}
      />
    </View>
  );
};
