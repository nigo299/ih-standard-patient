import React, { memo, useMemo, useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { formDate } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace } from '@/components';
import {
  Space,
  NoData,
  Shadow,
  DropDownMenu,
  DropDownMenuItem,
  FormItem,
} from '@kqinfo/ui';
import useApi from '@/apis/register';
import classNames from 'classnames';
import styles from './index.less';
import reportCmPV from '@/alipaylog/reportCmPV';

export default memo(() => {
  const {
    request,
    data: { data: orderList },
  } = useApi.查询挂号订单列表({
    initValue: {
      data: [],
    },
    needInit: true,
  });
  const [orderType, setOrderType] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const options1 = useMemo(() => {
    if (orderList?.length >= 1) {
      return [{ text: '全部', value: '' }].concat(
        orderList.reduce((prev: any[], item) => {
          if (prev.every((subItem) => subItem.text !== item.bizName)) {
            prev.push({ text: item.bizName, value: item.bizName });
          }
          return prev;
        }, []),
      );
    }
    return [];
  }, [orderList]);
  const options2 = useMemo(() => {
    if (orderList?.length >= 1) {
      return [{ text: '全部', value: '' }].concat(
        orderList.reduce((prev: any[], item) => {
          if (prev.every((subItem) => subItem.text !== item.statusName)) {
            prev.push({ text: item.statusName, value: item.statusName });
          }
          return prev;
        }, []),
      );
    }
    return [];
  }, [orderList]);

  const showList = useMemo(() => {
    if (orderList?.length >= 1) {
      return orderList
        .filter((item) => !orderType || item.bizName === orderType)
        .filter((item) => !orderStatus || item.statusName === orderStatus);
    }
    return [];
  }, [orderList, orderStatus, orderType]);

  usePageEvent('onShow', () => {
    reportCmPV({ title: '挂号记录查询' });
    request();
    setNavigationBar({
      title: '挂号订单',
    });
  });
  return (
    <View>
      <DropDownMenu showModal={false} className={styles.menu}>
        <DropDownMenuItem
          title={'订单类型'}
          onChange={setOrderType}
          options={options1}
          arrowsSize={18}
        />
        <DropDownMenuItem
          title={'订单状态'}
          options={options2}
          onChange={setOrderStatus}
          arrowsSize={18}
        />
      </DropDownMenu>
      <WhiteSpace />
      <View className={styles.content}>
        {showList?.length >= 1 &&
          showList.map((order, index) => (
            <React.Fragment key={index}>
              <Shadow card key={order?.orderId}>
                <Space
                  vertical
                  className={styles.item}
                  onTap={() =>
                    navigateTo({
                      url: `/pages2/register/order-detail/index?orderId=${order?.orderId}`,
                    })
                  }
                >
                  <Space
                    justify="space-between"
                    alignItems="center"
                    flex="auto"
                  >
                    <Space alignItems="center">
                      <Space alignItems="center" className={styles.name}>
                        <FormItem
                          label={order?.patientName}
                          labelWidth="4em"
                          colon={false}
                        />
                        <View className={styles.name2}>{`${
                          order.patientSex === 'M' ? '男' : '女'
                        } | ${order.patientAge}`}</View>
                      </Space>
                      <View className={styles.bizName}>{order?.bizName}</View>
                      {order.refundStatus === 1 && (
                        <View className={styles.reFundName}>有退款</View>
                      )}
                    </Space>
                    <Space className={styles.price}>
                      ￥{Number(order?.totalRealFee / 100).toFixed(2)}
                    </Space>
                  </Space>
                  <Space
                    justify="space-between"
                    alignItems="center"
                    flex="auto"
                  >
                    <View className={styles.deptName}>
                      {`就诊科室 : ${order?.deptName}`}
                    </View>
                    <View
                      className={classNames(styles.status, {
                        [styles.success]: order?.status === 'S',
                        [styles.fail]:
                          order?.status === 'F' || order?.status === 'H',
                        [styles.warning]: order?.status === 'L',
                        [styles.cancel]: order?.status === 'C',
                      })}
                    >
                      {order?.status === 'S' &&
                        order?.visitStatus === 0 &&
                        '待就诊'}
                      {order?.status === 'S' &&
                        order?.visitStatus === 1 &&
                        '已就诊'}
                      {order?.status === 'S' &&
                        order?.visitStatus === 2 &&
                        '未就诊'}
                      {order?.status === 'F' && '支付失败'}
                      {order?.status === 'L' && '待支付'}
                      {order?.status === 'C' && '已取消'}
                      {order?.status === 'H' && '支付异常'}
                    </View>
                  </Space>
                  <Space className={styles.time}>{`就诊时间 : ${formDate(
                    order?.visitDate,
                  ).slice(0, 10)} ${order?.visitBeginTime}-${
                    order?.visitEndTime
                  }`}</Space>
                </Space>
              </Shadow>
              <WhiteSpace />
            </React.Fragment>
          ))}
        <NoData />
      </View>
    </View>
  );
});
