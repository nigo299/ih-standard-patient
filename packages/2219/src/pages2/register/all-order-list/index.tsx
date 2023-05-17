import React, { memo, useMemo, useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace } from '@/components';
import {
  Space,
  NoData,
  Shadow,
  DropDownMenu,
  FormItem,
  Picker,
  Button,
} from '@kqinfo/ui';
import useCommApi from '@/apis/common';
import classNames from 'classnames';
import styles from './index.less';
import reportCmPV from '@/alipaylog/reportCmPV';
import patientState from '@/stores/patient';
import dayjs from 'dayjs';

export default memo(() => {
  const [rangeDate, setRangeDate] = useState([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ] as any[]);
  const { bindPatientList } = patientState.useContainer();
  console.log(bindPatientList, 'bindPatientList');
  const ids = bindPatientList.map((item) => {
    return Number(item?.patHisNo);
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
    needInit: true,
  });
  console.log(allOrderList, 'allOrderList');
  const [buttonText, setButtonText] = useState('选择查询日期');
  const [visible1, setVisible1] = useState(false);

  const showList = useMemo(() => {
    if (allOrderList?.data?.length >= 1) {
      return allOrderList?.data;
    }
    return [];
  }, [allOrderList?.data]);

  usePageEvent('onShow', () => {
    reportCmPV({ title: '挂号记录查询' });

    setNavigationBar({
      title: '挂号订单',
    });
  });

  return (
    <View>
      <DropDownMenu showModal={false} className={styles.menu}>
        <Space vertical className={styles.calendarContainer}>
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
      </DropDownMenu>
      <WhiteSpace />
      <View className={styles.content}>
        {showList?.length >= 1 &&
          showList.map((order) => (
            <React.Fragment key={order?.orderId}>
              <Shadow card>
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
