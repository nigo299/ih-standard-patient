import React from 'react';
import { View, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, NoData, Shadow, FormItem } from '@kqinfo/ui';
import classNames from 'classnames';
import useApi from '@/apis/inhosp';
import styles from './index.less';
import { formDate } from '@/utils';
import CustomerReported from '@/components/customerReported';
import { useHisConfig } from '@/hooks';
export default () => {
  const { config } = useHisConfig();
  const {
    data: { data: inpatientList },
  } = useApi.查询住院订单列表({
    initValue: {
      data: [],
    },
    needInit: true,
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '住院预缴记录',
    });
  });

  return (
    <Space className={styles.page} vertical size={20}>
      {inpatientList?.length >= 1 &&
        inpatientList?.map(
          (item) =>
            item.status.toLocaleUpperCase() !== 'U' && (
              <Shadow key={item.orderId} card>
                <Space
                  vertical
                  className={styles.item}
                  size={10}
                  onTap={() =>
                    item.orderId &&
                    navigateTo({
                      url: `/pages2/inhosp/order-detail/index?orderId=${item?.orderId}`,
                    })
                  }
                >
                  <Space size={30} alignItems="center" justify="space-between">
                    <Space alignItems={'center'} size={20}>
                      {/* <View className={styles.title}>{item?.patientName}</View> */}
                      <FormItem
                        label={item?.patientName}
                        labelWidth="3.5em"
                        colon={false}
                        className={styles.title}
                      />
                      {Number(item.refundStatus) === 1 && (
                        <View className={styles.tag}>有退款</View>
                      )}
                    </Space>
                    <Space size={20}>
                      <View className={styles.cash}>
                        ￥{(item.totalFee / 100).toFixed(2)}
                      </View>
                    </Space>
                  </Space>
                  <Space size={20} justify="space-between">
                    <Space vertical size={20}>
                      <View className={styles.subItem}>
                        住院科室：{item?.deptName || '暂无'}
                      </View>
                      <View className={styles.subItem}>
                        就诊卡号：{item?.[config?.patCardNoValue]}
                      </View>
                      <View className={styles.subItem}>
                        缴费时间：
                        <Text className={styles.time}>
                          {formDate(item?.payedTime) || '暂无'}
                        </Text>
                      </View>
                    </Space>
                    <Space
                      justify="center"
                      alignItems="center"
                      className={classNames(styles.statusTag, styles.success)}
                    >
                      {item.statusName}
                    </Space>
                  </Space>
                </Space>
              </Shadow>
            ),
        )}
      <Space vertical alignItems={'center'} size={100}>
        <NoData />
        <CustomerReported whereShowCode={'ZWSJ_ZJ'} />
      </Space>
    </Space>
  );
};
