import React, { useEffect, useMemo, useState } from 'react';
import { View, Image, Text, navigateTo, reLaunch } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/payment';
import usePatientApi from '@/apis/usercenter';
import {
  Form,
  Table,
  Space,
  Platform,
  Button,
  showToast,
  ColorText,
  Modal,
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
  PAY_TYPE,
  PLATFORM,
} from '@/config/constant';
import { decrypt, formDate, getPatientAge, returnUrl } from '@/utils';
import useCommApi from '@/apis/common';
import styles from '@/pages2/payment/order-detail/components/batch-detail/index.less';
import useRegisterApi, { MedicalPayType } from '@/apis/register';
import CustomerReported from '@/components/customerReported';
import storage from '@/utils/storage';
import payState, { OrderInfoType } from '@/stores/pay';
import usePayApi from '@/apis/pay';
import socialPayAuth from '@/utils/socialPayAuth';
import { PatGender } from '@/config/dict';

export default () => {
  const { orderId } = useGetParams<{ orderId: string }>();
  const { setOrderInfo } = payState.useContainer();
  const {
    data: { data: orderDetail },
    loading: orderLoading,
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
  const {
    data: { data: list },
    request: getWaitList,
  } = useApi.查询门诊待缴费列表({
    needInit: false,
    initValue: { data: [] },
  });
  const [form] = Form.useForm();
  const [medicalInfo, setMedicalInfo] = useState(false);
  const [toggle, setToggle] = useState([true, false]);
  const [leftNum, setLeftNum] = useState<number>(0);
  const infoList = [
    {
      label: '就诊人',
      text: `${orderDetail?.patientName} | ${
        PatGender[orderDetail?.patientSex] || ''
      } | ${getPatientAge(orderDetail?.patientAge)}`,
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

  useEffect(() => {
    if (storage?.get('waitPayListParams')) {
      getWaitList({
        ...JSON.parse(storage.get('waitPayListParams') || ''),
      }).then((r) => {
        if (r.code === 0 && r.data?.length >= 1) {
          const selectedHisSerilNo = r.data.find(
            (item) => item.hisSerilNo === orderDetail?.hisSerialNo,
          )?.hisSerilNo;
          setLeftNum(
            r.data.filter((item) => item.hisSerilNo === selectedHisSerilNo)
              ?.length || 0,
          );
        }
      });
    }
  }, [getWaitList, orderDetail]);

  useEffect(() => {
    if (leftNum && leftNum !== 0) {
      Modal.show({
        title: '温馨提示',
        content: `您还有${leftNum}条未支付订单，请前往继续支付`,
        showCancel: false,
        okText: '继续支付',
        onOk: async () => {
          const selectedHisSerilNo = list?.find(
            (item) => item.hisSerilNo === orderDetail?.hisSerialNo,
          )?.hisSerilNo;
          const selectedItem = list?.find(
            (item) => item.hisSerilNo === selectedHisSerilNo,
          );
          const { code, data, msg } = await useApi.创建门诊缴费订单.request({
            ...JSON.parse(storage.get('createOpOrderParams') || ''),
            hisOrderNo: selectedItem?.hisOrderNo,
          });
          const orderInfo: OrderInfoType = {
            bizType: 'MZJF',
            hisName: data?.hisName,
            deptName: data?.deptName,
            doctorName: data?.doctorName,
            // patientName: `${waitOpList[0].patientName}`,
            patientName: `${selectedItem?.patientInfo?.patientName} | ${
              PatGender[selectedItem?.patientInfo?.patientSex] || ''
            } | ${selectedItem?.patientInfo?.patientAge || '未知'}`,
            patCardNo: orderDetail?.patCardNo,
            patientFullIdNo: decrypt(
              selectedItem?.patientInfo?.encryptIdNo || '',
            ),
            totalFee: data.totalFee,
            orderId: data.orderId,
            payOrderId: data.payOrderId,
          };
          if (code === 0 && data?.payOrderId) {
            // 0元支付
            if (Number(data?.totalFee) === 0) {
              const url = PAY_TYPE['MZJF'].detail;
              if (PLATFORM === 'web') {
                window.history.pushState(null, 'index', '#/pages/home/index');
                navigateTo({
                  url: `${url}?orderId=${data.orderId}`,
                });
              } else {
                reLaunch({
                  url: `${url}?orderId=${data.orderId}`,
                });
              }
              return;
            }
            if (process.env.REMAX_APP_PLATFORM === 'app') {
              socialPayAuth(window.location.href).then(async (res) => {
                // 线上医保App
                const result = await useRegisterApi.医保下单.request({
                  orderId: data.orderId,
                  payOrderId: data.payOrderId,
                  uniqueCode: 11,
                  totalFee: 0,
                  selfFee: 0,
                  payAuthNo: res?.payAuthNo || '',
                  ocToken: '',
                  insuCode: '',
                });
                if (result.code === 0) {
                  storage.set('orderId', data.orderId);
                  storage.set('bizType', 'MZJF');
                  storage.set('payment_selectList', '[]');
                  window.location.href = result.data;
                } else {
                  window.location.href =
                    window.location.href.split('&encData')[0];
                }
              });
            } else if (PLATFORM === 'web') {
              // H5 支付逻辑
              const result = await usePayApi.h5支付下单.request({
                orderId: data.payOrderId,
                callbackUrl: `${returnUrl()}#/pages/waiting/index?bizType=MZJF&orderId=${
                  data.orderId
                }`,
              });
              if (result.code === 0 && result.data) {
                setOrderInfo({ ...orderInfo, h5PayUrl: result?.data });
                navigateTo({
                  url: `/pages/pay/index?mode=medical&hidden=1`,
                });
                return;
              }
            } else {
              // 小程序收银台
              setOrderInfo(orderInfo);
              navigateTo({
                url: `/pages/pay/index?mode=medical&hidden=1`,
              });
            }
          } else {
            showToast({
              icon: 'fail',
              title: msg || '下单失败，请重试!',
            });
          }
        },
      });
    }
  }, [leftNum, list, orderDetail, setOrderInfo]);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '订单详情',
    });
  });
  return (
    <View className={styles.wrap}>
      <Modal />
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
          <Space className={styles.status} justify={'space-between'}>
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

      <RegisterCard
        payName="payment"
        hospitalName={orderDetail?.hisName || HOSPITAL_NAME}
        healthCardNo={jkkInfo?.healthCardId}
        patCardNo={orderDetail?.patCardNo}
      />

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
                render: (v, r) => {
                  return r?.itemNum + v;
                },
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
      </Form>
    </View>
  );
};
