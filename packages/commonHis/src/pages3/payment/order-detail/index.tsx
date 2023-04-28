import React, { useState } from 'react';
import { View, Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/payment';
import { Table, Space, PartTitle } from '@kqinfo/ui';
import { ListItem, ListTitle, RegisterCardOld } from '@/components';
import { IMAGE_DOMIN, HOSPITAL_NAME, HOSPITAL_TEL } from '@/config/constant';
import { formDate } from '@/utils';
import styles from './index.less';
import { PatGender } from '@/config/dict';

export default () => {
  const { orderId } = useGetParams<{ orderId: string }>();
  const {
    data: { data: orderDetail },
    loading: orderLoading,
  } = useApi.查询门诊缴费订单详情({
    params: {
      orderId,
    },
    needInit: !!orderId,
  });
  const [toggle, setToggle] = useState([true, false]);
  const infoList = [
    {
      label: '就诊人',
      text: orderDetail?.patientName,
    },
    {
      label: '性别',
      text: PatGender[orderDetail?.patientSex] || '',
    },
    {
      label: '年龄',
      text: `${orderDetail?.patientAge}岁`,
    },
    {
      label: '就诊号',
      text: orderDetail?.patCardNo,
    },
  ];
  const clinicList = [
    {
      label: '开单医院',
      text: HOSPITAL_NAME || orderDetail?.hisName,
    },
    {
      label: '开单科室',
      text: orderDetail?.deptName || '暂无',
    },
    {
      label: '开单医生',
      text: orderDetail?.doctorName || '暂无',
    },
    {
      label: '开单时间',
      text: orderDetail?.hisOrderTime
        ? formDate(orderDetail?.hisOrderTime)
        : '暂无',
    },
    {
      label: '项目类别',
      text: orderDetail?.chargeType,
    },
  ];

  const orderList = [
    {
      label: '业务类型',
      text: orderDetail?.bizName,
    },
    {
      label: '缴费时间',
      text: orderDetail?.payedTime,
    },
    {
      label: '平台单号',
      text: orderDetail?.orderId,
    },
    {
      label: '交易单号',
      text: orderDetail?.agtOrdNum,
    },
    {
      label: '交易金额',
      text: `¥ ${(Number(orderDetail?.totalRealFee) / 100).toFixed(2)}`,
      className: styles.money,
    },
  ];

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '订单详情',
    });
  });
  return (
    <View className={styles.page}>
      <View className={styles.top}>
        <Image
          mode="aspectFit"
          src={`${IMAGE_DOMIN}/payment/${
            orderDetail?.status === 'S'
              ? 'success'
              : orderDetail?.status === 'F'
              ? 'fail'
              : 'abnormal'
          }.png`}
          className={styles.statusImg}
        />
        <View>
          <View className={styles.status}>
            {orderDetail?.status === 'S'
              ? '缴费成功'
              : orderDetail?.status === 'F'
              ? '缴费失败'
              : '缴费异常'}
          </View>
          <View className={styles.statusInfo}>
            {orderDetail?.status === 'S' ? (
              orderDetail?.guideInfo
            ) : orderDetail?.status === 'F' ? (
              <Text>
                订单缴费失败，退款已受理，退款金额将于
                <Text className={styles.whiteText}>
                  1-7个工作日自动原路返回到
                </Text>
                您的账户。
              </Text>
            ) : (
              <Text>
                非常抱歉给您带来的不便，请您
                前往挂号缴费窗口，工作人员将为您核实缴费情况。
                您也可以致电我院客服为您办理
                <Text className={styles.whiteText}>({HOSPITAL_TEL})。</Text>
              </Text>
            )}
          </View>
        </View>
      </View>
      <RegisterCardOld
        payName="payment"
        patCardNo={orderDetail?.patCardNo || ''}
      />
      <PartTitle full bold elderly>
        就诊人信息
      </PartTitle>
      <View className={styles.cards}>
        <View className={styles.card}>
          {infoList.map((item) => (
            <ListItem key={item.label} {...item} elderly />
          ))}
        </View>
      </View>
      <ListTitle
        title="开单信息"
        showMore
        toggle={toggle[0]}
        onTap={() => setToggle([!toggle[0], toggle[1]])}
        elderly
      />
      <View className={styles.cards}>
        <View className={styles.card}>
          {clinicList
            .slice(0, toggle[0] ? clinicList?.length : 2)
            .map((item) => (
              <ListItem key={item.label} {...item} elderly />
            ))}

          <Table
            loading={orderLoading}
            dataSource={orderDetail?.itemList || []}
            className={styles.table}
            rowCls={styles.tbr}
            headerCls={styles.tbHead}
            itemCls={styles.tItem}
            doubleColor={'#FFF'}
            align={'between'}
            rowStyle={{ color: '#666', fontWeight: 'bold' }}
            columns={[
              { title: '项目名称', dataIndex: 'itemName' },
              { title: '规格', dataIndex: 'itemSpces' },
              {
                title: '数量/单位',
                dataIndex: 'itemUnit',
              },
              {
                title: '金额/元',
                dataIndex: 'totalFee',
                render: (v) => (
                  <View>{v ? (+v / 100).toFixed(2) : '暂无'}</View>
                ),
              },
            ]}
          />
          <Space justify="flex-end" className={styles.bottom}>
            <View className={styles.money}>
              {`合计金额：¥ ${(Number(orderDetail?.totalRealFee) / 100).toFixed(
                2,
              )}`}
            </View>
          </Space>
        </View>
      </View>
      <PartTitle full bold elderly>
        订单
      </PartTitle>
      <View className={styles.cards}>
        <View className={styles.card}>
          {orderList.map((item) => (
            <ListItem key={item.label} {...item} elderly />
          ))}
        </View>
      </View>
    </View>
  );
};
