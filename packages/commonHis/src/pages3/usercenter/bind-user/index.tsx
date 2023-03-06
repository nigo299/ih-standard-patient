import React, { useCallback, useState, useEffect } from 'react';
import { View, navigateBack } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Space,
  Button,
  Form,
  FormItem,
  ReInput,
  Icon,
  Picker,
  TransferChange,
  ConfigProvider,
  showToast,
} from '@kqinfo/ui';
import { checkPhoneForm, reLaunchUrl } from '@/utils';
import useApi, { HisCardType } from '@/apis/usercenter';
import { useDownCount } from 'parsec-hooks';
import { WhiteSpace } from '@/components';
import patientState from '@/stores/patient';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { jumpPage = 'back' } = useGetParams<{ jumpPage: string }>();
  const { getPatientList } = patientState.useContainer();
  const [cardList, setCardList] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [form] = Form.useForm();
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const {
    data: { data: bindcardProdiles },
  } = useApi.获取医院挷卡配置信息({
    initValue: {
      data: {
        patientTypes: [
          { dictKey: '0', dictValue: '成人', sortNo: 1 },
          { dictKey: '1', dictValue: '儿童', sortNo: 2 },
        ],
        idTypes: [
          { dictKey: '1', dictValue: '身份证', sortNo: 0 },
          { dictKey: '3', dictValue: '护照', sortNo: 2 },
          { dictKey: '6', dictValue: '香港身份证', sortNo: 5 },
          { dictKey: '7', dictValue: '澳门身份证', sortNo: 6 },
          { dictKey: '8', dictValue: '台湾身份证', sortNo: 7 },
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
  const [btnSubType, setBtnSubType] = useState<'bind' | 'search'>('search');
  const handleFormSubmit = useCallback(
    async (values: any) => {
      delete values['checked'];
      if (btnSubType === 'search') {
        const { data } = await handleSearch(values);
        if (data?.length === 0) {
          showToast({
            icon: 'none',
            title: '无建档信息，请建档',
          });
          return;
        }
        const options = data?.map((x: HisCardType) => ({
          value: x.patCardNo,
          label: x.patCardNo,
          patientMobile: JSON.parse(x.patientName)?.patMobile,
        }));
        setCardList(options);
        if (options.length !== 0) {
          setTimeout(() => {
            form.setFieldsValue({
              patCardNo: options[0].value,
              patientMobile: options[0].patientMobile,
            });
          }, 50);
        }
        return;
      }
      if (btnSubType === 'bind') {
        const checkCodeData = await useApi.验证短信验证码.request({
          phone: values['patientMobile'],
          verifyCode: values['verifyCode'],
        });
        if (checkCodeData.code === 0) {
          const { code } = await handleAdd({
            ...values,
            yibaoNo: '',
            patCardType: 21,
            isNewCard: 0,
          });
          if (code === 0) {
            showToast({
              title: '绑定成功',
              icon: 'success',
            }).then(() => {
              if (jumpPage === 'home') {
                reLaunchUrl('/pages3/home/index');
              } else if (jumpPage === 'back') {
                navigateBack();
              } else {
                reLaunchUrl(decodeURIComponent(jumpPage));
              }
            });
            getPatientList();
          }
        }
      }
    },
    [btnSubType, form, getPatientList, handleAdd, handleSearch, jumpPage],
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
      phone: form.getFieldValue('patientMobile'),
    });
    if (code === 0) {
      setCountdown(120);
    }
  }, [form, setCountdown]);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '绑定就诊卡',
    });
  });

  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  return (
    <ConfigProvider elderly>
      <View className={styles.page}>
        <Form form={form} onFinish={(values: any) => handleFormSubmit(values)}>
          <Form cell labelWidth={'4em'} childrenAlign={'left'}>
            <FormItem
              label="姓名"
              name="patientName"
              rules={[
                {
                  required: true,
                  pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/,
                },
              ]}
            >
              <ReInput placeholder="请输入就诊人姓名" type="text" />
            </FormItem>
          </Form>
          <WhiteSpace />
          <Form cell labelWidth={'4em'} childrenAlign={'left'}>
            <FormItem
              label={'证件类型'}
              name="idType"
              initialValue={'1'}
              after={
                <Icon
                  name={'kq-down'}
                  color={'#CBCCCB'}
                  size={36}
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
                data={bindcardProdiles?.idTypes?.map((item) => ({
                  label: item.dictValue,
                  value: item.dictKey,
                }))}
                className={styles.picker}
              >
                请选择证件类型
              </Picker>
            </FormItem>
            <FormItem
              label="证件号"
              name="idNo"
              rules={[
                {
                  type: 'idCard',
                  required: true,
                  message: '请输入正确的身份证',
                },
              ]}
            >
              <ReInput
                placeholder="请输入证件号码"
                maxLength={18}
                type="idcard"
                adjustPosition
              />
            </FormItem>
          </Form>
          <WhiteSpace />
          {cardList.length !== 0 && (
            <Form cell labelWidth={'4em'} childrenAlign={'left'}>
              <FormItem
                label={'就诊卡号'}
                name="patCardNo"
                after={
                  <Icon
                    name={'kq-down'}
                    color={'#CBCCCB'}
                    size={36}
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
                <Picker cols={1} data={cardList} className={styles.picker}>
                  请选择就诊卡号
                </Picker>
              </FormItem>
              <FormItem
                label={'手机号'}
                name={'patientMobile'}
                rules={[
                  {
                    type: 'phone',
                    required: true,
                    message: '请输入正确的手机号码',
                  },
                ]}
              >
                <ReInput
                  placeholder="常用手机号码"
                  type="idcard"
                  maxLength={11}
                  adjustPosition
                />
              </FormItem>
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
                        placeholder="验证码"
                        maxLength={6}
                        adjustPosition
                      />
                      <Button
                        type={'primary'}
                        block={false}
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
            </Form>
          )}
          <WhiteSpace />

          <View className={styles.footer}>
            <View className={styles.tip}>
              本院实行实名制就诊，请如实填写就诊人信息
            </View>

            {cardList.length === 0 && (
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
            {cardList.length >= 1 && (
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
          </View>
        </Form>
      </View>
    </ConfigProvider>
  );
};
