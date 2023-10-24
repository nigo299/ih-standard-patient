import React, { useState, useCallback, useMemo } from 'react';
import { View, Image, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import {
  decrypt,
  formDate,
  getBrowserUa,
  getUrlParams,
  returnUrl,
} from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import {
  Form,
  Button,
  Radio,
  Platform,
  showToast,
  ColorText,
  Loading,
  Space,
} from '@kqinfo/ui';
import {
  ListItem,
  ListTitle,
  Dialog,
  FloatingBall,
  MedicallItem,
} from '@/components';
import {
  IMAGE_DOMIN,
  PLATFORM,
  HOSPITAL_NAME,
  ORDER_INVOICE,
  APPID,
} from '@/config/constant';
import payState, { OrderInfoType } from '@/stores/pay';
import useApi, { MedicalPayType } from '@/apis/register';
import usePayApi from '@/apis/pay';
import usePatientApi from '@/apis/usercenter';
import useCommApi from '@/apis/common';
import dayjs from 'dayjs';
import styles from './index.less';
import socialPayAuth from '@/utils/socialPayAuth';
import storage from '@/utils/storage';
import { useDownCount } from 'parsec-hooks';
import { useUpdateEffect } from 'ahooks';
import RegisterCard from '@/components/registerCard';
import AntFoestToast from '@/components/antFoestToast';
import navigateToAlipayPage from '@/utils/navigateToAlipayPage';
import CustomerReported from '@/components/customerReported';
import useGetCancelOrderExtFields from '@/pages2/register/order-detail/hooks/useGetCancelOrderExtFields';
import { PatGender } from '@/config/dict';
import { useHisConfig } from '@/hooks';
import { WxOpenLaunchWeapp } from '@/components';

const cancelItems = [
  { value: '不想去', checked: false },
  { value: '临时有其他安排', checked: false },
  { value: '挂错科室', checked: false },
  { value: '医生门诊时间变更', checked: false },
];

export default () => {
  const { config } = useHisConfig();
  const { orderId, mysl = '0' } = useGetParams<{
    orderId: string;
    /**支付宝小程序蚂蚁森林获取 */
    mysl?: string;
  }>();
  const { setOrderInfo } = payState.useContainer();
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const [show, setShow] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: hospitialConfigData } = usePatientApi.获取医院挷卡配置信息({
    needInit: true,
  });
  const {
    request,
    data: { data: orderDetail },
  } = useApi.查询挂号订单详情({
    params: {
      orderId,
    },
    needInit: false,
  });
  const checkTime = useMemo(() => {
    if (orderDetail && orderDetail.visitBeginTime) {
      const time = new Date(`2000-01-01T${orderDetail.visitBeginTime}`);
      time.setMinutes(time.getMinutes() - 10);

      let formattedTime = time.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });

      const hour = time.getHours();
      const period = hour < 12 ? '上午' : '下午';
      formattedTime = `${period} ${formattedTime}`;

      return formattedTime;
    }
    return '';
  }, [orderDetail]);
  const { data } = useCommApi.透传字段({
    params: {
      transformCode: 'KQ00072',
      deptCode: orderDetail?.deptNo,
    },
    needInit: true,
  });
  const [deptInfo] = useState<any>(data?.data?.data || {});
  // const {
  //   data: { data: jkkInfo },
  // } = usePatientApi.查询电子健康卡详情({
  //   initValue: {
  //     data: { qrCodeText: '', address: '' },
  //   },
  //   params: {
  //     patientId: orderDetail?.patientId,
  //   },
  //   needInit: !!orderDetail?.patientId,
  // });
  const [payFlag, setPayFlag] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [cancelVal, setCancelVal] = useState('');
  const [refreshOrderStatus, setRefreshOrderStatus] = useState(false);
  const [form] = Form.useForm();
  const [toggle, setToggle] = useState([true, false]);
  const cancelExtFields = useGetCancelOrderExtFields({ orderDetail });
  const clinicList = [
    {
      label: '签到时间',
      text:
        `${formDate(orderDetail?.visitDate).slice(0, 10) || ''} ${
          orderDetail?.visitWeekName || ''
        } ${checkTime || ''}(前)` || '暂无',
    },
    {
      label: '就诊排队号',
      text: `${orderDetail?.serialNo || ''}`,
    },
    {
      label: '就诊科室',
      text: (
        <View>
          {orderDetail?.deptName || '暂无'}
          {PLATFORM === 'web' && (
            <View className={styles.text} style={{ color: '#3b98c3' }}>
              导航前往
              <WxOpenLaunchWeapp
                username="gh_1828bcf09dc4"
                path={`pages/index/index?buildingId=${deptInfo?.summary}&type=1&hisName=${deptInfo?.name}`}
              />
            </View>
          )}
        </View>
      ),
    },
    {
      label: '就诊位置',
      text: orderDetail?.visitPosition,
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

  const orderList = useMemo(() => {
    const list = [
      {
        label: '业务类型',
        text: orderDetail?.bizName,
      },
      {
        label: '订单状态',
        text: `${orderDetail?.statusName}${
          orderDetail?.cancelReason && orderDetail?.cancelReason !== 'undefined'
            ? `(${orderDetail?.cancelReason})`
            : ''
        }`,
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
      {
        label: '电子票据',
        text: (
          <>
            {ORDER_INVOICE &&
            orderDetail?.payStatus === 1 &&
            orderDetail?.status === 'S' &&
            orderDetail?.totalFee > 0 ? (
              <Platform platform={['web']}>
                <View
                  style={{ color: '#3b98c3' }}
                  onTap={async () => {
                    const {
                      data: { ebillDataList },
                    } = await useCommApi.查询电子发票.request({
                      patCardNo: orderDetail?.patCardNo,
                      payOrderId: orderDetail?.payOrderId,
                      endDate: formDate(orderDetail?.orderTime).slice(0, 10),
                      beginDate: formDate(orderDetail?.orderTime).slice(0, 10),
                      extFields: {
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
                </View>
              </Platform>
            ) : (
              <View>暂无</View>
            )}
          </>
        ),
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

  const carryPay = useCallback(
    async (payAuthNo?: string) => {
      const medicalPay =
        hospitialConfigData?.data?.medicalPay?.indexOf('WeChat') > -1 ||
        hospitialConfigData?.data?.medicalPay?.indexOf('Alipay') > -1;
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
          extFields,
          encryptPatientIdNo,
        },
      } = await request();
      if (leftPayTime > 0) {
        const isTody =
          formDate(visitDate).slice(0, 10) === dayjs().format('YYYY-MM-DD');
        const orderInfo: OrderInfoType = {
          bizType: isTody ? 'DBGH' : 'YYGH',
          hisName: hisName,
          deptName: deptName,
          doctorName: doctorName,
          patientName: `${patientName} | ${
            PatGender[patientSex] || ''
          } | ${patientAge}岁`,
          patCardNo,
          patientFullIdNo: decrypt(encryptPatientIdNo),
          registerTime: `${formDate(visitDate).slice(
            0,
            10,
          )} ${visitBeginTime}-${visitEndTime}`,
          totalFee: totalFee,
          orderId,
          payOrderId,
          extFields,
        };
        if (process.env.REMAX_APP_PLATFORM === 'app') {
          // 线上医保App
          const result = await useApi.医保下单.request({
            orderId,
            payOrderId,
            uniqueCode: isTody ? 13 : 10,
            totalFee: 0,
            selfFee: 0,
            payAuthNo: payAuthNo || '',
            ocToken: '',
            insuCode: '',
            extFields: extFields || '',
          });
          if (result.code === 0 && typeof result.data === 'string') {
            storage.set('orderId', orderId);
            storage.set('bizType', isTody ? 'DBGH' : 'YYGH');
            window.location.href = result.data;
          }
        } else if (PLATFORM === 'web') {
          // H5 支付逻辑
          const result = await usePayApi.h5支付下单.request({
            orderId: payOrderId,
            callbackUrl: `${returnUrl()}#/pages/waiting/index?bizType=${
              isTody ? 'DBGH' : 'YYGH'
            }&orderId=${orderId}`,
          });
          if (result.code === 0 && result.data) {
            if (medicalPay) {
              setOrderInfo({ ...orderInfo, h5PayUrl: result?.data });
              navigateTo({
                url: `/pages/pay/index?mode=medical`,
              });
              return;
            } else {
              window.location.href = result.data;
            }
          }
        } else {
          // 小程序收银台
          setOrderInfo(orderInfo);
          if (medicalPay) {
            navigateTo({
              url: `/pages/pay/index?mode=medical`,
            });
          } else {
            navigateTo({
              url: '/pages/pay/index',
            });
          }
        }
      } else {
        showToast({
          title: '当前号源已失效，请重新挂号',
          icon: 'none',
        });
        request();
      }
      setPayFlag(false);
    },
    [hospitialConfigData, request, setOrderInfo],
  );
  const cancelRegisterPay = useCallback(
    async (payAuthNo?: string, cancelValStorage?: string) => {
      if (!cancelVal && !cancelValStorage) {
        showToast({
          title: '请选择取消原因!',
        });
        return;
      }
      setCancelVal('');
      setLoading(true);
      setShowInfo(false);
      const { code, msg } = await useApi.取消锁号.request({
        orderId,
        cancelReason: cancelVal || cancelValStorage || '',
        payAuthNo: payAuthNo || '',
        extFields: cancelExtFields,
      });
      if (code === 0) {
        setLoading(false);
        request().then(() => {
          showToast({
            icon: 'success',
            title: '取消挂号成功',
          });
          storage.del('cancelVal');
        });
      } else {
        setLoading(false);
        showToast({ title: msg || '取消挂号失败，请重试!', icon: 'fail' });
      }
    },
    [cancelExtFields, cancelVal, orderId, request],
  );
  const medicalAuth = useCallback(async () => {
    if (PLATFORM === 'ali') {
      const { code, data } = await usePayApi.支付宝医保免密授权.request({
        reqBizNo: orderDetail?.payOrderId,
        totalAmount: String(orderDetail?.totalFee),
        callUrl: `alipays://platformapi/startapp?appId=${APPID}&page=pages2/register/order-detail/index?orderId=${orderId}&medicalCancel=1`,
        bizChannel: 'insuranceAliPay',
        scenes: 'cancelRegister',
      });
      if (code === 0) {
        setShowInfo(false);
        if (data?.payAuthNo) {
          cancelRegisterPay(
            data.payAuthNo,
            storage.get('cancelVal') || '不想去',
          );
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
            `${window?.location?.origin}${window?.location?.pathname}#/pages2/register/order-detail/index?orderId=${orderId}&medicalCancel=1`,
          ),
          bizChannel: 'insuranceWxPay',
        });
      if (code === 0 && data?.authUrl) {
        setShowInfo(false);
        storage.set('medicalCancel', '1');
        window.location.href = data.authUrl;
      }
    }
  }, [cancelRegisterPay, orderDetail, orderId]);
  const cancelMedicalPay = useCallback(
    async (cancelVal: string) => {
      if (PLATFORM === 'ali') {
        const { code, data } = await usePayApi.支付宝医保免密授权.request({
          reqBizNo: orderDetail?.payOrderId,
          totalAmount: String(orderDetail?.totalFee),
          callUrl: `alipays://platformapi/startapp?appId=${APPID}&page=pages2/register/order-detail/index`,
          bizChannel: 'insuranceAliPay',
        });
        if (code === 0 && data?.payAuthNo) {
          cancelRegisterPay(data.payAuthNo, cancelVal);
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
          cancelRegisterPay(data.payAuthNo, cancelVal);
        }
      }
    },
    [cancelRegisterPay, orderDetail],
  );
  usePageEvent('onShow', () => {
    if (mysl === '1' && PLATFORM === 'ali') {
      useCommApi.蚂蚁森林能量获取
        .request({
          scene: '1',
        })
        .then((res) => {
          if (res.data) {
            setShow(true);
            setTimeout(() => {
              setShow(false);
            }, 2000);
          }
        });
    }

    if (storage?.get('cancelVal')) {
      setCancelVal(storage.get('cancelVal') || '不想去');
    }
    request().then((result) => {
      if (process.env.REMAX_APP_PLATFORM === 'app') {
        const href = window.location.href;
        const data = result.data;
        if (
          href.includes('encData=') &&
          data?.patientName &&
          data?.canPayFlag === 1 &&
          data?.status === 'L'
        ) {
          socialPayAuth(href).then((res) => {
            carryPay(res?.payAuthNo);
          });
        }
        if (
          href.includes('encData=') &&
          data?.patientName &&
          data?.canCancelFlag === 1 &&
          data?.status === 'S'
        ) {
          socialPayAuth(href).then((res) => {
            cancelRegisterPay(res?.payAuthNo, storage.get('cancelVal'));
          });
        }
      }
      if (
        result?.data?.medicalChannel === 'wechatMedical' ||
        result?.data?.medicalChannel === 'alipayMedical'
      ) {
        if (
          storage?.get('medicalCancel') === '1' &&
          result?.data?.status === 'S' &&
          result?.data?.canCancelFlag === 1
        ) {
          storage.del('medicalCancel');
          cancelMedicalPay(storage.get('cancelVal') || '不想去');
        }
      }
    });
    setNavigationBar({
      title: '订单详情',
    });
  });

  useUpdateEffect(() => {
    if (orderDetail.leftPayTime > 0) {
      setCountdown(orderDetail.leftPayTime).then(() => {
        clearCountdownTimer();
      });
    }
  }, [orderDetail]);
  usePageEvent('onHide', () => {
    clearCountdownTimer();
  });
  return (
    <View className={styles.wrap}>
      {loading && (
        <Loading
          content={orderDetail?.payStatus === 1 ? '正在退款' : '正在退号'}
        />
      )}
      {refreshOrderStatus && <Loading content={'正在刷新订单'} />}
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
      <AntFoestToast
        show={show}
        close={() => setShow(false)}
        number={277}
        type="register"
      />

      <RegisterCard
        payName="register"
        hospitalName={orderDetail?.hisName || HOSPITAL_NAME}
        patCardNo={orderDetail?.patHisNo}
      />
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
          <View>
            <Space
              className={styles.status}
              alignItems={'center'}
              justify={'space-between'}
              // style={{ flexWrap: 'wrap' }}
            >
              {orderDetail?.statusName}
              {(orderDetail?.status === 'F' || orderDetail?.status === 'C') && (
                <CustomerReported
                  whereShowCode={
                    orderDetail?.status === 'F' ? 'DDSB_YSJ' : 'DDSX_YSJ'
                  }
                />
              )}
            </Space>
          </View>
        </View>
        <View className={styles.statusInfo}>
          {orderDetail?.status === 'S' && (
            <View className={styles.regSuccessInfo}>
              <Text style={{ marginLeft: '28px' }}>
                因口腔诊疗特殊性，来院患者须按本人签到时间提前签到
                <Text className={styles.red}>（急诊患者不受签到规则限制）</Text>
                ，具体规则为：
              </Text>
              <br />
              <Text>
                一、请就诊患者务必在签到时间前，携带绑定的卡（身份证、医保卡、院内诊疗卡）到所挂科室楼层自助机提前签到候诊。
              </Text>
              <br />
              <Text>
                二、按时签到者，系统根据挂号序号自动排队，
                <Text className={styles.red}>
                  过号30分钟内的患者，按当前医生接诊队列顺延2位。过号30分钟以上
                </Text>
                ，为保障医疗质量和患者安全，超过医生安全诊疗行为时间的患者，仅可做口腔一般检查，
                <Text className={styles.red}>无法进行治疗操作</Text>
                ，急诊除外。
              </Text>
              <br />
              <Text>
                三、
                <Text className={styles.red}>
                  签到迟到者，须排在当前医生签到队列时段末位，签到迟到30分钟以上者，该号源作废
                </Text>
                ，可退费重新预约。我院签到队列时段分为：上午：8:30-9:30；9：30-10:30；10:30-11:30；下午：14:00-15:00；15:00-16:00；16:00-17:00。
              </Text>
              <br />
              <Text>
                四、享受医保待遇的患者请于就诊当日到门诊收费处或自助机处转为医保重新结算，享受诊查费医保统筹补贴，网上预约挂号费将原路退回。
              </Text>
            </View>
          )}
          {orderDetail?.status === 'L' &&
            '请在锁号的时候内完成支付，否则将取消号源'}
          {orderDetail?.status === 'C' && (
            <View className={styles.regFailInfo}>
              <Text>挂号已取消，如需就诊请重新挂号</Text>
            </View>
          )}
          {orderDetail?.status === 'F' &&
            orderDetail?.refundList?.length >= 1 &&
            (orderDetail?.refundList[0]?.refundDesc?.includes('异常')
              ? '请刷新订单状态，或等待人工处理，若核实挂号未成功，退款金额将于1-7个工作日自动原路返回到您的支付账户。'
              : orderDetail?.refundList[0]?.refundDesc)}
        </View>
        {countdown > 0 && orderDetail?.canPayFlag === 1 && (
          <View className={styles.leftPayTime}>
            {`${`00${Math.floor(countdown / 60)}`.slice(-2)}:${`00${Math.floor(
              countdown % 60,
            )}`.slice(-2)}`}
          </View>
        )}
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
              <ListItem
                key={item.label}
                {...item}
                orderDetail={orderDetail}
                navigate={true}
              />
            ))}
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
      </Form>
      <View className={styles.buttons}>
        {orderDetail?.canPayFlag === 1 && countdown > 0 && (
          <Button
            type="primary"
            className={styles.payButton}
            onTap={() =>
              socialPayAuth().then(() => {
                carryPay();
              })
            }
            disabled={payFlag}
            loading={payFlag}
          >
            继续支付
          </Button>
        )}
        {orderDetail?.canCancelFlag === 1 && (
          <Button
            type={'primary'}
            className={styles.button}
            onTap={() => {
              if (
                config.showCancelRegTips &&
                dayjs(orderDetail?.visitDate).isSame(dayjs(), 'day')
              ) {
                setShowTip(true);
              } else {
                setShowInfo(true);
              }
            }}
          >
            取消挂号
          </Button>
        )}
        {/* {orderDetail?.canCancelFlag !== 1 && (
          <Button
            type={'primary'}
            className={styles.button}
            disabled={refreshOrderStatus}
            loading={refreshOrderStatus}
            onTap={() => {
              setRefreshOrderStatus(true);
              setTimeout(() => {
                setRefreshOrderStatus(false);
              }, 9000);
            }}
          >
            刷新订单状态
          </Button>
        )} */}
      </View>

      <Dialog
        show={showInfo}
        successText="确定"
        failText="取消"
        title="取消原因"
        onFail={() => setShowInfo(false)}
        onSuccess={() => {
          storage.set('cancelVal', cancelVal);
          if (orderDetail?.payStatus === 1) {
            if (
              orderDetail?.medicalChannel === 'wechatMedical' ||
              orderDetail?.medicalChannel === 'alipayMedical'
            ) {
              medicalAuth();
            } else {
              socialPayAuth().then(() => {
                cancelRegisterPay();
              });
            }
          } else {
            cancelRegisterPay();
          }
        }}
      >
        <Radio.Group
          onChange={(v) => setCancelVal(String(v))}
          className={styles.group}
        >
          {cancelItems.map((item, index) => (
            <Radio
              value={item.value}
              key={index}
              style={{
                color: '#989898',
              }}
            >
              {item.value}
            </Radio>
          ))}
        </Radio.Group>
      </Dialog>
      <Dialog
        show={showTip}
        successText="继续退号"
        failText="取消"
        title="温馨提示"
        onFail={() => setShowTip(false)}
        onSuccess={() => {
          setShowTip(false);
          setShowInfo(true);
        }}
      >
        <Space style={{ lineHeight: 1.2, padding: 20 }}>
          <View>
            因我院号源紧张，若90内出现预约成功后就诊当天退号或未按时签到累计达到3次，将视为违约，180天内您将不再享有网上预约挂号服务。
          </View>
        </Space>
      </Dialog>
    </View>
  );
};