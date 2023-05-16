import React, { useState, useMemo } from 'react';
import { View, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import { Form, Space } from '@kqinfo/ui';
import { ListItem, ListTitle, FloatingBall } from '@/components';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';

import styles from './index.less';

export default () => {
  const { order } = useGetParams<{
    order: any;
  }>();
  const staticOrderInfo = JSON.parse(order);
  console.log(staticOrderInfo, 'staticOrderInfo');

  const [form] = Form.useForm();
  const [toggle, setToggle] = useState([true, false]);
  const clinicList = [
    {
      label: '就诊医院',
      text: HOSPITAL_NAME,
    },
    {
      label: '就诊科室',
      text: staticOrderInfo?.deptName,
    },
    {
      label: '就诊医生',
      text: staticOrderInfo?.doctorName,
    },
    {
      label: '就诊日期',
      text: staticOrderInfo?.scheduleDate,
    },
    {
      label: '就诊时间',
      text:
        `${staticOrderInfo?.timeFlag}${staticOrderInfo?.beginTime}-${staticOrderInfo?.endTime}` ||
        '暂无',
    },
    {
      label: '就诊人',
      text: staticOrderInfo?.patName,
    },
    {
      label: '就诊卡号',
      text: staticOrderInfo?.patId,
    },
  ];

  const orderList = useMemo(() => {
    const list = [
      {
        label: '医院单号',
        text: staticOrderInfo?.hisOrdNum,
      },
      {
        label: '预约来院',
        text: staticOrderInfo?.orderSource,
      },

      {
        label: '挂号费',
        text: `￥${Number(staticOrderInfo?.regFee / 100).toFixed(2)}`,
      },
    ];

    return list;
  }, [staticOrderInfo]);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '订单详情',
    });
  });
  return (
    <View className={styles.wrap}>
      <FloatingBall />

      <View className={styles.top}>
        <Image
          mode="aspectFit"
          src={`${IMAGE_DOMIN}/payment/${
            staticOrderInfo?.status === '0' || staticOrderInfo?.status === '2'
              ? 'success'
              : staticOrderInfo?.status === '4'
              ? 'fail'
              : 'abnormal'
          }.png`}
          className={styles.statusImg}
        />
        <View>
          <View className={styles.status}>
            <Space
              className={styles.status}
              alignItems={'center'}
              justify={'space-between'}
            >
              {staticOrderInfo?.status === '0' && '已支付未签到'}
              {staticOrderInfo?.status === '2' && '已签到未接诊'}
              {staticOrderInfo?.status === '3' && '已接诊'}
              {staticOrderInfo?.status === '1' && '未支付未签到'}
              {staticOrderInfo?.status === '4' && '已取消'}
            </Space>
          </View>
          <View className={styles.statusInfo}>{staticOrderInfo?.payTime}</View>
        </View>
      </View>
      <Form className={styles.content} form={form}>
        <ListTitle
          title="就诊信息"
          showMore
          toggle={toggle[0]}
          onTap={() => setToggle([!toggle[0], toggle[1]])}
        />
        <View className={styles.list}>
          {clinicList
            .slice(0, toggle[0] ? clinicList?.length : 4)
            .map((item) => (
              <ListItem key={item.label} {...item} />
            ))}
        </View>
        <ListTitle title="订单信息" />
        <View className={styles.list}>
          {orderList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </View>
      </Form>
    </View>
  );
};
