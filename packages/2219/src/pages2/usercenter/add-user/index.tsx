import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View, navigateTo, navigateBack, Image, redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import {
  analyzeIDCard,
  checkPhoneForm,
  decrypt,
  getAgeByBirthDay,
  parseAge,
} from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace } from '@/components';
import useApi, { AddressItem, HisCardType } from '@/apis/usercenter';
import {
  getAddressOptions,
  ColorText,
  Switch,
  Button,
  Form,
  FormItem,
  Picker,
  TransferChange,
  ReInput,
  Space,
  PartTitle,
  showToast,
  Platform,
} from '@kqinfo/ui';
import patientState from '@/stores/patient';
import globalState, { AlipayUserInfoType } from '@/stores/global';
import { useDownCount } from 'parsec-hooks';
import styles from '@/pages2/usercenter/add-user/index.less';
import classNames from 'classnames';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import storage from '@/utils/storage';
import { useUpdateEffect } from 'ahooks';
import reportCmPV from '@/alipaylog/reportCmPV';
import dayjs from 'dayjs';
import { CascadePickerOption } from 'antd-mobile/es/components/cascade-picker/cascade-picker';
import useGetParams from '@/utils/useGetParams';
import { useHisConfig } from '@/hooks';
import { PatGender } from '@/config/dict';
import TipContent from '@/pages2/usercenter/add-user/components/tipContent';

