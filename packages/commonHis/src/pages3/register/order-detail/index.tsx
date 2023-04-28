import React, { useState, useCallback } from 'react';
import { View, Image, reLaunch } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { formDate, returnUrl } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import { Button, Space, ReInput, showToast } from '@kqinfo/ui';
import { ListItem, ListTitle, RegisterCardOld } from '@/components';
import { IMAGE_DOMIN, PLATFORM, HOSPITAL_NAME } from '@/config/constant';
import payState from '@/stores/pay';
import useApi from '@/apis/register';
import usePayApi from '@/apis/pay';
import dayjs from 'dayjs';
import styles from './index.less';
import classNames from 'classnames';
import setPageStyle from '@/utils/setPageStyle';
import { PatGender } from '@/config/dict';

const cancelItems = [
  { value: '不想去', checked: false },
  { value: '临时有其他安排', checked: false },
  { value: '挂错科室/医生/时间', checked: false },
];

export default () => {
  const { orderId } = useGetParams<{ orderId: string }>();
  const { setOrderInfo } = payState.useContainer();
  const {
    request,
    data: { data: orderDetail },
  } = useApi.查询挂号订单详情({
    params: {
      orderId,
    },
    needInit: !!orderId,
  });
  const [sheetVisible, setSheetVisible] = useState(false);
  const [barCanvasShow, setBarCanvasShow] = useState(true);
  const [payFlag, setPayFlag] = useState(false);
  const [cancelVal, setCancelVal] = useState('');
  const [toggle, setToggle] = useState([true, false]);
  const [toggle2, setToggle2] = useState([true, false]);
  const clinicList = [
    {
      label: '就诊医院',
      text: HOSPITAL_NAME || orderDetail?.hisName,
    },
    {
      label: '就诊科室',
      text: orderDetail?.deptName,
    },
    {
      label: '就诊医生',
      text: orderDetail?.doctorName,
    },
    {
      label: '医生职称',
      text: orderDetail?.doctorTitle,
    },
    {
      label: '就诊时间',
      text:
        `${formDate(orderDetail?.visitDate).slice(0, 10) || ''} ${
          orderDetail?.visitBeginTime || ''
        }-${orderDetail?.visitEndTime || ''}` || '暂无',
    },
    {
      label: '就诊人',
      text: orderDetail?.patientName,
    },
    {
      label: '就诊卡号',
      text: orderDetail?.patCardNo,
    },
  ];

  const orderList = [
    {
      label: '业务类型',
      text: orderDetail?.bizName,
    },
    {
      label: '订单状态',
      text: orderDetail?.cancelReason || orderDetail?.statusName,
    },
    {
      label: '医院单号',
      text: orderDetail?.hisOrderNo || '暂无',
    },
    {
      label: '平台单号',
      text: orderDetail?.orderId,
    },
    {
      label: '交易单号',
      text: orderDetail?.payOrderId || '暂无',
    },
    {
      label: '交易金额',
      text: `¥ ${(Number(orderDetail?.totalFee) / 100).toFixed(2)}`,
      className: styles.money,
    },
  ];

  const carryPay = useCallback(async () => {
    setPayFlag(true);
    const {
      data: {
        orderId,
        hisName,
        deptName,
        doctorName,
        patientName,
        patCardNo,
        patientSex,
        visitBeginTime,
        visitEndTime,
        payOrderId,
        patientAge,
        totalFee,
        visitDate,
        leftPayTime,
      },
    } = await request();
    if (leftPayTime > 0) {
      const isTody =
        formDate(visitDate).slice(0, 10) === dayjs().format('YYYY-MM-DD');
      if (PLATFORM === 'web') {
        // H5 支付逻辑
        const result = await usePayApi.h5支付下单.request({
          orderId: payOrderId,
          callbackUrl: `${returnUrl()}#/pages/waiting/index?bizType=${
            isTody ? 'DBGH' : 'YYGH'
          }&orderId=${orderId}`,
        });
        if (result.code === 0 && result.data) {
          window.location.href = result.data;
        }
      } else {
        // 小程序收银台
        const isTody =
          formDate(visitDate).slice(0, 10) === dayjs().format('YYYY-MM-DD');
        setOrderInfo({
          bizType: isTody ? 'DBGH' : 'YYGH',
          hisName: hisName,
          deptName: deptName,
          doctorName: doctorName,
          patientName: `${patientName} | ${
            PatGender[patientSex] || ''
          } | ${patientAge}岁`,
          patCardNo,
          registerTime: `${formDate(visitDate).slice(
            0,
            10,
          )} ${visitBeginTime}-${visitEndTime}`,
          totalFee: totalFee,
          orderId,
          payOrderId,
        });
        reLaunch({
          url: '/pages/pay/index',
        });
      }
    } else {
      showToast({
        title: '当前号源已失效，请重新挂号',
        icon: 'none',
      });
      request();
    }
    setPayFlag(false);
  }, [request, setOrderInfo]);
  const cancelRegisterPay = useCallback(async () => {
    if (!cancelVal) {
      showToast({
        icon: 'none',
        title: '请选择取消原因!',
      });
      return;
    }
    const { code } = await useApi.取消锁号.request({
      orderId,
      cancelReason: cancelVal,
    });
    setCancelVal('');
    setPageStyle({
      overflow: 'inherit',
    });
    setSheetVisible(false);
    setBarCanvasShow(true);
    if (code === 0) {
      request();
    } else {
      showToast({ title: '取消挂号失败，请重试!', icon: 'fail' });
    }
  }, [cancelVal, orderId, request]);

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
            orderDetail?.status === 'S' || orderDetail?.status === 'L'
              ? 'success'
              : orderDetail?.status === 'F'
              ? 'fail'
              : 'abnormal'
          }.png`}
          className={styles.statusImg}
        />
        <View>
          <View className={styles.status}>{orderDetail?.statusName}</View>
          <View className={styles.statusInfo}>
            {orderDetail?.status === 'S' &&
              `挂号成功，请根据签到时间至少提前5分钟携带绑定的卡（身份证、医保卡、院内诊疗卡）到科室分诊处签到候诊。
                就诊卡号：${orderDetail?.patCardNo}`}
            {orderDetail?.status === 'L' &&
              '请在锁号的时候内完成支付，否则将取消号源'}
            {orderDetail?.status === 'C' && '挂号已取消，如需就诊请重新挂号'}
            {orderDetail?.status === 'F' &&
              orderDetail?.refundList?.length >= 1 &&
              orderDetail.refundList[0].refundDesc}
          </View>
        </View>
      </View>

      <RegisterCardOld
        payName="register"
        barCanvasShow={barCanvasShow}
        patCardNo={orderDetail?.patCardNo || ''}
      />
      <ListTitle
        title="就诊信息"
        showMore
        toggle={toggle[0]}
        onTap={() => setToggle([!toggle[0], toggle[1]])}
        elderly
      />
      <View className={styles.cards}>
        <View className={styles.card}>
          {clinicList
            .slice(0, toggle[0] ? clinicList?.length : 4)
            .map((item) => (
              <ListItem key={item.label} {...item} elderly />
            ))}
        </View>
      </View>
      <ListTitle
        title="订单信息"
        showMore
        toggle={toggle2[0]}
        onTap={() => setToggle2([!toggle2[0], toggle2[1]])}
        elderly
      />
      <View className={styles.cards}>
        <View className={styles.card}>
          {orderList
            .slice(0, toggle2[0] ? clinicList?.length : 4)
            .map((item) => (
              <ListItem key={item.label} {...item} elderly />
            ))}
        </View>
      </View>

      <View className={styles.buttons}>
        {orderDetail?.canPayFlag === 1 &&
          Number(orderDetail?.leftPayTime) > 0 && (
            <Button
              type="primary"
              className={styles.button}
              onTap={carryPay}
              disabled={payFlag}
              loading={payFlag}
              elderly
            >
              继续支付
            </Button>
          )}
        {orderDetail?.canCancelFlag === 1 && (
          <Button
            type={'primary'}
            ghost
            className={styles.button}
            elderly
            onTap={() => {
              setPageStyle({
                overflow: 'hidden',
              });
              setBarCanvasShow(false);
              setSheetVisible(true);
            }}
          >
            取消挂号
          </Button>
        )}
      </View>
      {sheetVisible && (
        <Space className={styles.sheet} justify="center" alignItems="center">
          <Space vertical className={styles.sheetCard}>
            <Space justify="center" className={styles.sheetTitle}>
              请选择或输入取消原因
            </Space>
            <Space vertical>
              {cancelItems.map((item) => (
                <Button
                  key={item.value}
                  type="primary"
                  elderly
                  className={classNames(styles.cancelBtn, {
                    [styles.activeBtn]: cancelVal === item.value,
                  })}
                  onTap={() => setCancelVal(item.value)}
                >
                  {item.value}
                </Button>
              ))}
            </Space>
            <ReInput
              placeholder="请输入其他原因"
              className={styles.sheeftInput}
              onChange={(val) => val && setCancelVal(val)}
              placeholderClassName={styles.sheetPlaceholder}
              adjustPosition
              onConfirm={cancelRegisterPay}
            />
            <Space justify="space-between" alignItems="center">
              <Button
                elderly
                type="primary"
                block={false}
                className={styles.sheetBtn}
                onTap={() => {
                  setPageStyle({
                    overflow: 'inherit',
                  });
                  setBarCanvasShow(true);
                  setSheetVisible(false);
                }}
              >
                取消
              </Button>
              <Button
                elderly
                ghost
                type="primary"
                block={false}
                className={styles.sheetBtn}
                onTap={cancelRegisterPay}
              >
                确定
              </Button>
            </Space>
          </Space>
        </Space>
      )}
    </View>
  );
};
