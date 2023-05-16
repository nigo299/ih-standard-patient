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
  Picker,
  Button,
} from '@kqinfo/ui';
import useApi from '@/apis/register';
import useCommApi from '@/apis/common';
import classNames from 'classnames';
import styles from './index.less';
import reportCmPV from '@/alipaylog/reportCmPV';
import { PatGender } from '@/config/dict';
import useGetParams from '@/utils/useGetParams';
import patientState from '@/stores/patient';
import dayjs from 'dayjs';
// import { DatePicker, Toast, Button } from 'antd-mobile';

export default memo(() => {
  const [rangeDate, setRangeDate] = useState([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ] as any[]);
  const { bindPatientList } = patientState.useContainer();
  const { checkAll } = useGetParams<{
    checkAll: string;
  }>();
  console.log(bindPatientList, 'bindPatientList');
  const ids = bindPatientList.map((item) => {
    return Number(item?.patHisNo);
  });
  const {
    request,
    data: { data: orderList },
  } = useApi.查询挂号订单列表({
    initValue: {
      data: [],
    },
    needInit: true,
  });
  const {
    data: { data: allOrderList },
    request: checkAllOrders,
  } = useCommApi.透传字段({
    params: {
      transformCode: 'KQ00071',
      ids: `[${ids.join(',')}]`,
      startDate: rangeDate?.[0]
        ? dayjs(rangeDate[0]).format('YYYY-MM-DD')
        : undefined,
      endDate: rangeDate?.[1]
        ? dayjs(rangeDate?.[1]).format('YYYY-MM-DD')
        : undefined,
      // sign: '33EB0D4437FBC59D65BA4D86261DD44B',
      // t: '202304',
    },
    needInit: !!checkAll,
  });
  console.log(allOrderList, 'allOrderList');
  const [buttonText, setButtonText] = useState('选择查询日期');
  const [orderType, setOrderType] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [visible1, setVisible1] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
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
    if (allOrderList?.data?.length >= 1) {
      setShowAllOrders(true);
      return allOrderList?.data;
    }
    if (orderList?.length >= 1) {
      return orderList
        .filter((item) => !orderType || item.bizName === orderType)
        .filter((item) => !orderStatus || item.statusName === orderStatus);
    }
    return [];
  }, [allOrderList?.data, orderList, orderStatus, orderType]);

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
        {!checkAll && (
          <>
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
          </>
        )}
        {!!checkAll && (
          // <DropDownMenuItem
          //   title={
          //     rangeDate?.[0]
          //       ? `${dayjs(rangeDate?.[0]).format('YYYY/MM/DD')}~${dayjs(
          //           rangeDate?.[1],
          //         ).format('YYYY/MM/DD')}`
          //       : '就诊时间'
          //   }
          //   className={styles.dropLeft}
          //   arrowsSize={18}
          //   maxHeight={'100vh'}
          // >
          <Space vertical className={styles.calendarContainer}>
            {/* <Space className={styles.calenderfoot}>
                <Space className={styles.footItem}>
                  {rangeDate?.[0]
                    ? `${dayjs(rangeDate?.[0]).format('YYYY/MM/DD')}~${dayjs(
                        rangeDate?.[1],
                      ).format('YYYY/MM/DD')}`
                    : '就诊时间'}
                </Space>
                <Space
                  className={styles.footItemActive}
                  onTap={() => {
                    setRangeDate([]);
                  }}
                >
                  清空
                </Space>
              </Space> */}
            {/* <Calendar.Picker
                range={true}
                current={rangeDate as any}
                onChange={(v: any[]) => {
                  if (!v?.[1]) {
                    return;
                  }
                  setRangeDate(v);
                  console.log(v);
                }}
              /> */}

            {/* <DatePicker
              visible={visible1}
              onClose={() => {
                setVisible1(false);
              }}
              precision="month"
              onConfirm={(val) => {
                const startOfMonth = dayjs(val).startOf('month').toDate();
                const endOfMonth = dayjs(val).endOf('month').toDate();
                setRangeDate([startOfMonth, endOfMonth]);
                setButtonText(dayjs(val).format('YYYY年MM月'));
              }}
              min={dayjs().subtract(5, 'year').month(0).toDate()}
              max={new Date()}
            /> */}
            <Picker
              mode={'month'}
              visible={visible1}
              start={dayjs().subtract(5, 'year').month(0).format('YYYY-MM')}
              end={dayjs().format('YYYY-MM')}
              onChange={(val: any) => {
                console.log(val, 'vallll');
                const startOfMonth = dayjs(val).startOf('month').toDate();
                const endOfMonth = dayjs(val).endOf('month').toDate();
                setRangeDate([startOfMonth, endOfMonth]);
                setButtonText(dayjs(val).format('YYYY年MM月'));
                console.log(startOfMonth, endOfMonth, '111');
                checkAllOrders({
                  transformCode: 'KQ00071',
                  ids: `[${ids.join(',')}]`,
                  startDate: dayjs(rangeDate[0]).format('YYYY-MM-DD'),
                  endDate: dayjs(rangeDate?.[1]).format('YYYY-MM-DD'),
                });
              }}
            >
              <Button
                type="primary"
                onTap={() => {
                  setVisible1(true);
                }}
              >
                {buttonText}
              </Button>
            </Picker>
          </Space>
          // </DropDownMenuItem>
        )}
      </DropDownMenu>
      <WhiteSpace />
      <View className={styles.content}>
        {showList?.length >= 1 &&
          !checkAll &&
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
                          PatGender[order.patientSex] || ''
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
        {showList?.length >= 1 &&
          showAllOrders &&
          showList.map((order, index) => (
            <React.Fragment key={index}>
              <Shadow card key={order?.orderId}>
                <Space
                  vertical
                  className={styles.item}
                  onTap={() =>
                    navigateTo({
                      url: `/pages2/register/all-order/index?order=${JSON.stringify(
                        order,
                      )}`,
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
                          label={order?.patName}
                          labelWidth="4em"
                          colon={false}
                        />
                      </Space>
                    </Space>
                    <Space className={styles.price}>
                      ￥{Number(order?.regFee / 100).toFixed(2)}
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
                        [styles.success]: order?.status === '0',
                        // [styles.fail]:
                        //   order?.status === 'F' || order?.status === 'H',
                        [styles.warning]: order?.status === '1',
                        [styles.cancel]: order?.status === '4',
                      })}
                    >
                      {order?.status === '0' && '已支付未签到'}
                      {order?.status === '3' && '已接诊'}
                      {order?.status === '2' && '已签到未接诊'}
                      {order?.status === '1' && '未支付未签到'}
                      {order?.status === '4' && '已取消'}
                      {/* {order?.status === 'S' &&
                        order?.visitStatus === 1 &&
                        '已就诊'}
                      {order?.status === 'S' &&
                        order?.visitStatus === 2 &&
                        '未就诊'}
                      {order?.status === 'F' && '支付失败'}
                      {order?.status === 'L' && '待支付'}
                      {order?.status === 'C' && '已取消'}
                      {order?.status === 'H' && '支付异常'} */}
                    </View>
                  </Space>
                  <Space
                    className={styles.time}
                  >{`就诊时间 : ${order?.scheduleDate} ${order?.timeFlag}${order?.beginTime}-${order?.endTime}`}</Space>
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
