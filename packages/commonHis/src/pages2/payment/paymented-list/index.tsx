import React from 'react';
import { View, navigateTo, Text } from 'remax/one';
import { Shadow, NoData, Space, Exceed, FormItem } from '@kqinfo/ui';
import { usePageEvent } from 'remax/macro';
import { formDate } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace } from '@/components';
import useApi from '@/apis/payment';
import classNames from 'classnames';
import styles from './index.less';
import reportCmPV from '@/alipaylog/reportCmPV';

export default () => {
  const {
    data: { data: outpatientList },
  } = useApi.查询门诊缴费记录({
    initValue: {
      data: [],
    },
  });
  usePageEvent('onShow', () => {
    reportCmPV({ title: '缴费记录查询' });
    setNavigationBar({
      title: '门诊缴费记录',
    });
  });
  return (
    <View className={styles.paymented}>
      {outpatientList?.length >= 1 &&
        outpatientList.map(
          (order, index) =>
            order.status.toLocaleUpperCase() !== 'U' && (
              <React.Fragment key={index}>
                <Shadow card key={order.orderId}>
                  <Space
                    justify="center"
                    vertical
                    className={styles.item}
                    onTap={() =>
                      navigateTo({
                        url: `/pages2/payment/order-detail/index?orderId=${order.orderId}`,
                      })
                    }
                  >
                    <Space
                      justify="space-between"
                      alignItems="center"
                      className={styles.lineHeight}
                    >
                      <Space alignItems="center" className={styles.name}>
                        <FormItem
                          label={order?.patientName}
                          labelWidth="4em"
                          colon={false}
                        />
                        <View className={styles.name2}>{`${
                          order.patientSex === 'M' ? '男' : '女'
                        } | ${order.patientAge}岁`}</View>
                      </Space>
                      <Space className={styles.price}>
                        ￥{Number(order.totalFee / 100).toFixed(2)}
                      </Space>
                    </Space>
                    <Space
                      justify="space-between"
                      alignItems="center"
                      className={styles.lineHeight}
                    >
                      <Space alignItems="center" className={styles.title}>
                        {`就诊科室 :`}
                        <Exceed
                          className={classNames(styles.deptName, styles.text)}
                          clamp={1}
                        >
                          {order.deptName}
                        </Exceed>
                      </Space>

                      <Space
                        alignItems="center"
                        className={classNames(styles.payTitle, {
                          [styles.fill]:
                            order.status.toLocaleUpperCase() === 'F',
                          [styles.success]:
                            order.status.toLocaleUpperCase() === 'S',
                        })}
                      >
                        {order.statusName}
                        {order.refundStatus === 1 && (
                          <View className={styles.bizName}>有退款</View>
                        )}
                      </Space>
                    </Space>
                    <Space className={styles.title}>
                      {`缴费时间 :`}
                      <Text className={styles.text}>
                        {formDate(order.payedTime)}
                      </Text>
                    </Space>
                  </Space>
                </Shadow>
                <WhiteSpace />
              </React.Fragment>
            ),
        )}
      <NoData />
    </View>
  );
};
