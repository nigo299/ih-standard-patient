import React, { memo, useMemo, useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { formDate } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { NoDataOld, WhiteSpace } from '@/components';
import { Space, DropDownMenu, DropDownMenuItem, FormItem } from '@kqinfo/ui';
import useApi from '@/apis/register';
import classNames from 'classnames';
import styles from './index.less';

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
          if (prev.every((subItem) => subItem.text !== item.patientName)) {
            prev.push({ text: item.patientName, value: item.patientName });
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
        .filter((item) => !orderType || item.patientName === orderType)
        .filter((item) => !orderStatus || item.statusName === orderStatus);
    }
    return [];
  }, [orderList, orderStatus, orderType]);

  usePageEvent('onShow', () => {
    request();
    setNavigationBar({
      title: '挂号记录',
    });
  });
  return (
    <View className={styles.page}>
      <DropDownMenu className={styles.menu}>
        <DropDownMenuItem
          title={'就诊人'}
          onChange={setOrderType}
          itemCls={styles.menuItem}
          itemSelectCls={styles.menuItem}
          options={options1}
          arrowsSize={30}
          arrowsColor={'#fff'}
        />
        <DropDownMenuItem
          title={'订单状态'}
          options={options2}
          itemCls={styles.menuItem}
          itemSelectCls={styles.menuItem}
          onChange={setOrderStatus}
          arrowsSize={30}
          arrowsColor={'#fff'}
        />
      </DropDownMenu>
      <WhiteSpace />
      <View className={styles.content}>
        {showList?.length >= 1 ? (
          showList.map((order, index) => (
            <React.Fragment key={index}>
              <Space
                className={styles.items}
                justify="space-between"
                alignItems="center"
                onTap={() =>
                  navigateTo({
                    url: `/pages3/register/order-detail/index?orderId=${order?.orderId}`,
                  })
                }
              >
                <Space vertical justify="center">
                  <Space
                    className={styles.item}
                    justify="space-between"
                    alignItems="center"
                  >
                    <Space>
                      <FormItem
                        label={'就诊医生'}
                        labelWidth="4em"
                        className={styles.label}
                        labelCls={styles.label}
                      />
                      <Space alignItems="center" className={styles.itemText}>
                        <View> {order?.doctorName}</View>
                        {order.refundStatus === 1 && (
                          <Space
                            className={styles.reFundName}
                            justify="center"
                            alignItems="center"
                          >
                            有退款
                          </Space>
                        )}
                      </Space>
                    </Space>
                    <Space className={styles.price}>
                      ￥{Number(order?.totalFee / 100).toFixed(2)}
                    </Space>
                  </Space>
                  <Space className={styles.item}>
                    <FormItem
                      label={'就诊类型'}
                      labelWidth="4em"
                      className={styles.label}
                      labelCls={styles.label}
                    />
                    <View className={styles.itemText}>{order?.bizName}</View>
                  </Space>
                  <Space className={styles.item}>
                    <FormItem
                      label={'就诊科室'}
                      labelWidth="4em"
                      className={styles.label}
                      labelCls={styles.label}
                    />
                    <View className={styles.itemText}>{order?.deptName}</View>
                  </Space>

                  <Space className={styles.item}>
                    <FormItem
                      label={'就诊时间'}
                      labelWidth="4em"
                      className={styles.label}
                      labelCls={styles.label}
                    />
                    <View className={styles.itemText}>
                      {`${formDate(order?.visitDate).slice(0, 10)} ${
                        order?.visitBeginTime
                      }-${order?.visitEndTime}`}
                    </View>
                  </Space>
                </Space>
                <Space
                  alignItems="center"
                  justify="center"
                  className={classNames(styles.statusName, {
                    [styles.fill]: order.status.toLocaleUpperCase() === 'F',
                    [styles.success]:
                      order.status.toLocaleUpperCase() === 'S' ||
                      order.status.toLocaleUpperCase() === 'L',
                    [styles.warn]: order.status.toLocaleUpperCase() === 'H',
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
                </Space>
              </Space>

              <WhiteSpace />
            </React.Fragment>
          ))
        ) : (
          <NoDataOld />
        )}
      </View>
    </View>
  );
});
