import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Image,
  Text,
  navigateTo,
  redirectTo,
  navigateBack,
  TapEvent,
  reLaunch,
} from 'remax/one';
import { usePageEvent } from 'remax/macro';
import classNames from 'classnames';
import useApi, { WaitpayType } from '@/apis/payment';
import usePatientApi from '@/apis/usercenter';
import useRegisterApi from '@/apis/register';
import usePayApi from '@/apis/pay';
import {
  FormItem,
  Form,
  Button,
  showToast,
  Exceed,
  Space,
  Loading,
} from '@kqinfo/ui';
import showModal from '@/utils/showModal';
import payState, { OrderInfoType } from '@/stores/pay';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  IMAGE_DOMIN,
  PLATFORM,
  PAYMENT_SELECTALL,
  PAYMENT_SELECTALL_PAY,
  PAY_TYPE,
} from '@/config/constant';
import { decrypt, formDate, returnUrl } from '@/utils';
import useGetParams from '@/utils/useGetParams';
import { Tip } from '@/components';
import styles from '@/pages2/payment/order-list/components/single-pay/index.less';
import reportCmPV from '@/alipaylog/reportCmPV';
import storage from '@/utils/storage';
import socialPayAuth from '@/utils/socialPayAuth';
import { useUpdateEffect } from 'ahooks';

