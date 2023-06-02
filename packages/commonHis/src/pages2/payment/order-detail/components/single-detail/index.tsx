import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import useApi, { OrderDetailType } from '@/apis/payment';
import usePatientApi from '@/apis/usercenter';
import {
  Form,
  Table,
  Space,
  Platform,
  Button,
  showToast,
  ColorText,
  Loading,
} from '@kqinfo/ui';
import {
  FloatingBall,
  ListItem,
  ListTitle,
  MedicallItem,
  PreviewImage,
  RegisterCard,
} from '@/components';
import {
  IMAGE_DOMIN,
  HOSPITAL_NAME,
  HOSPITAL_TEL,
  ORDER_INVOICE,
  PLATFORM,
  APPID,
} from '@/config/constant';
import usePayApi from '@/apis/pay';
import { formDate, getBrowserUa, getUrlParams } from '@/utils';
import useCommApi from '@/apis/common';
import styles from '@/pages2/payment/order-detail/components/single-detail/index.less';
import { MedicalPayType } from '@/apis/register';
import storage from '@/utils/storage';
import navigateToAlipayPage from '@/utils/navigateToAlipayPage';
import { PatGender } from '@/config/dict';

export default () => {
  const { orderId } = useGetParams<{ orderId: string }>();
  const {
    data: { data: orderDetail },
    loading: orderLoading,
    request,
  } = useApi.查询门诊缴费订单详情({
    params: {
      orderId,
    },
    needInit: !!orderId,
  });
  const { data } = useCommApi.透传字段({
    params: {
      transformCode: 'KQ00036',
      patCardNo: orderDetail?.patCardNo,
      pictureUrl1: '',
      pictureUrl2: '',
    },
    needInit:
      !!orderDetail?.patCardNo &&
      orderDetail?.deptName?.includes('核酸') &&
      orderDetail?.totalFee === 0,
  });
  const {
    data: { data: jkkInfo },
  } = usePatientApi.查询电子健康卡详情({
    initValue: {
      data: { qrCodeText: '', address: '' },
    },
    params: {
      patientId: orderDetail?.patientId,
    },
    needInit: !!orderDetail?.patientId,
  });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState(false);
  const [toggle, setToggle] = useState([true, false]);
  const infoList = [
    {
      label: '就诊人',
      text: `${orderDetail?.patientName} | ${
        PatGender[orderDetail?.patientSex] || ''
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
      text: orderDetail?.deptName,
    },
    {
      label: '开单医生',
      text: orderDetail?.doctorName,
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

  const medicalAuth = useCallback(async () => {
    if (PLATFORM === 'ali') {
      const { code, data } = await usePayApi.支付宝医保免密授权.request({
        reqBizNo: orderDetail?.payOrderId,
        totalAmount: String(orderDetail?.totalFee),
        callUrl: `alipays://platformapi/startapp?appId=${APPID}&page=pages2/payment/order-detail/index?orderId=${orderId}&medicalCancel=1`,
        bizChannel: 'insuranceAliPay',
      });
      if (code === 0) {
        if (data?.payAuthNo) {
          usePayApi.门诊医保异常用户申请退费接口.request({
            payAuthNo: data.payAuthNo,
            orderId: orderDetail?.orderId,
          });

          return;
        }
        if (data?.authUrl) {
          storage.set('medicalCancel', '1');
          navigateToAlipayPage({
            path: encodeURI(data.authUrl),
          });
          return;
        }
      }
    }
    if (getBrowserUa() === 'wechat') {
      const { code, data } =
        await usePayApi.微信医保渠道免密授权URL获取.request({
          callUrl: encodeURIComponent(
            `${window?.location?.origin}${window?.location?.pathname}#/pages2/payment/order-detail/index?orderId=${orderId}&medicalCancel=1`,
          ),
          bizChannel: 'insuranceWxPay',
        });
      if (code === 0 && data?.authUrl) {
        storage.set('canApplyRefund', '1');
        window.location.href = data.authUrl;
      }
    }
  }, [
    orderDetail?.orderId,
    orderDetail?.payOrderId,
    orderDetail?.totalFee,
    orderId,
  ]);

  const cancelMedicalPay = useCallback(
    async (orderData: OrderDetailType) => {
      if (PLATFORM === 'ali') {
        const { code, data } = await usePayApi.支付宝医保免密授权.request({
          reqBizNo: orderDetail?.payOrderId,
          totalAmount: String(orderDetail?.totalFee),
          callUrl: `alipays://platformapi/startapp?appId=${APPID}&page=pages2/payment/order-detail/index`,
          bizChannel: 'insuranceAliPay',
        });
        if (code === 0 && data?.payAuthNo) {
          usePayApi.门诊医保异常用户申请退费接口
            .request({
              payAuthNo: data.payAuthNo,
              orderId: orderData?.orderId,
            })
            .then(() => {
              request();
              setLoading(false);
            });
        }
      }
      if (getBrowserUa() === 'wechat') {
        const { authCode } = getUrlParams<{ authCode: string }>(
          window.location.href.split('#')[0],
        );
        const { code, data } = await usePayApi.微信医保免密授权.request({
          qrcode: authCode,
          bizChannel: 'insuranceWxPay',
        });
        if (code === 0 && data?.payAuthNo) {
          usePayApi.门诊医保异常用户申请退费接口
            .request({
              payAuthNo: data.payAuthNo,
              orderId: orderData?.orderId,
            })
            .then(() => {
              request();
              setLoading(false);
            });
        }
      }
    },
    [orderDetail?.payOrderId, orderDetail?.totalFee, request],
  );
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '订单详情',
    });
    request().then((result) => {
      if (
        result?.data?.medicalChannel === 'wechatMedical' ||
        result?.data?.medicalChannel === 'alipayMedical'
      ) {
        if (
          storage.get('canApplyRefund') === '1' &&
          result?.data?.isAbnormal === 1 &&
          result?.data?.canApplyRefund === 1
        ) {
          setLoading(true);
          storage.del('canApplyRefund');
          cancelMedicalPay(result.data);
          return;
        }
      }
    });
  });
  return (
    <View className={styles.wrap}>
      {loading && <Loading content={'正在退款'} />}
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

      {orderDetail?.status === 'S' && (
        <RegisterCard
          payName="payment"
          hospitalName={orderDetail?.hisName || HOSPITAL_NAME}
          healthCardNo={jkkInfo?.healthCardId}
          patCardNo={orderDetail?.patCardNo}
        />
      )}

      <Form className={styles.content} form={form}>
        {data?.data?.data?.pictureUrl1 && (
          <>
            <ListTitle title="网约/出租车从业资格证" />
            <Space vertical justify="center" alignItems="center">
              <PreviewImage
                url={data?.data?.data?.pictureUrl1}
                className={styles.pictureImg}
              />
              <PreviewImage
                url={data?.data?.data?.pictureUrl2}
                className={styles.pictureImg}
              />
            </Space>
          </>
        )}
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
              {`合计金额：¥ ${(Number(orderDetail?.totalRealFee) / 100).toFixed(
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

        {orderDetail?.isAbnormal === 1 && orderDetail?.canApplyRefund === 1 && (
          <Button
            type={'primary'}
            ghost
            className={styles.button}
            onTap={() => {
              medicalAuth();
            }}
          >
            申请退费
          </Button>
        )}
      </Form>
    </View>
  );
};
