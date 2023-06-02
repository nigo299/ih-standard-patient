import React from 'react';
import { View, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Form, Platform, Button, showToast } from '@kqinfo/ui';
import { FloatingBall, ListItem, ListTitle } from '@/components';
import { IMAGE_DOMIN, ORDER_INVOICE } from '@/config/constant';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/inhosp';
import styles from './index.less';
import { formDate } from '@/utils';
import useCommApi from '@/apis/common';

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
      text: formDate(orderDetail?.payedTime),
    },
  ];

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '住院预缴详情',
    });
  });

  return (
    <View className={styles.page}>
      <FloatingBall />
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
        <ListTitle title="就诊信息" />
        <View className={styles.list}>
          {clinicList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </View>
        <ListTitle title="订单信息" />
        <View className={styles.list}>
          {orderList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </View>
        {ORDER_INVOICE &&
          orderDetail?.status === 'S' &&
          orderDetail?.payStatus === 1 &&
          orderDetail?.totalFee > 0 && (
            <Platform platform={['web']}>
              <Button
                type="primary"
                className={styles.button}
                onTap={async () => {
                  const {
                    data: { ebillDataList },
                  } = await useCommApi.查询电子发票.request({
                    patCardNo: orderDetail?.patCardNo,
                    payOrderId: orderDetail?.payOrderId,
                    endDate: formDate(orderDetail?.payedTime).slice(0, 10),
                    beginDate: formDate(orderDetail?.payedTime).slice(0, 10),
                    extFields: {
                      noteType: '2',
                      no: orderDetail?.hisOrderNo,
                      totalFee: orderDetail?.totalRealFee,
                      patientName: orderDetail?.patientName,
                      hisRecepitNo: orderDetail?.hisRecepitNo,
                    },
                  });
                  if (ebillDataList.length >= 1) {
                    if (ebillDataList[0].pictureUrl) {
                      window.location.href = ebillDataList[0].pictureUrl;
                    } else {
                      showToast({
                        icon: 'fail',
                        title: '电子发票生成失败，请到门诊窗口补录!',
                      });
                    }
                  }
                }}
              >
                查看电子票据
              </Button>
            </Platform>
          )}
      </Form>
    </View>
  );
};
