import React from 'react';
import { View, navigateTo } from 'remax/one';
import { Space, FormItem } from '@kqinfo/ui';
import { usePageEvent } from 'remax/macro';
import { formDate } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace, NoDataOld } from '@/components';
import useApi from '@/apis/payment';
import classNames from 'classnames';
import styles from './index.less';

export default () => {
  const {
    data: { data: outpatientList },
  } = useApi.查询门诊缴费记录({
    initValue: {
      data: [],
    },
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '门诊缴费记录',
    });
  });
  return (
    <View className={styles.page}>
      {outpatientList?.length >= 1 ? (
        outpatientList.map(
          (order, index) =>
            order.status.toLocaleUpperCase() !== 'U' && (
              <React.Fragment key={index}>
                <Space
                  className={styles.items}
                  justify="space-between"
                  alignItems="center"
                  onTap={() =>
                    navigateTo({
                      url: `/pages3/payment/order-detail/index?orderId=${order.orderId}`,
                    })
                  }
                >
                  <Space vertical justify="center">
                    <Space className={classNames(styles.item, styles.name)}>
                      {order?.patientName}
                    </Space>
                    <Space className={styles.item}>
                      <FormItem
                        label={'缴费金额'}
                        labelWidth="4em"
                        className={styles.label}
                        labelCls={styles.label}
                      />
                      <Space alignItems="center">
                        <View className={styles.price}>
                          ￥{Number(order.totalFee / 100).toFixed(2)}
                        </View>
                        {order.refundStatus === 1 && (
                          <View className={styles.bizName}>有退款</View>
                        )}
                      </Space>
                    </Space>
                    <Space className={styles.item}>
                      <FormItem
                        label={'缴费类型'}
                        labelWidth="4em"
                        className={styles.label}
                        labelCls={styles.label}
                      />
                      <View className={styles.itemText}>门诊缴费</View>
                    </Space>

                    <Space className={styles.item}>
                      <FormItem
                        label={'缴费时间'}
                        labelWidth="4em"
                        className={styles.label}
                        labelCls={styles.label}
                      />
                      <View className={styles.itemText}>
                        {formDate(order.payedTime)}
                      </View>
                    </Space>
                  </Space>
                  <Space
                    alignItems="center"
                    className={classNames(styles.statusName, {
                      [styles.fill]: order.status.toLocaleUpperCase() === 'F',
                      [styles.success]:
                        order.status.toLocaleUpperCase() === 'S',
                      [styles.warn]: order.status.toLocaleUpperCase() === 'H',
                    })}
                  >
                    {order.statusName}
                  </Space>
                </Space>

                <WhiteSpace />
              </React.Fragment>
            ),
        )
      ) : (
        <NoDataOld />
      )}
    </View>
  );
};
