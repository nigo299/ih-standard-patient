import React, { memo, useCallback, useEffect, useState } from 'react';
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
import useApi, { HisCardType } from '@/apis/usercenter';
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
import styles from './index.less';
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

export default memo(() => {
  const { pageRoute, patientName, idType, idNo } = useGetParams<{
    pageRoute: string;
    patientName: string;
    idType: string;
    idNo: string;
  }>();
  const { ocrInfo, clearOcrInfo, faceInfo, setFaceInfo, getPatientList } =
    patientState.useContainer();
  const { user, getUserInfo } = globalState.useContainer();
  const { config } = useHisConfig();
  const [addressOptions, setAddressOptions] = useState<CascadePickerOption[]>(
    [],
  );
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
        const options = data?.map((x: HisCardType) => ({
          value: x.patCardNo,
          label: `就诊卡-${x.patCardNo}`,
          patientMobile: decrypt(x?.encryptPatientMobile) || user?.phone || '',
          idNo: x?.idNo,
          address: x.patientAddress || '暂无',
          patientSex: x.patientSex || '',
          parentName: x?.parentName || '',
          parentIdNo: x?.parentIdNo || '',
          birthday: x?.birthday,
          patientAge: x?.patientAge,
        }));
        setCardList(options);
        setSelectCard(options[0]);
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
            values['patientType'] === '1'
              ? values['parentIdNo']
              : values['idNo'];
          const name =
            values['patientType'] === '1'
              ? values['parentName']
              : values['patientName'];
          const birthday =
            values['idType'] === '1'
              ? `${analyzeIDCard(values['idNo']).analyzeBirth} 00:00:00`
              : `${values['birthday']} 00:00:00`;
          if (
            config.enableFaceVerify &&
            bindcardProdiles?.isFace === 1 &&
            !faceInfo.success &&
            faceInfo.idNo !== idNo &&
            faceInfo.name !== name &&
            PLATFORM === 'web'
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
          const { code } = await handleAdd(
            btnSubType === 'bind'
              ? params
              : {
                  ...params,
                  patientAddress: `${values['birthPlace']} ${values['patientAddress']}`,
                  extFields: {
                    profession: values['profession'],
                  },
                },
          );
          if (code === 0) {
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
        }
      }
    },
    [
      alipayUserInfo,
      bindcardProdiles,
      btnSubType,
      config,
      faceInfo,
      form,
      getPatientList,
      handleAdd,
      handleSearch,
      isBrithday,
      pageRoute,
      selectCard,
      setFaceInfo,
      user,
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
    getAddressOptions().then((options) => setAddressOptions(options));
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
    };
  }, [clearCountdownTimer]);

  return (
    <View className={styles.page}>
      <Form form={form} onFinish={(values: any) => handleFormSubmit(values)}>
        <PartTitle
          bold
          action={
            bindcardProdiles?.isOcr === 1 && (
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
        <Form cell labelCls={styles.label} labelWidth={'4em'}>
          <FormItem label="是否有就诊卡" name="checked" initialValue={checked}>
            <Switch onChange={(value) => setChecked(value)} />
          </FormItem>
        </Form>
        <WhiteSpace />
        <Form
          cell
          labelCls={styles.label}
          childrenCls={styles.children}
          labelWidth={'4em'}
          requiredMark={false}
        >
          {!checked && bindcardProdiles?.patientTypes && (
            <FormItem
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
              maxLength={15}
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
                        <TransferChange mode={'city'}>
                          <Picker
                            cols={3}
                            className={styles.picker}
                            data={addressOptions}
                          >
                            请选择省市区
                          </Picker>
                        </TransferChange>
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
                      setSelectCard(current);
                      form.setFieldsValue({
                        patientSex: current.patientSex,
                        patientSexed: PatGender[current.patientSex] || '',
                        birthday: current.birthday,
                        brithdayed: current.birthday,
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

        {(!checked ||
          (selectCard?.idNo &&
            Number(selectCard.patientAge) < bindcardProdiles?.childrenMaxAge) ||
          (!isBrithday && isChild)) && (
          <FormItem noStyle>
            {(_, __, { getFieldValue }) => {
              const parentIdType = getFieldValue('parentIdType') || '1';
              return (
                getFieldValue('patientType')?.[0] === '1' && (
                  <>
                    <PartTitle bold className={styles.partTitle2}>
                      监护人信息
                    </PartTitle>
                    <Form
                      cell
                      childrenCls={styles.children}
                      labelWidth={'4em'}
                      requiredMark={false}
                      labelCls={styles.label}
                    >
                      <FormItem
                        label={'监护人姓名'}
                        name="parentName"
                        rules={[
                          {
                            required: true,
                            message: '请输入2-8位合法监护人姓名',
                            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/,
                          },
                        ]}
                      >
                        <ReInput
                          placeholder="请输入监护人姓名"
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
                            required: true,
                            message: '请选择监护人证件类型',
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
                            required: true,
                            message: '请输入正确的监护人身份证',
                          },
                        ]}
                      >
                        <ReInput
                          maxLength={18}
                          className={styles.reInput}
                          placeholderClassName={styles.placeholder}
                          type="idcard"
                          adjustPosition
                          placeholder={`请输入监护人${
                            bindcardProdiles?.idTypes?.filter(
                              (item) => item?.dictKey === parentIdType,
                            )[0]?.dictValue || '身份证'
                          }号码`}
                        />
                      </FormItem>
                    </Form>
                  </>
                )
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
              {config.recordMedicalCard && (
                <FormItem
                  label={'医保卡号（选填）'}
                  name={'patientMedicalCardNo'}
                  rules={[
                    {
                      type: 'string',
                      message: '请输入正确的医保卡号',
                    },
                  ]}
                >
                  <ReInput
                    className={styles.reInput}
                    placeholderClassName={styles.placeholder}
                    placeholder="请输入医保卡号"
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
