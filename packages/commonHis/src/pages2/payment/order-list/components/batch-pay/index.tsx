import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Image,
  Text,
  redirectTo,
  navigateTo,
  navigateBack,
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
  Fold,
  Table,
  Loading,
  Price,
  rpxToPx,
} from '@kqinfo/ui';
import showModal from '@/utils/showModal';
import payState, { OrderInfoType } from '@/stores/pay';
import setNavigationBar from '@/utils/setNavigationBar';
import { IMAGE_DOMIN, PLATFORM, PAY_TYPE } from '@/config/constant';
import { decrypt, formDate, returnUrl } from '@/utils';
import useGetParams from '@/utils/useGetParams';
import { Tip } from '@/components';
import styles from '@/pages2/payment/order-list/components/batch-pay/index.less';
import reportCmPV from '@/alipaylog/reportCmPV';
import storage from '@/utils/storage';
import socialPayAuth from '@/utils/socialPayAuth';
import { useUpdateEffect } from 'ahooks';
import { FormInstance } from 'rc-field-form/es/interface';
import { PatGender } from '@/config/dict';

export default () => {
  const isLogin = useMemo(() => !!storage.get('login_access_token'), []);
  const { setOrderInfo } = payState.useContainer();
  const { patientId, patCardNo, patientName } = useGetParams<{
    patientId: string;
    patCardNo: string;
    patientName: string;
  }>();
  const [waitOpList, setWaitOpList] = useState<
    { title: string; list: WaitpayType[]; hisSerilNo: string }[]
  >([]);
  const [originalList, setOriginalList] = useState<WaitpayType[]>([]);
  const [form] = Form.useForm();
  const [payFlag, setPayFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectList, setSelectList] = useState<string[]>([]);
  const { data: hospitialConfigData } = usePatientApi.获取医院挷卡配置信息({
    needInit: isLogin,
  });
  const {
    data: { data: patientInfo },
    request: patientInfoReq,
  } = usePatientApi.查询就诊人详情({
    params: {
      patientId,
      idFullTransFlag: '1',
    },
    needInit: !!patientId && isLogin,
  });

  const medicalPay = useMemo(
    () =>
      hospitialConfigData?.data?.medicalPay?.indexOf('WeChat') > -1 ||
      hospitialConfigData?.data?.medicalPay?.indexOf('Alipay') > -1,
    [hospitialConfigData?.data?.medicalPay],
  );

  const handlePay = useCallback(
    async (isMedicalPay: boolean, payAuthNo?: string) => {
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
      const selectItem =
        originalList?.find((item) => selectList.includes(item.hisOrderNo)) ||
        ({} as WaitpayType);
      if (
        !selectItem?.patientInfo?.encryptIdNo &&
        !selectItem?.patientInfo?.patientName &&
        !selectItem?.patientInfo?.patientAge
      ) {
        return showModal({
          title: '温馨提示',
          content: '因该就诊人证件信息不全，不支持医保移动支付！',
        });
      }
      const params = {
        deptName: selectItem?.deptName,
        doctorName: selectItem?.doctorName,
        createDate: formDate(selectItem?.date).toString(),
        hisOrderNo: newHisOrdNums,
        medinsureChannel:
          PLATFORM === 'ali'
            ? 3
            : process.env.REMAX_APP_PLATFORM === 'app'
            ? 1
            : 2,
      };
      const payMentParams =
        isMedicalPay || process.env.REMAX_APP_PLATFORM === 'app'
          ? {
              ...params,
              hisBillNo: selectItem?.hisBillNo,
              deptId: selectItem?.deptNo,
              doctorId: selectItem?.doctorId,
              doctorIdNo: selectItem?.doctorIdNo,
              medicalParam: selectItem?.medicalParam,
              medicalFlag: '2',
              extFields: JSON.stringify({
                idNo: storage.get('idNo'),
              }),
              hisOrderNo: newHisOrdNums.split(',')?.[0],
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
      storage.set(
        'createOpOrderParams',
        patientId
          ? JSON.stringify({
              patientId,
              ...payMentParams,
            })
          : JSON.stringify({
              patCardNo,
              scanFlag: '1',
              ...payMentParams,
            }),
      );
      const orderInfo: OrderInfoType = {
        bizType: 'MZJF',
        hisName: data?.hisName,
        deptName: data?.deptName,
        doctorName: data?.doctorName,
        // patientName: `${waitOpList[0].patientName}`,
        patientName: `${selectItem?.patientInfo?.patientName} | ${
          PatGender[selectItem?.patientInfo?.patientSex] || ''
        } | ${selectItem?.patientInfo?.patientAge || '未知'}`,
        patCardNo: originalList[0]?.patCardNo,
        patientFullIdNo: decrypt(selectItem?.patientInfo?.encryptIdNo),
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
            if (isMedicalPay) {
              setOrderInfo({ ...orderInfo, h5PayUrl: result?.data });
              navigateTo({
                url: `/pages/pay/index?mode=medical&hidden=${
                  isMedicalPay || '1'
                }`,
              });
              return;
            } else {
              window.location.href = result.data;
            }
          }
        } else {
          // 小程序收银台
          setOrderInfo(orderInfo);
          if (isMedicalPay) {
            navigateTo({
              url: `/pages/pay/index?mode=medical&hidden=${
                isMedicalPay || '1'
              }`,
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
      originalList,
      patCardNo,
      patientId,
      patientInfo?.encryptIdNo,
      selectList,
      setOrderInfo,
    ],
  );

  const getWaitOpList = useCallback(async () => {
    setLoading(true);

    console.log(patientId, patCardNo, patientName);
    const { data, code } = await useApi.查询门诊待缴费列表.request(
      patientId
        ? {
            patientId,
          }
        : {
            patCardNo,
            scanFlag: patCardNo[0] === '9' ? '2' : '1',
            patientName,
          },
    );
    if (code === 0 && data?.length >= 1) {
      storage.set(
        'waitPayListParams',
        patientId
          ? JSON.stringify({
              patientId,
            })
          : JSON.stringify({
              patCardNo,
              scanFlag: patCardNo[0] === '9' ? '2' : '1',
              patientName,
            }),
      );
      setOriginalList(data);
      const diffsArr: string[] = [];
      data?.forEach((item) => {
        if (!diffsArr.includes(item.hisSerilNo)) {
          diffsArr.push(item.hisSerilNo);
        }
      });
      setWaitOpList(
        diffsArr?.map((item) => ({
          title: `${
            data?.find((innerItem) => innerItem?.hisSerilNo === item)?.date
          } ${
            data?.find((innerItem) => innerItem?.hisSerilNo === item)?.deptName
          }`,
          list: data?.filter((innerItem) => innerItem.hisSerilNo === item),
          hisSerilNo: item,
        })),
      );
    } else if (data?.length === 0) {
      setWaitOpList([]);
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
  }, [patCardNo, patientId, patientName]);
  useUpdateEffect(() => {
    if (process.env.REMAX_APP_PLATFORM === 'app') {
      const href = window.location.href;
      if (href.includes('encData=') && selectList.length >= 1) {
        socialPayAuth(href).then((res) => {
          handlePay(medicalPay, res?.payAuthNo);
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
    if (waitOpList.length === 0 && isLogin) {
      getWaitOpList();
    }
    setNavigationBar({
      title: '门诊缴费',
    });
  });
  console.log(isLogin, 'isLogin');

  const isSelect = (list: WaitpayType[]) => {
    return !!list.find((item) => selectList.includes(item.hisOrderNo))
      ?.hisOrderNo;
  };

  const onListSelect = (hisSerilNo: string) => {
    const selectedHisSerilNo = originalList.find(
      (item) => item.hisOrderNo === selectList[0],
    )?.hisSerilNo;
    if (hisSerilNo === selectedHisSerilNo) {
      setSelectList([]);
    } else {
      setSelectList(
        waitOpList
          ?.find((item) => item.hisSerilNo === hisSerilNo)
          ?.list.map((item) => item.hisOrderNo) || [],
      );
    }
  };

  return (
    <View className={styles.wrap}>
      {loading && waitOpList.length === 0 && <Loading type={'top'} />}
      <View className={styles.list}>
        {waitOpList &&
          waitOpList?.length >= 1 &&
          waitOpList?.map((item) => (
            <Space vertical key={item.hisSerilNo}>
              <Space
                onTap={(event) => {
                  event.stopPropagation();
                  onListSelect(item.hisSerilNo);
                }}
              >
                {isSelect(item.list) ? (
                  <View className={styles.checkBoxWrap}>
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
                  </View>
                ) : (
                  <View className={styles.checkBoxWrap}>
                    <View className={styles.checkBox} />
                  </View>
                )}
                <Space className={styles.titleCls}>{item.title}</Space>
              </Space>
              {item.list.map((innerItem) => (
                <ListItem
                  key={innerItem.hisOrderNo}
                  item={{
                    ...innerItem,
                    patientName: innerItem.patientName || patientName,
                  }}
                  form={form}
                  selectList={selectList}
                  onSelectAll={onListSelect}
                />
              ))}
            </Space>
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
      {!isLogin && (
        <Space alignItems={'center'} justify={'center'}>
          <Button
            type={'attract'}
            className={styles.authBtn}
            onTap={() => patientInfoReq()}
          >
            点击授权
          </Button>
        </Space>
      )}
      <Space className={styles.foot} vertical size={10}>
        <Space alignItems={'center'} size={30}>
          <Space>已选单据：{selectList.length}笔</Space>
          <View
            className={classNames(styles.total, {
              PAYMENT_SELECTALL: [styles.selectToatl],
            })}
          >
            合计￥
            {originalList
              ?.reduce((prev, item) => {
                return (prev += selectList.includes(item.hisOrderNo)
                  ? Number(item.totalFee) / 100
                  : 0);
              }, 0)
              .toFixed(2)}
          </View>
        </Space>
        <Space size={20} justify={'space-between'}>
          {medicalPay && (
            <Button
              block={false}
              type="primary"
              className={styles.btn}
              loading={payFlag}
              disabled={
                payFlag || selectList.length === 0 || waitOpList.length === 0
              }
              onTap={() => {
                storage.set('payment_selectList', JSON.stringify(selectList));
                socialPayAuth().then(() => {
                  handlePay(true);
                });
              }}
            >
              医保移动支付
            </Button>
          )}
          <Button
            block={false}
            type="primary"
            className={classNames(styles.btn, { [styles.btn2]: !medicalPay })}
            onTap={() => {
              storage.set('payment_selectList', JSON.stringify(selectList));
              socialPayAuth().then(() => {
                handlePay(false);
              });
            }}
            loading={payFlag}
            disabled={
              payFlag || selectList.length === 0 || waitOpList.length === 0
            }
          >
            立即缴费
          </Button>
        </Space>
      </Space>
    </View>
  );
};

const ListItem = ({
  onSelectAll,
  selectList,
  item,
  form,
}: {
  onSelectAll: (hisSerilNo: string) => void;
  item: WaitpayType;
  selectList: string[];
  form: FormInstance;
}) => {
  const [folded, setFolded] = useState(true);
  return (
    <Space vertical className={styles.item} alignItems={'stretch'}>
      <Space
        alignItems={'center'}
        onTap={() => {
          navigateTo({
            url: `/pages2/payment/order-item/index?hisOrderNo=${encodeURIComponent(
              item.hisOrderNo,
            )}&deptName=${item.deptName}&doctorName=${
              item.doctorName
            }&patientName=${item.patientName}&patientId=${
              item.patientId && item.patientId !== 'null' ? item.patientId : ''
            }&patCardNo=${item.patCardNo}&date=${item.date}&gender=${
              item.gender || ''
            }&age=${item.age || ''}`,
          });
        }}
      >
        <View className={styles.infoWrap}>
          <View
            className={styles.checkBoxWrap}
            onTap={(event) => {
              event.stopPropagation();
              onSelectAll(item.hisSerilNo);
            }}
          >
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
          </View>
          <Form className={styles.info} form={form}>
            <View
              className={styles.title}
              onTap={(event) => {
                event.stopPropagation();
                onSelectAll(item.hisSerilNo);
              }}
            >
              {item.patientName}
            </View>
            <View className={styles.td}>
              <FormItem
                label={'开单医生'}
                labelWidth={'4em'}
                className={styles.label}
                onTap={(event) => {
                  event.stopPropagation();
                  onSelectAll(item.hisSerilNo);
                }}
              />
              <View>{item.doctorName}</View>
            </View>
            <View className={styles.td}>
              <FormItem
                label="处方号"
                labelWidth={'4em'}
                className={styles.label}
                onTap={(event) => {
                  event.stopPropagation();
                  onSelectAll(item.hisSerilNo);
                }}
              />

              <Exceed className={styles.payName} clamp={1}>
                {item?.hisOrderNo.split('#')[0] || '暂无'}
              </Exceed>
            </View>
            <View className={styles.td}>
              <FormItem
                label="开单时间"
                labelWidth={'4em'}
                className={styles.label}
                onTap={(event) => {
                  event.stopPropagation();
                  onSelectAll(item.hisSerilNo);
                }}
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
      </Space>
      <Space vertical>
        <Space
          className={styles.itemFoot}
          justify={'space-between'}
          alignItems={'center'}
        >
          <Price
            price={+item.totalFee}
            bigScale={1}
            className={styles.footPrice}
          />
          <Space onTap={() => setFolded(!folded)} className={styles.linkBtn}>
            {folded ? '展开' : '收起'}明细
          </Space>
        </Space>
        <Fold folded={folded}>
          <Space vertical className={styles.tableWrap}>
            <Table
              shadow={false}
              dataSource={item.itemList}
              className={styles.table}
              align={'between'}
              columns={[
                { title: '药品名称', dataIndex: 'itemName' },
                { title: '单位', dataIndex: 'itemUnit' },
                { title: '次数', dataIndex: 'itemNum' },
                {
                  title: '单价',
                  dataIndex: 'totalFee',
                  render: (v) => (
                    <Price
                      price={+v}
                      bigScale={1}
                      style={{ fontSize: rpxToPx(26), color: '#333333' }}
                    />
                  ),
                },
              ]}
            />
            <Space justify="space-between" className={styles.tableFooter}>
              <FormItem label={'公卫免费金额'}>
                <Price
                  price={Number(item.medicalFee)}
                  bigScale={1}
                  className={styles.footPrice}
                />
              </FormItem>
              <FormItem label={'合计金额'}>
                <Price
                  price={item.itemList
                    .map(({ totalFee }) => +totalFee)
                    .reduce((v1, v2) => v1 + v2, 0)}
                  bigScale={1}
                  className={styles.footPrice}
                />
              </FormItem>
            </Space>
          </Space>
        </Fold>
      </Space>
    </Space>
  );
};
