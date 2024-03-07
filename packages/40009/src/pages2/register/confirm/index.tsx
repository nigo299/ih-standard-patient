import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { View, navigateTo, Text, reLaunch, navigateBack } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import {
  decrypt,
  getCurrentPageUrl,
  getPatientAge,
  isYuKangJianH5,
  sleep,
} from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  WhiteSpace,
  ListItem,
  Tip,
  NucleicQrcode,
  AntForest,
  RegisterNotice,
  Dialog,
} from '@/components';
import {
  Shadow,
  PartTitle,
  Button,
  Space,
  showToast,
  Platform,
} from '@kqinfo/ui';
import showModal from '@/utils/showModal';
import classNames from 'classnames';
import useApi from '@/apis/register';
import usePayApi from '@/apis/pay';
import usePatientApi from '@/apis/usercenter';
import { returnUrl } from '@/utils';
import { PLATFORM, PAY_TYPE, NUCLEIC_INVESTIGATION } from '@/config/constant';
import dayjs from 'dayjs';
import { useDownCount, useEffectState } from 'parsec-hooks';
import useGetParams from '@/utils/useGetParams';
import storage from '@/utils/storage';
import monitor from '@/alipaylog/monitor';
import socialPayAuth from '@/utils/socialPayAuth';
import { useUpdateEffect } from 'ahooks';
import payState, { OrderInfoType } from '@/stores/pay';
import patientState from '@/stores/patient';
import styles from 'commonHis/src/pages2/register/confirm/index.less';
import useNucleicJump from '@/utils/useNucleicJump';
import useCommonApi from '@/apis/common';
import { PatGender } from '@/config/dict';
import { consultationPeriod } from '@/pages2/register/confirm/utils';

