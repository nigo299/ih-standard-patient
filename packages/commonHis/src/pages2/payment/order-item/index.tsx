import React from 'react';
import { View, Image } from 'remax/one';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import styles from './index.less';
import useApi from '@/apis/payment';
import { ListItem, WhiteSpace, RegisterCard } from '@/components';
import useGetParams from '@/utils/useGetParams';
import { Form, PartTitle, Table, Space } from '@kqinfo/ui';
import { HOSPITAL_NAME, IMAGE_DOMIN } from '@/config/constant';
import { formDate } from '@/utils';
import { useHisConfig } from '@/hooks';
import { PatGender } from '@/config/dict';

export default () => {
  const { config } = useHisConfig();
  const {
    hisOrderNo,
    deptName,
    doctorName,
    patCardNo,
    patientId,
    patientName,
    date,
    gender,
    age,
  } = useGetParams<{
    hisOrderNo: string;
    deptName: string;
    doctorName: string;
    patientName: string;
    patCardNo: string;
    patHisNo: string;
    patientId: string;
    date: string;
    age: string;
    gender: string;
  }>();
  console.log(patientId, 'patientId');

  const {
    loading,
    data: { data: waitOpDetail },
  } = useApi.查询门诊待缴费详情({
    initValue: {
      data: { waitOpList: [] },
    },
    params:
      patientId && patientId !== 'null' && patientId !== 'undefined'
        ? {
            patientId,
            hisOrderNo: decodeURIComponent(hisOrderNo),
          }
        : {
            patCardNo,
            scanFlag: '1',
            hisOrderNo: decodeURIComponent(hisOrderNo),
          },
    needInit: (!!patientId || !!patCardNo) && !!hisOrderNo,
  });
  const infoList = [
    {
      label: '就诊人',
      text: `${patientName} | ${PatGender[gender] || ''} | ${age}岁`,
    },
    {
      label: '就诊号',
      text: patCardNo,
    },
  ];
  const clinicList = [
    {
      label: '开单医院',
      text: waitOpDetail?.hisName,
    },
    {
      label: '开单科室',
      text: deptName,
    },
    {
      label: '开单医生',
      text: doctorName,
    },
    {
      label: '开单时间',
      text: formDate(date),
      hide: config?.hideBillTime,
    },
    {
      label: '项目类别',
      text: waitOpDetail?.chargeType,
    },
  ];

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '订单详情',
    });
  });
  return (
    <View className={styles.wrap}>
      <View className={styles.top}>
        <Image
          src={`${IMAGE_DOMIN}/payment/wait.png`}
          className={styles.statusImg}
        />
        <View>
          <View className={styles.status}>等待缴费</View>
          <View className={styles.statusInfo}>请尽快完成待缴费!</View>
        </View>
      </View>

      <RegisterCard
        payName="payment"
        healthCardNo=""
        hospitalName={waitOpDetail?.hisName || HOSPITAL_NAME}
        patCardNo={patCardNo || ''}
      />
      <Form className={styles.content}>
        <View className={styles.body}>
          <PartTitle className={styles.title}>就诊人信息</PartTitle>
          <View className={styles.list}>
            {infoList.map((item) => (
              <ListItem key={item.label} {...item} />
            ))}
          </View>
          <PartTitle className={styles.title}>开单信息</PartTitle>
          <View className={styles.list}>
            {clinicList.map((item) => {
              if (item.hide) {
                return null;
              }
              return <ListItem key={item.label} {...item} />;
            })}
            <Table
              loading={loading}
              dataSource={waitOpDetail?.itemList || []}
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
                // {
                //   title: '单价/元',
                //   dataIndex: 'itemPrice',
                //   render: (v) => <View>{(+v / 100).toFixed(2)}</View>,
                // },
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
                {`合计金额：¥ ${(Number(waitOpDetail?.totalFee) / 100).toFixed(
                  2,
                )}`}
              </View>
            </Space>
            <WhiteSpace />
          </View>
        </View>
      </Form>
    </View>
  );
};