export default () => {
  const { setOrderInfo } = payState.useContainer();
  const { patientId, patCardNo } = useGetParams<{
    patientId: string;
    patCardNo: string;
  }>();
  const [waitOpList, setWaitOpList] = useState<WaitpayType[]>([]);
  const [form] = Form.useForm();
  const [payFlag, setPayFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectList, setSelectList] = useState<string[]>([]);
  const { data: hospitialConfigData } = usePatientApi.获取医院挷卡配置信息({
    needInit: true,
  });
  const {
    data: { data: patientInfo },
  } = usePatientApi.查询就诊人详情({
    params: {
      patientId,
      idFullTransFlag: '1',
    },
    needInit: !!patientId,
  });
  const selectAll = useMemo(() => {
    if (selectList.length === 0 || selectList.length !== waitOpList.length) {
      return false;
    }
    return true;
  }, [waitOpList?.length, selectList.length]);
  const handlePay = useCallback(
    async (payAuthNo?: string) => {
      if (process.env.REMAX_APP_PLATFORM === 'app') {
        if (storage.get('idNo') !== decrypt(patientInfo?.encryptIdNo)) {
          showToast({
            icon: 'fail',
            title: '请使用本人医保身份信息进行支付!',
          });
          return;
        }
      }
      setPayFlag(true);
      let newHisOrdNums = '';
      selectList.map((order) => (newHisOrdNums += `${order},`));
      newHisOrdNums = newHisOrdNums.slice(0, newHisOrdNums.length - 1);
      const params = {
        deptName: waitOpList[0].deptName,
        doctorName: waitOpList[0].doctorName,
        createDate: formDate(waitOpList[0].date),
        hisOrderNo: newHisOrdNums,
        medinsureChannel:
          PLATFORM === 'ali'
            ? 3
            : process.env.REMAX_APP_PLATFORM === 'app'
            ? 1
            : 2,
      };
      const medicalPay =
        (hospitialConfigData?.data?.medicalPay?.indexOf('WeChat') > -1 ||
          hospitialConfigData?.data?.medicalPay?.indexOf('Alipay') > -1) &&
        patientId;
      const payMentParams =
        medicalPay || process.env.REMAX_APP_PLATFORM === 'app'
          ? {
              ...params,
              hisBillNo: waitOpList[0]?.hisBillNo,
              deptId: waitOpList[0]?.deptNo,
              doctorId: waitOpList[0]?.doctorId,
              doctorIdNo: waitOpList[0]?.doctorIdNo,
              medicalParam: waitOpList[0]?.medicalParam,
              medicalFlag: '2',
              extFields: JSON.stringify({
                idNo: storage.get('idNo'),
              }),
            }
          : params;
      const { code, data, msg } = await useApi.创建门诊缴费订单.request(
        patientId
          ? {
              patientId,
              ...payMentParams,
            }
          : {
              patCardNo,
              scanFlag: '1',
              ...payMentParams,
            },
      );
      const orderInfo: OrderInfoType = {
        bizType: 'MZJF',
        hisName: data?.hisName,
        deptName: data?.deptName,
        doctorName: data?.doctorName,
        patientName: `${waitOpList[0].patientName} | ${
          waitOpList[0].gender === 'M' ? '男' : '女'
        } | ${waitOpList[0].age || '未知'}岁`,
        // patientName: `${waitOpList[0].patientName} | ${
        //   waitOpList[0].gender === 'M' ? '男' : '女'
        // }`,
        patCardNo: waitOpList[0]?.patCardNo,
        patientFullIdNo: decrypt(patientInfo?.encryptIdNo),
        totalFee: data.totalFee,
        orderId: data.orderId,
        payOrderId: data.payOrderId,
      };

      if (code === 0 && data?.payOrderId) {
        // 0元支付
        if (Number(data?.totalFee) === 0) {
          const url = PAY_TYPE['MZJF'].detail;
          if (PLATFORM === 'web') {
            setPayFlag(false);
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
          // 线上医保App
          const result = await useRegisterApi.医保下单.request({
            orderId: data.orderId,
            payOrderId: data.payOrderId,
            uniqueCode: 11,
            totalFee: 0,
            selfFee: 0,
            payAuthNo: payAuthNo || '',
            ocToken: '',
            insuCode: '',
          });
          if (result.code === 0) {
            storage.set('orderId', data.orderId);
            storage.set('bizType', 'MZJF');
            storage.set('payment_selectList', '[]');
            window.location.href = result.data;
          } else {
            window.location.href = window.location.href.split('&encData')[0];
          }
        } else if (PLATFORM === 'web') {
          // H5 支付逻辑
          const result = await usePayApi.h5支付下单.request({
            orderId: data.payOrderId,
            callbackUrl: `${returnUrl()}#/pages/waiting/index?bizType=MZJF&orderId=${
              data.orderId
            }`,
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
          icon: 'fail',
          title: msg || '下单失败，请重试!',
        });
      }

      setPayFlag(false);
    },
    [
      hospitialConfigData?.data?.medicalPay,
      patCardNo,
      patientId,
      patientInfo?.encryptIdNo,
      selectList,
      setOrderInfo,
      waitOpList,
    ],
  );
  const onSelectAll = useCallback(
    (event: TapEvent, item: WaitpayType) => {
      event.stopPropagation();
      if (PAYMENT_SELECTALL) {
        if (selectList.includes(item.hisOrderNo)) {
          setSelectList((prev) =>
            prev.filter((subItem) => subItem !== item.hisOrderNo),
          );
        } else {
          setSelectList((prev) => [...prev, item.hisOrderNo]);
        }
      } else {
        setSelectList([item.hisOrderNo]);
      }
    },
    [selectList],
  );

  const getWaitOpList = useCallback(async () => {
    setLoading(true);
    const { data, code } = await useApi.查询门诊待缴费列表.request(
      patientId
        ? {
            patientId,
          }
        : {
            patCardNo,
            scanFlag: '1',
          },
    );
    if (code === 0 && data?.length >= 1) {
      setWaitOpList(data);
      if (PAYMENT_SELECTALL_PAY) {
        setSelectList(data?.map((item) => item.hisOrderNo));
      } else {
        setSelectList([data[0].hisOrderNo]);
      }
    } else if (data?.length === 0) {
      showModal({
        title: '提示',
        content: '当前就诊人暂无待缴费记录, 请重新选择就诊人!',
      }).then(({ confirm }) => {
        if (confirm) {
          redirectTo({
            url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/payment/order-list/index',
          });
        } else {
          navigateBack();
        }
      });
    }
    setLoading(false);
  }, [patCardNo, patientId]);
  useUpdateEffect(() => {
    if (process.env.REMAX_APP_PLATFORM === 'app') {
      const href = window.location.href;
      if (href.includes('encData=') && selectList.length >= 1) {
        socialPayAuth(href).then((res) => {
          handlePay(res?.payAuthNo);
        });
      }
    }
  }, [waitOpList]);
  usePageEvent('onShow', (query) => {
    reportCmPV({ title: '门诊缴费', query });
    if (!patientId && !patCardNo) {
      redirectTo({
        url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/payment/order-list/index',
      });
    }
    if (waitOpList.length === 0) {
      getWaitOpList();
    }
    setNavigationBar({
      title: '门诊缴费',
    });
  });
  return (
    <View className={styles.wrap}>
      {loading && waitOpList.length === 0 && <Loading type={'top'} />}
      <View className={styles.list}>
        {waitOpList &&
          waitOpList?.length >= 1 &&
          waitOpList?.map((item) => (
            <View
              key={item.hisOrderNo}
              className={styles.item}
              onTap={() => {
                navigateTo({
                  url: `/pages2/payment/order-item/index?hisOrderNo=${encodeURIComponent(
                    item.hisOrderNo,
                  )}&deptName=${item.deptName}&doctorName=${
                    item.doctorName
                  }&patientName=${item.patientName}&patientId=${
                    item.patientId
                  }&patCardNo=${item.patCardNo}&date=${item.date}&gender=${
                    item.gender
                  }&age=${item.age}`,
                });
              }}
            >
              <View className={styles.price}>{`¥${(
                Number(item.totalFee) / 100
              ).toFixed(2)}`}</View>
              <View className={styles.infoWrap}>
                <View
                  className={styles.checkBoxWrap}
                  onTap={(event) =>
                    !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                  }
                >
                  {!PAYMENT_SELECTALL_PAY && (
                    <>
                      {selectList.includes(item.hisOrderNo) ? (
                        <Space
                          justify="center"
                          alignItems="center"
                          className={styles.select}
                        >
                          <Image
                            mode="aspectFit"
                            src={`${IMAGE_DOMIN}/payment/select.png`}
                            className={styles.selectImg}
                          />
                        </Space>
                      ) : (
                        <View className={styles.checkBox} />
                      )}
                    </>
                  )}
                </View>
                <Form className={styles.info} form={form}>
                  <View
                    className={styles.title}
                    onTap={(event) =>
                      !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                    }
                  >
                    {`${item.patientName} ${
                      item.gender === 'M' ? '男' : '女'
                    } | ${item.age}岁`}
                  </View>
                  <View className={styles.td}>
                    <FormItem
                      label={'开单医生'}
                      labelWidth={'4em'}
                      className={styles.label}
                      onTap={(event) =>
                        !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                      }
                    />
                    <View>{item.doctorName}</View>
                  </View>
                  <View className={styles.td}>
                    <FormItem
                      label="项目名称"
                      labelWidth={'4em'}
                      className={styles.label}
                      onTap={(event) =>
                        !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                      }
                    />

                    <Exceed className={styles.payName} clamp={1}>
                      {item.payName || '暂无'}
                    </Exceed>
                  </View>
                  <View className={styles.td}>
                    <FormItem
                      label="开单时间"
                      labelWidth={'4em'}
                      className={styles.label}
                      onTap={(event) =>
                        !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                      }
                    />
                    <View>{formDate(item.date) || '暂无'}</View>
                  </View>
                </Form>
              </View>
              <View className={styles.arrowWrap}>
                <Image
                  mode="aspectFit"
                  src={`${IMAGE_DOMIN}/payment/arrow.png`}
                  className={styles.arrow}
                />
              </View>
            </View>
          ))}
      </View>

      <View className={styles.tips}>
        <Tip
          items={[
            <View key={'tip'} className={styles.tipText}>
              请仔细核对您本次就医的单据，以免缴错、多缴；
              <Text style={{ color: '#E27854' }}>
                缴费后不支持线上退费，请谨慎操作；
              </Text>
            </View>,
          ]}
        />
      </View>

      <View className={styles.foot}>
        {PAYMENT_SELECTALL && (
          <View
            className={styles.choose}
            onTap={() => {
              if (selectList.length === waitOpList?.length) {
                setSelectList([]);
              } else {
                setSelectList(waitOpList?.map((item) => item.hisOrderNo));
              }
            }}
          >
            {selectAll ? (
              <Space
                justify="center"
                alignItems="center"
                className={classNames(styles.select, styles.selectAll)}
              >
                <Image
                  mode="aspectFit"
                  src={`${IMAGE_DOMIN}/payment/select.png`}
                  className={styles.selectImg}
                />
              </Space>
            ) : (
              <View className={classNames(styles.checkBox, styles.mr9)} />
            )}
            全选
          </View>
        )}
        <View
          className={classNames(styles.total, {
            PAYMENT_SELECTALL: [styles.selectToatl],
          })}
        >
          合计￥
          {waitOpList
            ?.reduce((prev, item) => {
              return (prev += selectList.includes(item.hisOrderNo)
                ? Number(item.totalFee) / 100
                : 0);
            }, 0)
            .toFixed(2)}
        </View>
        <Button
          block={false}
          type="primary"
          className={styles.btn}
          onTap={() => {
            storage.set('payment_selectList', JSON.stringify(selectList));
            socialPayAuth().then(() => {
              handlePay();
            });
          }}
          loading={payFlag}
          disabled={
            payFlag || selectList.length === 0 || waitOpList.length === 0
          }
        >
          立即缴费
        </Button>
      </View>
    </View>
  );
};