export default () => {
  const {
    deptId,
    doctorId,
    scheduleDate,
    scheduleId,
    visitBeginTime,
    visitEndTime,
    visitPeriod,
    sourceType,
    title,
    level,
    doctorName,
  } = useGetParams<{
    deptId: string;
    doctorId: string;
    title: string;
    level: string;
    sourceType: string;
    doctorName: string;
    scheduleDate: string;
    scheduleId: string;
    visitBeginTime: string;
    visitEndTime: string;
    visitPeriod: string;
  }>();
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const { getPatientList } = patientState.useContainer();
  const [show, setShow] = useState(false);
  const [payFlag, setPayFlag] = useState(false);
  const { data: hospitialConfigData } = usePatientApi.获取医院挷卡配置信息({
    needInit: true,
  });
  const {
    data: { data: infoData },
  } = useCommonApi.注意事项内容查询({
    params: {
      noticeType: 'GHXY',
      noticeMethod: 'WBK',
    },
    needInit: true,
  });
  const {
    request,
    data: { data: confirmInfo },
  } = useApi.锁号信息确认({
    params: {
      deptId,
      doctorId,
      sourceType,
      title,
      level,
      doctorName,
      scheduleDate,
      scheduleId,
      visitBeginTime,
      visitEndTime,
      visitPeriod,
    },
    needInit: false,
  });

  const { setOrderInfo } = payState.useContainer();
  const hospitalData = [
    {
      label: '就诊医院',
      text: confirmInfo?.hisName,
    },
    {
      label: '就诊科室',
      text: confirmInfo?.deptName,
    },
    {
      label: '就诊医生',
      text: confirmInfo?.doctorName,
    },
    {
      label: '医生职称',
      text: confirmInfo?.doctorTitle,
    },
    {
      label: consultationPeriod,
      text: `${scheduleDate} ${visitBeginTime}-${visitEndTime}`,
    },
  ];

  const medicalPay = useMemo(() => {
    return (
      hospitialConfigData?.data?.medicalPay?.indexOf('WeChat') > -1 ||
      hospitialConfigData?.data?.medicalPay?.indexOf('Alipay') > -1
    );
  }, [hospitialConfigData?.data?.medicalPay]);
  console.log(medicalPay, 'medicalPay');
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const countRef = useRef(0);
  const [selectedPatient, setSelectedPatient] = useEffectState(
    confirmInfo?.patientList.filter((item) => item.isDefault === 1)[0],
  );
  const { jumpNucleic, nucleicJumpParams } = useNucleicJump({
    patientId: selectedPatient?.patientId,
  });
  const patientData = [
    {
      label: '挂号费用',
      text: (
        <Text style={{ color: '#D95E38' }}>
          {`¥ ${((confirmInfo?.totalFee || 0) / 100).toFixed(2)}`}
        </Text>
      ),
    },
    {
      label: '就诊号',
      text: selectedPatient?.patHisNo || '-',
    },
    {
      label: '患者姓名',
      // text: selectedPatient?.patientName || '-',
      text: selectedPatient?.patientName
        ? `${selectedPatient?.patientName} | ${
            PatGender[selectedPatient?.patientSex] || ''
          } | ${getPatientAge(selectedPatient?.patientAge)}`
        : '-',
    },
  ];

  const clearTimer = useCallback(() => {
    setShow(false);
    countRef.current = 0;
    clearCountdownTimer();
  }, [clearCountdownTimer]);
  const getPatientQuestionnaire = useCallback(async () => {
    await sleep(3000);
    if (countRef.current > 0) {
      const resultData = await useApi.查询是否填写问卷.request({
        patientId: selectedPatient?.patientId,
      });
      if (resultData?.data?.length !== 0) {
        clearTimer();
        handleRegisterConfim();
      } else {
        getPatientQuestionnaire();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearTimer, selectedPatient?.patientId]);
  const handleRegisterConfim = useCallback(
    async (payAuthNo?: string) => {
      if (process.env.REMAX_APP_PLATFORM === 'app') {
        if (storage.get('idNo') !== decrypt(selectedPatient?.encryptIdNo)) {
          showToast({
            icon: 'fail',
            title: '请使用本人医保身份信息进行支付!',
          });
          return;
        }
      } else {
        // 没有注册不允许挂号
        if (!storage.get('openid') && !isYuKangJianH5()) {
          console.log('getCurrentPageUrl ', getCurrentPageUrl());
          showToast({
            icon: 'fail',
            title: '抱歉，请进行注册再进行挂号!',
          }).then(() => {
            storage.set('jumpUrl', getCurrentPageUrl());
            navigateTo({
              url: '/pages/auth/login/index',
            });
          });
          return;
        }
        // 核酸问卷调查判断
        if (NUCLEIC_INVESTIGATION) {
          if (PLATFORM === 'ali') {
            // if (!storage.get(`${selectedPatient.patientId}`)) {
            //   navigateToMiniProgram({
            //     appId: NUCLEIC_APPID,
            //     path: `/pages/index/index?${nucleicJumpParams}`,
            //     success: () => {
            //       storage.set(`${selectedPatient.patientId}`, 'true');
            //       const defaultPatient = confirmInfo?.patientList?.filter(
            //         (item) => item.patientId === selectedPatient.patientId,
            //       )[0];
            //       if (defaultPatient.isDefault !== 1) {
            //         usePatientApi.设置默认就诊人.request({
            //           patientId: selectedPatient.patientId,
            //         });
            //       }
            //     },
            //     fail: () =>
            //       showToast({
            //         title: '跳转小程序失败，请重试!',
            //       }),
            //   });
            //   return;
            // }
            const resultData = await useApi.查询是否填写流调问卷.request({
              userId: selectedPatient?.patientId,
              formId: '4',
            });
            if (
              !resultData?.data ||
              dayjs(resultData.data.createTime).format('YYYY-MM-DD') !==
                dayjs().format('YYYY-MM-DD')
            ) {
              jumpNucleic().then(() => {
                const defaultPatient = confirmInfo?.patientList?.filter(
                  (item) => item.patientId === selectedPatient?.patientId,
                )[0];
                if (defaultPatient.isDefault !== 1) {
                  usePatientApi.设置默认就诊人.request({
                    patientId: selectedPatient?.patientId,
                  });
                }
              });
              return;
            }
          } else {
            const resultData = await useApi.查询是否填写问卷.request({
              patientId: selectedPatient?.patientId,
            });
            if (resultData?.data?.length === 0) {
              // 没填写问卷
              if (PLATFORM === 'web') {
                setShow(true);
                getPatientQuestionnaire();
                setCountdown(180).then(() => {
                  clearTimer();
                });
              } else if (PLATFORM === 'wechat') {
                showModal({
                  title: '提示',
                  content:
                    '遵照有关部门疫情防控要求，需要您填写一份流行病调查登记，感谢您的配合！',
                }).then(({ confirm }) => {
                  if (confirm) {
                    jumpNucleic();
                  }
                });
              }
              return;
            }
          }
        }
      }
      setPayFlag(true);
      try {
        const { code, data, msg } = await useApi.锁号.request({
          deptId,
          doctorId,
          scheduleDate,
          scheduleId,
          visitBeginTime,
          visitEndTime,
          visitPeriod,
          patientId: selectedPatient?.patientId,
          sourceType,
          title,
          level,
          doctorName,
          medinsureChannel:
            PLATFORM === 'ali'
              ? 3
              : process.env.REMAX_APP_PLATFORM === 'app'
              ? 1
              : 2,
        });
        if (code === 0 && data.orderId) {
          const orderDetail = await useApi.查询挂号订单详情.request({
            orderId: data.orderId,
          });
          monitor.api({
            api: '预约挂号',
            success: true,
            c1: 'taSR_YL',
            time: 200,
          });
          const isTody = scheduleDate === dayjs().format('YYYY-MM-DD');
          // 0元支付
          if (Number(orderDetail?.data?.totalFee) === 0) {
            const url = PAY_TYPE[isTody ? 'DBGH' : 'YYGH'].detail;
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
          const orderInfo: OrderInfoType = {
            bizType: isTody ? 'DBGH' : 'YYGH',
            hisName: confirmInfo?.hisName,
            deptName: confirmInfo?.deptName,
            doctorName: confirmInfo?.doctorName,
            // patientName: selectedPatient?.patientName,
            patientName: `${selectedPatient?.patientName} | ${
              PatGender[selectedPatient?.patientSex] || ''
            } | ${getPatientAge(selectedPatient?.patientAge)}`,
            patCardNo: selectedPatient?.patHisNo,
            patientFullIdNo: decrypt(selectedPatient?.encryptIdNo),
            registerTime: `${scheduleDate} ${visitBeginTime}-${visitEndTime}`,
            totalFee: confirmInfo?.totalFee,
            orderId: data.orderId,
            payOrderId: data.payOrderId,
            extFields: data?.extFields || '',
          };
          if (process.env.REMAX_APP_PLATFORM === 'app') {
            // 线上医保App
            const result = await useApi.医保下单.request({
              orderId: data.orderId,
              payOrderId: data.payOrderId,
              uniqueCode: isTody ? 13 : 10,
              totalFee: 0,
              selfFee: 0,
              payAuthNo: payAuthNo || '',
              ocToken: '',
              insuCode: '',
              extFields: JSON.stringify(data?.extFields),
            });
            if (result.code === 0 && result.data) {
              storage.set('orderId', data.orderId);
              storage.set('bizType', isTody ? 'DBGH' : 'YYGH');
              window.location.href = result.data;
            } else {
              window.location.href = window.location.href.split('&encData')[0];
            }
          } else if (PLATFORM === 'web') {
            if (!isYuKangJianH5()) {
              // H5公众号 支付逻辑
              const result = await usePayApi.h5支付下单.request({
                orderId: data.payOrderId,
                callbackUrl: `${returnUrl()}#/pages/waiting/index?bizType=${
                  isTody ? 'DBGH' : 'YYGH'
                }&orderId=${data.orderId}`,
              });
              if (result.code === 0 && result.data) {
                // if (medicalPay) {
                setOrderInfo({ ...orderInfo, h5PayUrl: result?.data });
                navigateTo({
                  url: `/pages/pay/index?mode=medical`,
                });
                return;
                // } else {
                //   window.location.href = result.data;
                // }
              }
            } else {
              // 小程序收银台
              setOrderInfo(orderInfo);
              navigateTo({
                url: '/pages/pay/index',
              });
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
          monitor.api({
            api: '预约挂号',
            success: false,
            c1: 'taSR_YL',
            time: 200,
          });
          showToast({
            icon: 'none',
            title: msg || '下单失败，请重试!',
          }).then(() => {
            if (msg?.includes('您有此科室医生待付费挂号记录,请付费')) {
              navigateTo({
                url: '/pages2/register/order-list/index',
              });
            }
          });
        }
        setPayFlag(false);
      } catch (err) {
        console.log('err', err);
        setPayFlag(false);
      }
    },
    [
      clearTimer,
      confirmInfo,
      deptId,
      doctorId,
      doctorName,
      getPatientQuestionnaire,
      jumpNucleic,
      level,
      medicalPay,
      scheduleDate,
      scheduleId,
      selectedPatient,
      setCountdown,
      setOrderInfo,
      sourceType,
      title,
      visitBeginTime,
      visitEndTime,
      visitPeriod,
    ],
  );
  const registerConfirm = useCallback(() => {
    // 0元支付
    if (Number(confirmInfo?.totalFee) === 0) {
      handleRegisterConfim();
    } else {
      socialPayAuth().then(() => {
        handleRegisterConfim();
      });
    }
  }, [confirmInfo, handleRegisterConfim]);
  useUpdateEffect(() => {
    if (process.env.REMAX_APP_PLATFORM === 'app') {
      const href = window.location.href;
      if (href.includes('encData=') && selectedPatient?.patientName) {
        socialPayAuth(href).then((res) => {
          handleRegisterConfim(res?.payAuthNo);
        });
      }
    }
  }, [selectedPatient]);
  usePageEvent('onShow', () => {
    if (!storage.get('login_access_token')) {
      // 走到挂号确认信息没授权的话需要跳转授权
      getPatientList();
      return;
    }

    if (deptId && visitBeginTime && visitEndTime) {
      request().then((res) => {
        if (res?.msg?.includes('号源信息不存在')) {
          showModal({
            content:
              '当前号源信息不存在，点击确定前往缴费记录继续支付，点击取消重新选择号源!',
          }).then(({ confirm }) => {
            if (confirm) {
              navigateTo({
                url: '/pages2/register/order-list/index',
              });
            } else {
              navigateBack();
            }
          });
        }
      });
    }
    setNavigationBar({
      title: '确认信息',
    });
  });
  const getDeptName = (str: string) => {
    let result = '口腔科门诊';
    const startIndex = str?.indexOf('（') + 1;
    const endIndex = str?.indexOf('）');
    if (startIndex !== -1 && endIndex !== -1) {
      result = str?.substring(startIndex, endIndex);
    }
    return result + '门诊部';
  };
  useEffect(() => {
    if (confirmInfo?.deptName?.includes('口腔科门诊')) {
      setVisible1(true);
    }
  }, [confirmInfo]);
  usePageEvent('onHide', () => {
    clearTimer();
    setPayFlag(false);
  });
  useEffect(() => {
    countRef.current = countdown;
  }, [countdown]);
  return (
    <View className={styles.page}>
      <PartTitle>请确认挂号信息</PartTitle>
      <WhiteSpace />
      <Shadow card>
        <Space vertical>
          {hospitalData.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </Space>
      </Shadow>
      <WhiteSpace />
      <Shadow card>
        <Space vertical>
          {patientData.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
          <Space className={styles.patients} size={22} ignoreNum={5}>
            {confirmInfo?.patientList?.map((item, index) => (
              <Space
                justify="center"
                alignItems="center"
                key={index}
                className={classNames(styles.patient, {
                  [styles.patientSelect]:
                    item?.patientId === selectedPatient?.patientId,
                  [styles.patientNative]: PLATFORM !== 'web',
                })}
                onTap={() => {
                  if (medicalPay) {
                    showToast({
                      icon: 'none',
                      duration: 1000,
                      title: '非本人暂不支持医保在线支付',
                    }).then(() => {
                      setSelectedPatient(item);
                    });
                  } else {
                    setSelectedPatient(item);
                  }
                }}
              >
                {item.patientName}
              </Space>
            ))}
            {confirmInfo?.patientList?.length < 5 && (
              <Space
                alignItems="center"
                justify="center"
                className={classNames(styles.patient, styles.add)}
                onTap={() => {
                  navigateTo({
                    url: '/pages2/usercenter/add-user/index',
                  });
                }}
              >
                +新增
              </Space>
            )}
          </Space>
        </Space>
      </Shadow>
      <WhiteSpace />
      <Tip
        className={styles.tip}
        items={[
          <View className={styles.tipText} key="confirm-text">
            {/* <View>
              1、本系统目前仅支持
              <Text style={{ color: '#D95E38' }}>自费</Text>用户
            </View> */}
            {/* <View>
              1、本系统目前支持
              <Text style={{ color: '#D95E38' }}>自费、医保</Text>
              用户，非本人暂不支持医保在线支付
            </View> */}
            <View>
              请在预约挂号成功后
              <Text style={{ color: '#D95E38' }}>5分钟内</Text>
              完成支付，超出时间后 系统将做退号处理
            </View>
            {/* <View style={{ color: '#D95E38' }}>
              3、疫情期间，所有来院人员均须填写来院信息表方可入院，为减少现场等待时间，请在支付完成后点击【完成】按钮，根据提示前往填写
            </View> */}
          </View>,
        ]}
      />
      <Platform platform={['ali']}>
        <AntForest />
      </Platform>
      <Button
        type="primary"
        className={classNames(styles.button, {
          [styles.buttonAli]: PLATFORM === 'ali',
        })}
        onTap={() => {
          if (infoData?.[0]?.noticeInfo) {
            setVisible(true);
          } else {
            registerConfirm();
          }
        }}
        loading={payFlag}
        disabled={!selectedPatient?.patientName || payFlag}
      >
        确定预约
      </Button>

      <NucleicQrcode
        show={show}
        close={() => clearTimer()}
        nucleicJumpParams={nucleicJumpParams}
      />
      <RegisterNotice
        show={visible}
        close={() => setVisible(false)}
        content={infoData?.[0]?.noticeInfo || ''}
        confirm={() => {
          registerConfirm();
        }}
      />
      <Dialog
        hideFail
        show={visible1}
        title={'温馨提示'}
        successText={'我知道了'}
        onSuccess={() => setVisible1(false)}
      >
        <Text style={{ lineHeight: 1.2, padding: 20 }}>
          您当前选择的号源就诊地点在
          <Text>{getDeptName(confirmInfo?.deptName)}</Text>
          ，不在松山院本部，请注意就诊地点的变化
        </Text>
      </Dialog>
    </View>
  );
};
