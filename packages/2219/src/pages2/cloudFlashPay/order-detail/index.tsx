import React, { useMemo, useState } from 'react';
import { View, Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/cloudFlashPay';
import {
  Form,
  // Table,
  Space,
  Platform,
  Button,
  showToast,
  ColorText,
} from '@kqinfo/ui';
import { FloatingBall, ListItem, ListTitle, MedicallItem } from '@/components';
import {
  IMAGE_DOMIN,
  HOSPITAL_NAME,
  HOSPITAL_TEL,
  ORDER_INVOICE,
} from '@/config/constant';
import { formDate } from '@/utils';
import useCommApi from '@/apis/common';
import styles from './index.less';
// import RegisterCard from '@/components/registerCard';
import CustomerReported from '@/components/customerReported';
import { MedicalPayType } from '@/apis/register';

export default () => {
  const { hisOrderNo, patCardNo, doctorName, deptName, patHisNo } =
    useGetParams<{
      hisOrderNo: string;
      patCardNo: string;
      deptName: string;
      doctorName: string;
      patHisNo: string;
    }>();
  console.log(hisOrderNo, 'hisOrderNo');
  const {
    data: { data: orderDetail },
    // loading: orderLoading,
  } = useApi.门诊待缴费列表详情查询({
    params: {
      hisOrderNo: hisOrderNo,
      ext_patCardType: '22',
      ext_patCardNo: patCardNo,
      ext_deptName: decodeURIComponent(deptName),
      ext_doctorName: decodeURIComponent(doctorName),
      ext_patHisNo: patHisNo,
      extFields: JSON.stringify({ patHisNo }),
      patCardNo,
    },
    needInit: !!hisOrderNo,
  });
  const {
    data: detailData,
    // loading: orderLoading,
  } = useApi.就诊人详情({
    params: {
      patCardNo,
      ext_patHisNo: patHisNo,
      extFields: JSON.stringify({ patHisNo }),
      patHisNo: patHisNo,
    },
    needInit: !!patCardNo,
  });
  console.log(detailData, 'detailData');
  const [form] = Form.useForm();
  const [medicalInfo, setMedicalInfo] = useState(false);
  const [toggle, setToggle] = useState([true, false]);
  const infoList = [
    {
      label: '就诊人',
      text: `${orderDetail?.patientName} | ${
        orderDetail?.patientSex === 'M' ? '男' : '女'
      } | ${orderDetail?.patientAge}岁`,
    },
    {
      label: '就诊号',
      text: orderDetail?.patHisNo,
    },
  ];
  const clinicList = [
    {
      label: '开单医院',
      text: orderDetail?.hisName || HOSPITAL_NAME,
    },
    {
      label: '开单科室',
      text: decodeURIComponent(deptName),
    },
    {
      label: '开单医生',
      text: decodeURIComponent(doctorName),
    },
    {
      label: '取药位置',
      text: orderDetail?.guideInfo,
    },
    {
      label: '项目类别',
      text: orderDetail?.chargeType,
    },
  ];

  const orderList = useMemo(() => {
    const list = [
      {
        label: '缴费时间',
        text: formDate(orderDetail?.payedTime),
      },
      {
        label: '平台单号',
        text: orderDetail?.orderId,
      },
      {
        label: '交易单号',
        text: orderDetail?.payOrderId,
      },
      {
        label: '交易金额',
        text: `¥ ${(Number(orderDetail?.totalRealFee) / 100).toFixed(2)}`,
        className: styles.money,
      },
    ];

    if (orderDetail?.preSettlementResult) {
      const medicalData = JSON.parse(
        orderDetail.preSettlementResult,
      ) as MedicalPayType;
      return [
        ...list,
        {
          label: '医保支付',
          text: `¥ ${Number(medicalData?.psnAcctPay).toFixed(2)}`,
          className: styles.money,
        },
        {
          label: '自费支付',
          text: `¥ ${Number(medicalData?.ownPayAmt || 0).toFixed(2)}`,
          className: styles.money,
        },
      ];
    }

    return list;
  }, [orderDetail]);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '订单详情',
    });
  });
  return (
    <View className={styles.wrap}>
      {orderDetail?.preSettlementResult && (
        <MedicallItem
          show={medicalInfo}
          close={() => setMedicalInfo(false)}
          medicalData={
            JSON.parse(orderDetail.preSettlementResult) as MedicalPayType
          }
        />
      )}
      <FloatingBall />
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
        <View style={{ width: '100%' }}>
          <Space
            className={styles.status}
            alignItems={'center'}
            justify={'space-between'}
          >
            {orderDetail?.status === 'S'
              ? '缴费成功'
              : orderDetail?.status === 'F'
              ? '缴费失败'
              : '缴费异常'}
            {orderDetail?.status !== 'S' && (
              <CustomerReported
                whereShowCode={
                  orderDetail?.status === 'F' ? 'JFSB_YSJ' : 'JFYC_YSJ'
                }
              />
            )}
          </Space>
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
                <Text className={styles.whiteText}>
                  前往挂号缴费窗口，工作人员将为您核实缴费情况。
                </Text>
                您也可以致电我院客服为您办理
                <Text className={styles.whiteText}>({HOSPITAL_TEL})。</Text>
              </Text>
            )}
          </View>
        </View>
      </View>

      <Form className={styles.content} form={form}>
        <ListTitle title="就诊人信息" />
        <View className={styles.list}>
          {infoList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </View>
        <ListTitle
          title="开单信息"
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
          <Space justify="flex-end" className={styles.bottom}>
            <View className={styles.money}>
              {`合计金额：¥ ${(Number(orderDetail?.totalFee) / 100).toFixed(
                2,
              )}`}
            </View>
          </Space>
        </View>
        <ListTitle
          title="订单信息"
          rightElement={
            orderDetail?.preSettlementResult && (
              <ColorText
                className={styles.colorText}
                onTap={() => setMedicalInfo(true)}
              >
                查看明细
              </ColorText>
            )
          }
        />
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
                      noteType: '1',
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