interface CardType {
  birthday: string;
  patientSex: string;
  label: string;
  value: string;
  patientMobile: string;
  idNo?: string;
  address: string;
  parentName: string;
  parentIdNo: string;
  patientAge: string;
}
const deepTree = (data: AddressItem[]) => {
  return (data || []).map((item: any) => {
    const obj: any = {
      label: item?.name || '',
      value: item?.code || '',
      children: item?.children,
    };
    if (obj.children && obj.children.length !== 0) {
      obj.children = deepTree(obj.children);
    }
    return obj;
  });
};
export default memo(() => {
  const { pageRoute, patientName, idType, idNo } = useGetParams<{
    pageRoute: string;
    patientName: string;
    idType: string;
    idNo: string;
  }>();
  const {
    ocrInfo,
    clearOcrInfo,
    faceInfo,
    setFaceInfo,
    getPatientList,
    needGuardian,
    setNeedGuardian,
  } = patientState.useContainer();
  const { user, getUserInfo } = globalState.useContainer();
  const { config } = useHisConfig();
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const [alipayUserInfo, setAlipayUserInfo] = useState<AlipayUserInfoType>({
    aliPayRealName: '',
    encryptAliPayRealName: '',
    aliPayCertNo: '',
    encryptAliPayCertNo: '',
    aliPayPhone: '',
    encryptAliPayPhone: '',
  });
  const [checked, setChecked] = useState(true);
  // 非身份建档his有可能返回出生日期为空、需要用户手动选择出生日期
  const [isBrithday, setIsBrithday] = useState(true);
  // 当查询出来的出生日期为空时，动态获取当前是否是儿童
  const [isChild, setIsChild] = useState(false);
  const [defaulted, setDefaulted] = useState(false);
  const [btnSubType, setBtnSubType] = useState<'add' | 'bind' | 'search'>(
    'search',
  );
  const [cardList, setCardList] = useState<CardType[]>([]);
  const [selectCard, setSelectCard] = useState<CardType>({
    label: '',
    value: '',
    patientMobile: '',
    idNo: '',
    address: '',
    parentName: '',
    parentIdNo: '',
    birthday: '',
    patientSex: '',
    patientAge: '',
  });
  const [form] = Form.useForm();
  //地址相关代码
  const [addressTownList, setAddressTownList] = useState<CascadePickerOption[]>(
    [],
  );
  const { data: addressListData } = useApi.查询地区省市区县地区数据({
    needInit: true,
  });
  const { request: getAddressData } = useApi.根据父级查询子级地区数据({
    needInit: false,
  });
  const addressList = useMemo(() => {
    if (addressListData?.data?.length) {
      return deepTree(addressListData.data);
    }
    return [];
  }, [addressListData]);
  useEffect(() => {
    getAddressData({
      pCode: 500103000000,
    }).then((res) => {
      if (res?.data?.length) {
        setAddressTownList(
          res.data.map((item: { name: any; code: any }) => {
            return {
              label: item.name,
              value: item.code,
            };
          }),
        );
      }
    });
  }, []);
  const {
    data: { data: bindcardProdiles },
  } = useApi.获取医院挷卡配置信息({
    initValue: {
      data: {
        patientTypes: [
          { dictKey: '0', dictValue: '成人', sortNo: 1 },
          { dictKey: '1', dictValue: '儿童', sortNo: 2 },
        ],
        childrenMaxAge: 14,
        idTypes: [
          { dictValue: '身份证', sortNo: 1, dictKey: '1' },
          { dictValue: '港澳居民来往内地通行证', sortNo: 2, dictKey: '2' },
          { dictValue: '台湾居民来往内地通行证', sortNo: 3, dictKey: '3' },
          { dictValue: '护照', sortNo: 4, dictKey: '4' },
        ],
      },
    },
  });

  const { request: handleSearch, loading: searchLoading } =
    useApi.查询就诊人绑定卡号({
      needInit: false,
    });
  const { request: handleAdd, loading: addLoading } = useApi.建档绑卡({
    needInit: false,
  });
  const guardianName = useMemo(() => {
    if (needGuardian) {
      return '代理人';
    }
    return '监护人';
  }, [needGuardian]);
  const handleFormSubmit = useCallback(
    async (values: any) => {
      delete values['checked'];
      values['isDefault'] = values['isDefault'] === true ? 1 : 0;
      if (alipayUserInfo.aliPayCertNo) {
        values['idNo'] = alipayUserInfo.aliPayCertNo;
        values['patientName'] = alipayUserInfo.aliPayRealName;
        values['patientMobile'] = alipayUserInfo.aliPayPhone;
      }
      if (btnSubType === 'search') {
        const { data } = await handleSearch(values);
        if (data?.length === 0) {
          showToast({
            icon: 'none',
            title: '无建档信息，请建档',
          });

          if (values['idType'] === '1') {
            setChecked(false);
            const { analyzeAge, analyzeBirth, analyzeSex } = analyzeIDCard(
              values['idNo'],
            );
            if (analyzeAge >= bindcardProdiles?.childrenMaxAge) {
              form.setFieldsValue({
                checked: false,
              });
            } else {
              setIsChild(true);
              form.setFieldsValue({
                checked: false,
                birthday: analyzeBirth,
                patientSex: analyzeSex,
                patientType: '1',
              });
            }
          } else {
            setChecked(false);
            form.setFieldsValue({
              checked: false,
            });
          }
          return;
        }
        const options = data?.map((x: HisCardType) => {
          let cardTypes = '就诊卡';
          if (x?.patCardType === 1) {
            cardTypes = '院内就诊卡';
          } else if (x?.patCardType === 3) {
            cardTypes = '医保卡';
          } else if (x?.patCardType === 5) {
            cardTypes = '身份证 ';
          } else if (x?.patCardType === 6) {
            cardTypes = '虚拟卡';
          }

          return {
            value: x.patCardNo,
            label: `${cardTypes}-${x.patCardNo}`,
            patientMobile:
              decrypt(x?.encryptPatientMobile) || user?.phone || '',
            idNo: x?.idNo,
            address: x.patientAddress || '暂无',
            patientSex: x.patientSex || '',
            parentName: x?.parentName || '',
            parentIdNo: x?.parentIdNo || '',
            birthday: x?.birthday,
            patientAge: x?.patientAge,
          };
        });
        setCardList(options);
        setSelectCard(options[0]);
        console.log('options', options);
        if (options.length !== 0) {
          setTimeout(() => {
            form.setFieldsValue({
              patCardNo: options[0]?.value,
              patientMobile: options[0]?.patientMobile,
            });
            setAlipayUserInfo({
              ...alipayUserInfo,
              aliPayPhone: options[0]?.patientMobile,
            });
            console.log('options', options, dayjs().format('YYYY-MM-DD'));
            if (options[0]?.idNo) {
              if (
                dayjs().format('YYYY-MM-DD') ===
                options[0]?.birthday?.slice(0, 10)
              ) {
                setIsBrithday(false);
              }
              form.setFieldsValue({
                patientSexed: PatGender[options[0]?.patientSex] || '',
                patientSex: options[0]?.patientSex,
                brithdayed: options[0]?.birthday?.slice(0, 10),
                addressed: options[0]?.address,
              });
              if (
                Number(options[0]?.patientAge) <
                bindcardProdiles?.childrenMaxAge
              ) {
                setIsChild(true);
                if (!data[0].parentName) {
                  form.setFieldsValue({
                    patientType: '1',
                  });
                } else {
                  form.setFieldsValue({
                    parentName: options[0]?.parentName,
                    parentIdNo: options[0]?.parentIdNo,
                  });
                }
              }
            }
          }, 50);
        }
        return;
      }
      if (btnSubType === 'add' || btnSubType === 'bind') {
        console.log('valuesadd', values);
        /** 这几个字段均为查询就诊人展示作用 */
        delete values['brithdayed'];
        delete values['patientSexed'];
        delete values['addressed'];
        delete values['profession'];
        let checkPhoneFlag = true;
        // 如果注册用户和建档用户手机号码相同不校验验证码
        if (values['patientMobile'] !== user.phone) {
          const checkCodeData = await useApi.验证短信验证码.request({
            phone: values['patientMobile'],
            verifyCode: values['verifyCode'],
          });
          if (checkCodeData.code !== 0) {
            checkPhoneFlag = false;
          }
        }

        if (checkPhoneFlag) {
          // 判断成人儿童表单需要识别的身份信息
          const idNo =
            values['patientType'] === '1' ||
            (needGuardian && values['parentName']) ||
            isChild
              ? values['parentIdNo']
              : values['idNo'];
          const name =
            values['patientType'] === '1' ||
            (needGuardian && values['parentName']) ||
            isChild
              ? values['parentName']
              : values['patientName'];
          const birthday =
            values['idType'] === '1'
              ? `${analyzeIDCard(values['idNo']).analyzeBirth} 00:00:00`
              : `${values['birthday']} 00:00:00`;
          if (
            values['idType'] === '1' &&
            config.enableFaceVerify &&
            PLATFORM === 'web' &&
            bindcardProdiles?.isFace === 1 &&
            !faceInfo.success &&
            faceInfo.idNo !== idNo &&
            faceInfo.name !== name
          ) {
            setFaceInfo({
              idNo,
              name,
              success: false,
            });
            navigateTo({
              url: '/pages2/usercenter/face-verify/index',
            });
            return;
          }
          let patientAge =
            btnSubType === 'add'
              ? analyzeIDCard(values['idNo']).analyzeAge
              : selectCard.patientAge;

          const submitBirthDay =
            btnSubType === 'add' || !isBrithday
              ? birthday
              : selectCard.birthday;
          if (!patientAge && submitBirthDay) {
            patientAge = getAgeByBirthDay(submitBirthDay) || 0;
          }

          const submitPatientSex =
            btnSubType === 'add'
              ? values['patientSex']
              : selectCard.patientSex || values['patientSex'];

          const addressValueList = values['birthPlace'];
          if (addressValueList?.length && addressValueList?.[2]) {
            values['provinceCode'] = addressValueList[0];
            values['cityCode'] = addressValueList[1];
            values['countryCode'] = addressValueList[2];
            const addressProvince = addressList.find(
              (item) => item.value === addressValueList[0],
            );
            const addressCity = (addressProvince?.children || [])?.find(
              (item: CascadePickerOption) => item.value === addressValueList[1],
            );
            const addressCounty = (addressCity?.children || [])?.find(
              (item: CascadePickerOption) => item.value === addressValueList[2],
            );
            const addressTown = addressTownList?.find(
              (item: CascadePickerOption) =>
                item.value === values['streetCode'],
            );
            values['birthPlace'] = `${addressProvince?.label || ''}${
              addressCity?.label || ''
            }${addressCounty?.label || ''}${addressTown?.label || ''}`;
          }
          const params = {
            ...values,
            yibaoNo: '',
            patCardType: 21,
            birthday: submitBirthDay,
            patientSex: submitPatientSex,
            isNewCard: btnSubType === 'add' ? 1 : 0,
            patientType: values['patientType']
              ? values['patientType']
              : parseAge(patientAge.toString()) >=
                bindcardProdiles?.childrenMaxAge
              ? '0'
              : '1',
          };

          handleAdd(
            btnSubType === 'bind'
              ? params
              : {
                  ...params,
                  patientAddress: `${values['birthPlace']} ${values['patientAddress']}`,
                  extFields: {
                    profession: values['profession'],
                  },
                },
          ).then((res) => {
            if (res.code === 0) {
              showToast({
                title: btnSubType === 'add' ? '建档成功' : '绑定成功',
                icon: 'success',
              }).then(() => {
                if (pageRoute) {
                  getPatientList().then((res) => {
                    const patient = res.filter(
                      (item) => item.patientFullIdNo === values['idNo'],
                    )[0];
                    const url = `${pageRoute}?patientId=${patient?.patientId}&patCardNo=${patient.patCardNo}&patHisNo=${patient.patHisNo}`;
                    redirectTo({
                      url,
                    });
                  });
                } else {
                  navigateBack();
                }

                setFaceInfo({
                  idNo: '',
                  name: '',
                  success: false,
                });
              });
            }
          });
        }
      }
    },
    [
      alipayUserInfo,
      bindcardProdiles?.childrenMaxAge,
      bindcardProdiles?.isFace,
      btnSubType,
      config.enableFaceVerify,
      faceInfo?.idNo,
      faceInfo?.name,
      faceInfo?.success,
      form,
      getPatientList,
      handleAdd,
      handleSearch,
      isBrithday,
      needGuardian,
      ocrInfo.num,
      pageRoute,
      selectCard,
      setFaceInfo,
      user.phone,
    ],
  );

  const getPhoneCode = useCallback(async () => {
    const phone = form.getFieldValue('patientMobile');
    if (!checkPhoneForm(phone)) {
      showToast({
        icon: 'none',
        title: '请输入正确的手机号',
      });
      return;
    }
    const { code } = await useApi.发送短信验证码.request({
      phone,
    });
    if (code === 0) {
      setCountdown(120);
    }
  }, [form, setCountdown]);
  useUpdateEffect(() => {
    // 默认使用注册手机号码建档(自动填充验证码)
    if (user?.phone && !form.getFieldValue('patientMobile')) {
      form.setFieldsValue({
        patientMobile: user?.phone,
        parentName: ocrInfo?.name,
      });
      setAlipayUserInfo({
        ...alipayUserInfo,
        aliPayPhone: user?.phone,
      });
    }
  }, [user]);

  useEffect(() => {
    if (patientName) {
      setBtnSubType('search');
      form.setFieldsValue({
        idType: idType || '1',
        patientName: decodeURIComponent(patientName),
        idNo: idNo || '',
      });
      form.submit();
    }
  }, [form, idNo, idType, patientName]);

  usePageEvent('onShow', (query) => {
    reportCmPV({ title: '在线建档', query });
    if (!storage.get('openid') && process.env.REMAX_APP_PLATFORM !== 'app') {
      storage.set('jumpUrl', window.location.href?.split('#')?.[1]);
      navigateTo({
        url: '/pages/auth/login/index', //?callback=1
      });
      return;
    }
    storage.del('jumpUrl');
    getUserInfo();
    const { type, num } = ocrInfo;
    if (num) {
      if (type === 'adult' || type === 'children') {
        form.setFieldsValue({
          patientName: ocrInfo.name,
          idNo: ocrInfo.num,
        });
      } else {
        form.setFieldsValue({
          parentName: ocrInfo.name,
          parentIdNo: ocrInfo.num,
        });
      }
    }
    if (faceInfo.success && faceInfo.idNo) {
      handleFormSubmit(form.getFieldsValue());
    }
    setNavigationBar({
      title: '添加就诊人',
    });
  });
  usePageEvent('onHide', () => {
    clearOcrInfo();
  });
  useEffect(() => {
    return () => {
      clearCountdownTimer();
      setNeedGuardian(false);
    };
  }, [clearCountdownTimer, setNeedGuardian]);

  return (
    <View className={styles.page}>
      <Form form={form} onFinish={(values: any) => handleFormSubmit(values)}>
        <PartTitle
          bold
          action={
            bindcardProdiles?.isOcr === 1 &&
            PLATFORM === 'web' && (
              <Button
                type="primary"
                onTap={() =>
                  navigateTo({
                    url: `/pages2/usercenter/ocr-recognition/index?type=${
                      form?.getFieldValue('patientType') === '1'
                        ? 'parent'
                        : 'children'
                    }`,
                  })
                }
                className={styles.partBtn}
                ghost
              >
                上传证件
              </Button>
            )
          }
        >
          就诊人信息
        </PartTitle>
        <WhiteSpace />
        {/* <Form cell labelCls={styles.label} labelWidth={'4em'}>
          <FormItem label="是否有就诊卡" name="checked" initialValue={checked}>
            <Switch onChange={(value) => setChecked(value)} />
          </FormItem>
        </Form> */}
        <WhiteSpace />
        <Form
          cell
          labelCls={styles.label}
          childrenCls={styles.children}
          labelWidth={'4em'}
          requiredMark={false}
        >
          {bindcardProdiles?.patientTypes && (
            <FormItem
              className={classNames({
                [styles.hideItem]: checked,
              })}
              label={'就诊人类型'}
              name="patientType"
              initialValue={'0'}
              after={
                <Image
                  src={`${IMAGE_DOMIN}/usercenter/down.png`}
                  className={styles.icon}
                />
              }
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Picker
                cols={1}
                className={styles.picker}
                data={bindcardProdiles?.patientTypes?.map((item) => ({
                  label: item?.dictValue,
                  value: item?.dictKey,
                }))}
                onChange={(value) => {
                  if (value === '1') {
                    setIsChild(true);
                  }
                }}
              >
                请选择
              </Picker>
            </FormItem>
          )}

          <FormItem
            label="姓名"
            name="patientName"
            rules={[
              {
                required: true,
                type: 'string',
                // pattern: !alipayUserInfo.encryptAliPayRealName
                //   ? /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/
                //   : /.{2,8}$/,
              },
            ]}
          >
            <ReInput
              placeholder="请输入真实姓名"
              type="text"
              maxLength={30}
              className={styles.reInput}
              placeholderClassName={styles.placeholder}
            />
          </FormItem>
          <FormItem
            label={'证件类型'}
            name="idType"
            initialValue={'1'}
            after={
              <Image
                src={`${IMAGE_DOMIN}/usercenter/down.png`}
                className={styles.icon}
              />
            }
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Picker
              cols={1}
              className={styles.picker}
              data={bindcardProdiles?.idTypes?.map((item) => ({
                label: item?.dictValue,
                value: item?.dictKey,
              }))}
            >
              请选择
            </Picker>
          </FormItem>
          <FormItem shouldUpdate noStyle>
            {(_, __, { getFieldValue }) => {
              const patientType = getFieldValue('patientType');
              const idType = getFieldValue('idType');

              return (
                <>
                  <FormItem
                    // label="证件号"
                    childrenAlign="left"
                    name="idNo"
                    initialValue=""
                    rules={[
                      {
                        type:
                          !alipayUserInfo.encryptAliPayCertNo && idType === '1'
                            ? 'idCard'
                            : 'string',
                        required: true,
                        message:
                          checked || patientType === '0'
                            ? '请输入正确的身份证'
                            : '请输入正确的儿童身份证',
                      },
                    ]}
                  >
                    <ReInput
                      placeholder={`请输入${
                        bindcardProdiles?.idTypes?.filter(
                          (item) => item?.dictKey === idType,
                        )[0]?.dictValue || '身份证'
                      }号码`}
                      maxLength={18}
                      className={styles.reInput}
                      placeholderClassName={styles.placeholder}
                      type="idcard"
                      adjustPosition
                      onChange={(value) => {
                        // 自动提升大写
                        if (form.getFieldValue('idType') === '1') {
                          form.setFieldsValue({
                            idNo: value?.toUpperCase(),
                          });
                        }
                        if (value?.length === 18 && patientType === '1') {
                          form.setFieldsValue({
                            birthday: analyzeIDCard(value).analyzeBirth,
                            patientSex: analyzeIDCard(value).analyzeSex,
                          });
                        }
                      }}
                    />
                  </FormItem>
                </>
              );
            }}
          </FormItem>
        </Form>

        {!checked && (
          <>
            <WhiteSpace />
            <Form
              cell
              labelWidth={'4em'}
              labelCls={styles.label}
              childrenCls={styles.children}
              requiredMark={false}
            >
              <FormItem shouldUpdate noStyle>
                {(_, __, { getFieldValue }) => {
                  const patientType = getFieldValue('patientType');
                  const idType = getFieldValue('idType');
                  return (
                    <>
                      {(patientType === '1' || idType !== '1') && (
                        <>
                          <FormItem
                            label={'出生日期'}
                            name="birthday"
                            after={
                              <Image
                                src={`${IMAGE_DOMIN}/usercenter/down.png`}
                                className={styles.icon}
                              />
                            }
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Picker
                              mode={'date'}
                              start={dayjs().format('1900-01-01')}
                              end={dayjs().format('YYYY-MM-DD')}
                            >
                              请选择
                            </Picker>
                          </FormItem>

                          <FormItem
                            label={'性别'}
                            name="patientSex"
                            after={
                              <Image
                                src={`${IMAGE_DOMIN}/usercenter/down.png`}
                                className={styles.icon}
                              />
                            }
                            rules={[
                              {
                                required: true,
                              },
                            ]}
                          >
                            <Picker
                              cols={1}
                              data={[
                                { label: '男', value: 'M' },
                                { label: '女', value: 'F' },
                              ]}
                            >
                              请选择
                            </Picker>
                          </FormItem>
                        </>
                      )}

                      {/* <FormItem
                        label={'职业类型'}
                        name={'profession'}
                        rules={[{ required: true }]}
                        after={
                          <Image
                            src={`${IMAGE_DOMIN}/usercenter/down.png`}
                            className={styles.icon}
                          />
                        }
                      >
                        <Picker
                          cols={1}
                          data={[
                            { value: '17', label: '职员' },
                            { value: '11', label: '国家公务员' },
                            { value: '13', label: '专业技术人员' },
                            { value: '21', label: '企业管理人员' },
                            { value: '24', label: '工人' },
                            { value: '27', label: '农民' },
                            { value: '31', label: '学生' },
                            { value: '37', label: '现役军人' },
                            { value: '51', label: '自由职业者' },
                            { value: '54', label: '个体经营者' },
                            { value: '70', label: '无业人员' },
                            { value: '80', label: '退(离)休人员' },
                            { value: '90', label: '其他' },
                          ]}
                        >
                          请选择职业类型
                        </Picker>
                      </FormItem> */}

                      <FormItem
                        label={'地址'}
                        name={'birthPlace'}
                        initialValue={config.defaultAddress}
                        rules={[{ required: true }]}
                        after={
                          <Image
                            src={`${IMAGE_DOMIN}/usercenter/down.png`}
                            className={styles.icon}
                          />
                        }
                      >
                        <Picker
                          cols={3}
                          className={styles.picker}
                          data={addressList}
                          onChange={(value) => {
                            if (Array.isArray(value)) {
                              const keyList =
                                (value || [])?.filter(Boolean) || [];
                              if (keyList?.length === 3) {
                                getAddressData({
                                  pCode: keyList[2],
                                }).then((res) => {
                                  if (res?.data?.length) {
                                    form.setFieldValue(
                                      'addressTown',
                                      undefined,
                                    );
                                    setAddressTownList(
                                      res.data.map(
                                        (item: {
                                          name: string;
                                          code: string;
                                        }) => {
                                          return {
                                            label: item.name,
                                            value: item.code,
                                          };
                                        },
                                      ),
                                    );
                                  }
                                });
                              }
                            }
                          }}
                        >
                          请选择省市区
                        </Picker>
                      </FormItem>
                      <FormItem
                        label={'乡镇'}
                        name={'streetCode'}
                        rules={[{ required: true }]}
                        after={
                          <Image
                            src={`${IMAGE_DOMIN}/usercenter/down.png`}
                            className={styles.icon}
                          />
                        }
                      >
                        <Picker
                          className={styles.picker}
                          data={addressTownList}
                        >
                          请选择街道
                        </Picker>
                      </FormItem>
                      <FormItem
                        // label={'详细地址'}
                        name={'patientAddress'}
                        childrenAlign="left"
                        rules={[
                          {
                            required: true,
                            message: '详细地址不能为空',
                          },
                        ]}
                      >
                        <ReInput
                          placeholder="请输入详细地址"
                          className={styles.reInput}
                          placeholderClassName={styles.placeholder}
                          adjustPosition
                        />
                      </FormItem>
                    </>
                  );
                }}
              </FormItem>
            </Form>
          </>
        )}

        {checked && cardList.length !== 0 && (
          <>
            <WhiteSpace />
            <Form
              cell
              labelWidth={'4em'}
              labelCls={styles.label}
              childrenCls={styles.children}
              requiredMark={false}
            >
              {isBrithday ? (
                <FormItem label={'出生日期'} name="brithdayed">
                  <ReInput
                    type="text"
                    className={classNames(styles.reInput, styles.disabled)}
                    placeholderClassName={styles.placeholder}
                  />
                </FormItem>
              ) : (
                <FormItem
                  label={'出生日期'}
                  name="birthday"
                  after={
                    <Image
                      src={`${IMAGE_DOMIN}/usercenter/down.png`}
                      className={styles.icon}
                    />
                  }
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Picker
                    mode={'date'}
                    start={dayjs().format('1900-01-01')}
                    end={dayjs().format('YYYY-MM-DD')}
                    onChange={(birthday: any) => {
                      const age = getAgeByBirthDay(birthday);
                      if (age === undefined || !bindcardProdiles) {
                        return;
                      }
                      const innerIsChild =
                        age < bindcardProdiles.childrenMaxAge;
                      setIsChild(innerIsChild);
                      form.setFieldsValue({
                        patientType: innerIsChild ? '1' : '0',
                      });
                    }}
                  >
                    请选择
                  </Picker>
                </FormItem>
              )}

              {selectCard?.patientSex ? (
                <FormItem label={'性别'} name="patientSexed">
                  <ReInput
                    type="text"
                    className={classNames(styles.reInput, styles.disabled)}
                    placeholderClassName={styles.placeholder}
                  />
                </FormItem>
              ) : (
                <FormItem
                  label={'性别'}
                  name="patientSex"
                  after={
                    <Image
                      src={`${IMAGE_DOMIN}/usercenter/down.png`}
                      className={styles.icon}
                    />
                  }
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Picker
                    cols={1}
                    data={[
                      { label: '男', value: 'M' },
                      { label: '女', value: 'F' },
                    ]}
                  >
                    请选择
                  </Picker>
                </FormItem>
              )}

              <FormItem
                label={'选择就诊卡'}
                name="patCardNo"
                after={
                  <Image
                    src={`${IMAGE_DOMIN}/usercenter/down.png`}
                    className={styles.icon}
                  />
                }
                rules={[
                  {
                    required: true,
                    message: '请选择就诊卡',
                  },
                ]}
              >
                <Picker
                  cols={1}
                  className={styles.picker}
                  data={cardList}
                  onChange={(v) => {
                    const current = cardList.filter(
                      (item) => item.value === v,
                    )[0];
                    if (current?.idNo) {
                      console.log('current', current);
                      setSelectCard(current);
                      form.setFieldsValue({
                        patientSex: current.patientSex,
                        patientSexed: PatGender[current.patientSex] || '',
                        birthday: dayjs(current.birthday).format('YYYY-MM-DD'),
                        brithdayed: dayjs(current.birthday).format(
                          'YYYY-MM-DD',
                        ),
                        addressed: current.address,
                        parentName: current?.parentName || '',
                        parentIdNo: current?.parentIdNo || '',
                      });
                    }
                  }}
                >
                  请选择
                </Picker>
              </FormItem>
              <FormItem label={'地址'} name="addressed">
                <ReInput
                  type="text"
                  className={classNames(styles.reInput, styles.disabled)}
                  placeholderClassName={styles.placeholder}
                />
              </FormItem>
            </Form>
          </>
        )}

        {((selectCard?.idNo &&
          Number(selectCard.patientAge) < bindcardProdiles?.childrenMaxAge) ||
          isChild ||
          needGuardian) && (
          <FormItem noStyle>
            {(_, __, { getFieldValue }) => {
              const parentIdType = getFieldValue('parentIdType') || '1';
              return (
                <>
                  <PartTitle bold className={styles.partTitle2}>
                    {`${guardianName}信息`}
                  </PartTitle>
                  <Form
                    cell
                    childrenCls={styles.children}
                    labelWidth={'4em'}
                    requiredMark={false}
                    labelCls={styles.label}
                  >
                    <FormItem
                      label={`${guardianName}姓名`}
                      name="parentName"
                      rules={[
                        {
                          required: !needGuardian,
                          message: `请输入2-8位合法${guardianName}姓名`,
                          pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/,
                        },
                      ]}
                    >
                      <ReInput
                        placeholder={`请输入${guardianName}姓名`}
                        type="text"
                        className={styles.reInput}
                        placeholderClassName={styles.placeholder}
                        adjustPosition
                      />
                    </FormItem>
                    <FormItem
                      label={'证件类型'}
                      name="parentIdType"
                      initialValue={'1'}
                      after={
                        <Image
                          src={`${IMAGE_DOMIN}/usercenter/down.png`}
                          className={styles.icon}
                        />
                      }
                      rules={[
                        {
                          required: !needGuardian,
                          message: `请选择${guardianName}证件类型`,
                        },
                      ]}
                    >
                      <Picker
                        cols={1}
                        className={styles.picker}
                        data={bindcardProdiles?.idTypes?.map((item) => ({
                          label: item?.dictValue,
                          value: item?.dictKey,
                        }))}
                      >
                        请选择
                      </Picker>
                    </FormItem>
                    <FormItem
                      name={'parentIdNo'}
                      childrenAlign="left"
                      rules={[
                        {
                          type: parentIdType === '1' ? 'idCard' : 'string',
                          required: !needGuardian,
                          message: `请输入正确的${guardianName}证件号码`,
                        },
                      ]}
                    >
                      <ReInput
                        maxLength={18}
                        className={styles.reInput}
                        placeholderClassName={styles.placeholder}
                        type="idcard"
                        adjustPosition
                        placeholder={`请输入${guardianName}${
                          bindcardProdiles?.idTypes?.filter(
                            (item) => item?.dictKey === parentIdType,
                          )[0]?.dictValue || '身份证'
                        }号码`}
                      />
                    </FormItem>
                  </Form>
                </>
              );
            }}
          </FormItem>
        )}

        {((checked && cardList.length !== 0) || !checked) && (
          <>
            <WhiteSpace />
            <Form
              cell
              labelWidth={'4em'}
              labelCls={styles.label}
              requiredMark={false}
            >
              <FormItem
                label={'手机号'}
                name={'patientMobile'}
                rules={[
                  {
                    type: !alipayUserInfo.encryptAliPayPhone
                      ? 'phone'
                      : 'string',
                    required: true,
                    message: '请输入正确的手机号',
                  },
                ]}
              >
                <ReInput
                  className={styles.reInput}
                  placeholderClassName={styles.placeholder}
                  placeholder="请输入手机号"
                  type="digit"
                  maxLength={11}
                  adjustPosition
                  onChange={(v) =>
                    v &&
                    setAlipayUserInfo({
                      ...alipayUserInfo,
                      aliPayPhone: v,
                    })
                  }
                  disabled={
                    checked &&
                    cardList.length !== 0 &&
                    !form.getFieldsValue(['patientMobile'])
                  }
                  /** 查询绑定就诊人手机号不可更改 */
                  // disabled={checked && cardList.length !== 0}
                />
              </FormItem>
              <FormItem noStyle>
                {(_, __, { getFieldValue }) => {
                  if (
                    (getFieldValue('patientMobile') &&
                      alipayUserInfo.aliPayPhone) !== user.phone
                  ) {
                    return (
                      <FormItem
                        label={'验证码'}
                        name={'verifyCode'}
                        rules={[
                          {
                            required: true,
                            message: '请输入正确的验证码',
                          },
                        ]}
                      >
                        <TransferChange>
                          {(onChange, value) => (
                            <Space alignItems="center">
                              <ReInput
                                onChange={onChange}
                                value={value}
                                className={styles.reInput}
                                placeholderClassName={styles.placeholder}
                                placeholder="请输入验证码"
                                maxLength={6}
                                type="idcard"
                                adjustPosition
                              />
                              <Button
                                type={'primary'}
                                size={'action'}
                                disabled={countdown > 0}
                                className={styles.getCodeBtn}
                                onTap={getPhoneCode}
                              >
                                {countdown > 0 ? countdown : '获取验证码'}
                              </Button>
                            </Space>
                          )}
                        </TransferChange>
                      </FormItem>
                    );
                  }
                }}
              </FormItem>
              {config.recordMedicalCard && !checked && (
                <FormItem
                  label={<View>医保卡号(选填)</View>}
                  name={'patientMedicalCardNo'}
                  rules={[
                    {
                      type: 'string',
                      message: '请输入正确的医保卡号',
                    },
                  ]}
                  vertical
                >
                  <ReInput
                    className={styles.reInput}
                    placeholderClassName={styles.placeholder}
                    placeholder="请输入医保卡号(如:A66******66)"
                    type="text"
                    maxLength={11}
                    adjustPosition
                  />
                </FormItem>
              )}
            </Form>
          </>
        )}

        <WhiteSpace />
        <Form cell labelCls={styles.label} labelWidth={'4em'}>
          <FormItem
            label={<ColorText>设为默认就诊人</ColorText>}
            name="isDefault"
            initialValue={defaulted}
          >
            <Switch onChange={(value) => setDefaulted(value)} />
          </FormItem>
        </Form>

        <TipContent />
        {checked && cardList.length === 0 && (
          <Button
            type="primary"
            onTap={() => {
              setBtnSubType('search');
              form.submit();
            }}
            loading={searchLoading}
            disabled={searchLoading}
          >
            立即查询
          </Button>
        )}
        {checked && cardList.length >= 1 && (
          <Button
            type="primary"
            onTap={() => {
              setBtnSubType('bind');
              form.submit();
            }}
            loading={addLoading}
            disabled={addLoading}
          >
            立即绑定
          </Button>
        )}
        {!checked && (
          <Button
            type="primary"
            onTap={() => {
              setBtnSubType('add');
              form.submit();
            }}
            loading={addLoading}
            disabled={addLoading}
          >
            立即建档
          </Button>
        )}
        {cardList.length === 0 && storage.get('alipayUserInfo') && (
          <Platform platform={['ali']}>
            <WhiteSpace />
            <Button
              type="primary"
              ghost
              onTap={() => {
                const data = storage.get('alipayUserInfo');
                if (data) {
                  const alipayUserInfoData = JSON.parse(
                    data,
                  ) as AlipayUserInfoType;
                  const {
                    encryptAliPayRealName,
                    encryptAliPayCertNo,
                    encryptAliPayPhone,
                  } = alipayUserInfoData;
                  form.setFieldsValue({
                    idNo: encryptAliPayCertNo,
                    patientName: encryptAliPayRealName,
                    patientMobile: encryptAliPayPhone,
                  });
                  setAlipayUserInfo(alipayUserInfoData);
                }
              }}
            >
              使用本人证件信息
            </Button>
          </Platform>
        )}
      </Form>
    </View>
  );
});
