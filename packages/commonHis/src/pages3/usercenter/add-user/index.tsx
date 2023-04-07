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
  PartTitle,
  getAddressOptions,
  showToast,
} from '@kqinfo/ui';
import { checkPhoneForm, analyzeIDCard, reLaunchUrl } from '@/utils';
import useApi from '@/apis/usercenter';
import { useDownCount } from 'parsec-hooks';
import { WhiteSpace } from '@/components';
import patientState from '@/stores/patient';
import useGetParams from '@/utils/useGetParams';
import { CascadePickerOption } from 'antd-mobile/es/components/cascade-picker/cascade-picker';
import styles from './index.less';
import { getHisConfig } from '@/config/his';

export default () => {
  /** 0成人 1儿童 */
  const { patientType, jumpPage = 'back' } = useGetParams<{
    patientType: '0' | '1';
    jumpPage: string;
  }>();
  const { config } = getHisConfig();
  const { getPatientList } = patientState.useContainer();
  const [addressOptions, setAddressOptions] = useState<CascadePickerOption[]>(
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

  const { request: handleAdd, loading: addLoading } = useApi.建档绑卡({
    needInit: false,
  });
  const handleFormSubmit = useCallback(
    async (values: any) => {
      const checkCodeData = await useApi.验证短信验证码.request({
        phone: values['patientMobile'],
        verifyCode: values['verifyCode'],
      });
      if (checkCodeData.code === 0) {
        const { code, msg } = await handleAdd({
          ...values,
          yibaoNo: '',
          patientType,
          birthday:
            patientType === '1'
              ? `${values['birthday']} 00:00:00`
              : `${analyzeIDCard(values['idNo']).analyzeBirth} 00:00:00`,
          patCardType: 21,
          isNewCard: 0,
        });
        if (code === 0) {
          getPatientList();
          showToast({
            title: msg || '绑定成功',
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
        }
      }
    },
    [getPatientList, handleAdd, jumpPage, patientType],
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
    getAddressOptions().then((options) => setAddressOptions(options));
    setNavigationBar({
      title: '添加就诊人',
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
          <PartTitle
            full
            bold
            className={styles.partTitle}
            action={
              <Button
                className={styles.btn}
                block={false}
                onTap={() =>
                  showToast({
                    title: '暂未开放!',
                  })
                }
              >
                点击上传证件
              </Button>
            }
          >
            就诊人信息
          </PartTitle>

          <View className={styles.wrap}>
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
                <ReInput placeholder="请输入姓名" type="text" />
              </FormItem>

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
                  data={bindcardProdiles?.idTypes?.map((item) => ({
                    label: item.dictValue,
                    value: item.dictKey,
                  }))}
                  className={styles.picker}
                >
                  显示
                </Picker>
              </FormItem>
              <FormItem
                label="证件号"
                name="idNo"
                rules={[
                  {
                    type: 'idCard',
                    required: true,
                    message: `请输入正确的${
                      patientType === '0' ? '成人' : '儿童'
                    }身份证`,
                  },
                ]}
              >
                <ReInput
                  placeholder="请输入证件号"
                  maxLength={18}
                  type="idcard"
                  adjustPosition
                />
              </FormItem>
              {patientType === '1' && (
                <>
                  <FormItem
                    label={'性别'}
                    name="sex"
                    initialValue={'M'}
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
                      data={[
                        { label: '男', value: 'M' },
                        { label: '女', value: 'F' },
                      ]}
                      className={styles.picker}
                    >
                      请选择
                    </Picker>
                  </FormItem>

                  <FormItem
                    label={'出生日期'}
                    name="birthday"
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
                    <Picker mode={'date'} className={styles.picker}>
                      请选择出生日期
                    </Picker>
                  </FormItem>

                  <FormItem
                    label={'地区'}
                    name={'birthPlace'}
                    initialValue={config.defaultAddress}
                    rules={[{ required: true }]}
                    after={
                      <Icon
                        name={'kq-down'}
                        color={'#CBCCCB'}
                        size={36}
                        className={styles.icon}
                      />
                    }
                  >
                    <TransferChange mode={'city'}>
                      <Picker
                        cols={3}
                        data={addressOptions}
                        className={styles.picker}
                      >
                        请选择省市区
                      </Picker>
                    </TransferChange>
                  </FormItem>
                  <FormItem
                    label={'住址'}
                    name={'patientAddress'}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <ReInput placeholder="请输入详细地址" adjustPosition />
                  </FormItem>
                </>
              )}
            </Form>

            {patientType === '0' && (
              <>
                <WhiteSpace />
                <Form cell labelWidth={'4em'} childrenAlign={'left'}>
                  <FormItem
                    label={'地区'}
                    name={'birthPlace'}
                    initialValue={config.defaultAddress}
                    rules={[{ required: true }]}
                    after={
                      <Icon
                        name={'kq-down'}
                        color={'#CBCCCB'}
                        size={36}
                        className={styles.icon}
                      />
                    }
                  >
                    <TransferChange mode={'city'}>
                      <Picker cols={3} data={addressOptions}>
                        请选择省市区
                      </Picker>
                    </TransferChange>
                  </FormItem>
                  <FormItem
                    label={'住址'}
                    name={'patientAddress'}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <ReInput placeholder="请输入详细地址" adjustPosition />
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
                            disabled={countdown > 0}
                            block={false}
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
              </>
            )}
          </View>

          {patientType === '1' && (
            <>
              <PartTitle
                full
                bold
                className={styles.partTitle}
                action={
                  <Button
                    className={styles.btn}
                    block={false}
                    onTap={() =>
                      showToast({
                        title: '暂未开放!',
                      })
                    }
                  >
                    点击上传证件
                  </Button>
                }
              >
                监护人信息
              </PartTitle>
              <View className={styles.wrap}>
                <Form cell labelWidth={'4em'} childrenAlign={'left'}>
                  <FormItem
                    label="姓名"
                    name="parentName"
                    rules={[
                      {
                        required: true,
                        message: '请输入2-8位合法监护人姓名',
                        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/,
                      },
                    ]}
                  >
                    <ReInput placeholder="请输入监护人姓名" type="text" />
                  </FormItem>

                  <FormItem
                    label={'证件类型'}
                    name="parentIdType"
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
                    name={'parentIdNo'}
                    rules={[
                      {
                        type: 'idCard',
                        required: true,
                        message: '请输入正确的监护人身份证',
                      },
                    ]}
                  >
                    <ReInput
                      placeholder="请输入监护人证件号"
                      maxLength={18}
                      type="idcard"
                      adjustPosition
                    />
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
                            disabled={countdown > 0}
                            block={false}
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
              </View>
            </>
          )}
          <View className={styles.submitBtn}>
            <Button
              type="primary"
              elderly
              onTap={() => {
                form.submit();
              }}
              loading={addLoading}
              disabled={addLoading}
            >
              完成提交
            </Button>
          </View>
        </Form>
      </View>
    </ConfigProvider>
  );
};
