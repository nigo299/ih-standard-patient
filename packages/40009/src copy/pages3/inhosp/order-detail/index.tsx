import React from 'react';
import { View, Image, navigateTo, reLaunch } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Form } from '@kqinfo/ui';
import { ListItem, ListTitle } from '@/components';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/inhosp';
import styles from './index.less';
import { Button } from '@kqinfo/ui';

export default () => {
  const { orderId } = useGetParams<{ orderId: string }>();
  const {
    data: { data: orderDetail },
  } = useApi.查询住院订单详情({
    params: {
      orderId,
    },
    needInit: !!orderId,
  });
  const [form] = Form.useForm();
  const clinicList = [
    {
      label: '就诊人',
      text: orderDetail?.patientName,
    },
    {
      label: '就诊卡号',
      text: orderDetail?.patCardNo,
    },
    {
      label: '住院号',
      text: orderDetail?.admissionNum,
    },
  ];

  const orderList = [
    {
      label: '医院名称',
      text: orderDetail?.hisName,
    },
    {
      label: '业务类型',
      text: '住院押金预缴',
    },
    {
      label: '交易单号',
      text: orderDetail?.agtOrdNum,
    },
    {
      label: '平台单号',
      text: orderDetail?.orderId,
    },
    {
      label: '交易金额',
      text: `¥ ${(Number(orderDetail?.totalRealFee) / 100).toFixed(2)}`,
      className: styles.money,
    },
    {
      label: '支付状态',
      text: '成功',
    },
    {
      label: '缴费时间',
      text: orderDetail?.payedTime,
    },
  ];

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '住院预缴详情',
    });
  });

  return (
    <View className={styles.page}>
      <Space className={styles.top} size={25} alignItems="center">
        <Image
          src={`${IMAGE_DOMIN}/payment/${
            orderDetail?.status === 'S'
              ? 'success'
              : orderDetail?.status === 'F'
              ? 'fail'
              : 'abnormal'
          }.png`}
          className={styles.statusImg}
        />
        <Space vertical size={20}>
          <View className={styles.status} style={{ color: '#FFF1A0' }}>
            {orderDetail?.statusName}
          </View>
          <View className={styles.statusInfo}>{orderDetail?.tips}</View>
        </Space>
      </Space>
      <Form form={form} className={styles.content}>
        <ListTitle title="就诊信息" elderly />
        <View className={styles.list}>
          {clinicList.map((item) => (
            <ListItem elderly key={item.label} {...item} />
          ))}
        </View>
        <ListTitle title="订单信息" elderly />
        <View className={styles.list}>
          {orderList.map((item) => (
            <ListItem elderly key={item.label} {...item} />
          ))}
        </View>
      </Form>
      <Button
        type={'primary'}
        className={styles.btn}
        onTap={() => {
          if (PLATFORM === 'web') {
            navigateTo({
              url: '/pages3/home/index',
            });
          } else {
            reLaunch({
              url: '/pages3/home/index',
            });
          }
        }}
      >
        返回首页
      </Button>
    </View>
  );
};
