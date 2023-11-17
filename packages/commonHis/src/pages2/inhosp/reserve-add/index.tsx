import React, { memo, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { analyzeIDCard } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace, Tip } from '@/components';
import patientState from '@/stores/patient';
import useApi from '@/apis/usercenter';
import {
  getAddressOptions,
  Button,
  Form,
  FormItem,
  Picker,
  TransferChange,
  ReInput,
  Space,
  Radio,
  ReTextarea,
} from '@kqinfo/ui';
import useApiInhosp from '@/apis/inhosp';
import { AlipayUserInfoType } from '@/stores/global';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';

import { CascadePickerOption } from 'antd-mobile/es/components/cascade-picker/cascade-picker';
import useGetParams from '@/utils/useGetParams';

const initType = {
  patientTypes: [
    { dictKey: '0', dictValue: '一般', sortNo: 1 },
    { dictKey: '1', dictValue: '严重', sortNo: 2 },
  ],
  childrenMaxAge: 14,
  idTypes: [
    { dictValue: '身份证', sortNo: 1, dictKey: '1' },
    { dictValue: '港澳居民来往内地通行证', sortNo: 2, dictKey: '2' },
    { dictValue: '台湾居民来往内地通行证', sortNo: 3, dictKey: '3' },
    { dictValue: '护照', sortNo: 4, dictKey: '4' },
  ],
};
export default memo(() => {
  const {
    defaultPatientInfo: { patCardNo, userId },
  } = patientState.useContainer();
  const { patientName } = useGetParams<{
    patientName: string;
  }>();

  const [addressOptions, setAddressOptions] = useState<CascadePickerOption[]>(
    [],
  );
  const [alipayUserInfo, setAlipayUserInfo] = useState<AlipayUserInfoType>({
    aliPayRealName: '',
    encryptAliPayRealName: '',
    aliPayCertNo: '',
    encryptAliPayCertNo: '',
    aliPayPhone: '',
    encryptAliPayPhone: '',
  });
  const [checked, setChecked] = useState(false);
  const [isCurHis, setIsCurHis] = useState(true); //是否我院产检
  const [hasDanger, setHasDanger] = useState(false); //是否高危

  const [form] = Form.useForm();
  const {
    data: { data: bindcardProdiles },
  } = useApi.获取医院挷卡配置信息({
    initValue: {
      data: {
        patientTypes: [
          { dictKey: '0', dictValue: '一般', sortNo: 1 },
          { dictKey: '1', dictValue: '严重', sortNo: 2 },
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

  const { loading: addLoading } = useApi.建档绑卡({
    needInit: false,
  });
  const handleFormSubmit = useCallback(
    async (values) => {
      console.log(values);

      delete values['checked'];
      values.deptName = values.deptName === '0' ? '妇科病房' : '产科病房';
      values.patCardNo = patCardNo;
      values.userId = userId;
      values.patName = patientName;

      const data: any = await useApiInhosp.住院预约记录新增.request(values);
      console.log(data);

      navigateTo({
        url: `/pages2/inhosp/reserve-success/index?name=${patientName}&dept=${values.deptName}&time=${values.regDate}&carNo=${values.patCardNo}&id=${data?.data}`,
      });
    },
    [patCardNo, patientName, userId],
  );

  usePageEvent('onShow', () => {
    getAddressOptions().then((options) => setAddressOptions(options));
    setNavigationBar({
      title: '住院预约',
    });
  });
  return (
    <View className={styles.page}>
      <Form form={form} onFinish={(values: any) => handleFormSubmit(values)}>
        <Space
          alignItems="center"
          justify="space-between"
          className={styles.PatName}
        >
          <View>{'就诊人'}</View>
          <View>{patientName}</View>
        </Space>
        <WhiteSpace />
        <Form
          cell
          labelCls={styles.label}
          childrenCls={styles.children}
          labelWidth={'4em'}
          requiredMark={false}
        >
          <FormItem
            label={'病情分级'}
            requiredMark
            name="diseaseLevel"
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
              data={initType.patientTypes?.map((item) => ({
                label: item?.dictValue,
                value: item?.dictKey,
              }))}
            >
              请选择
            </Picker>
          </FormItem>
          <FormItem
            label={'预约科室'}
            requiredMark
            name="deptName"
            initialValue={'0'}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group
              style={{ display: 'flex', justifyContent: 'flex-end' }}
              onChange={() => {
                setChecked(!checked);
              }}
            >
              <Radio value="0">妇科病房</Radio>
              <Radio value="1">产科病房</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={'预约入院日期'}
            requiredMark
            name="regDate"
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
            <Picker mode={'date'} start={dayjs().format('YYYY-MM-DD')}>
              请选择住院日期
            </Picker>
          </FormItem>
        </Form>

        <WhiteSpace />
        <Form
          cell
          labelWidth={'4em'}
          labelCls={styles.label}
          childrenCls={styles.children}
          requiredMark={false}
        >
          <FormItem shouldUpdate noStyle>
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {(_, __, { getFieldValue }) => {
              return (
                <>
                  <FormItem
                    label={'患者户籍地'}
                    requiredMark
                    name={'residenceAddress'}
                    rules={[{ required: true }]}
                    initialValue={'重庆市-市辖区-沙坪坝区'}
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
                        请选择地址
                      </Picker>
                    </TransferChange>
                  </FormItem>
                  <FormItem
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

        <WhiteSpace />
        <Form
          cell
          labelWidth={'4em'}
          labelCls={styles.label}
          requiredMark={false}
        >
          {checked && (
            <>
              <FormItem
                label={'预产期'}
                requiredMark
                name="expectedDate"
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
                <Picker mode={'date'} start={dayjs().format('YYYY-MM-DD')}>
                  请选择预产期
                </Picker>
              </FormItem>
              <FormItem
                label={'是否我院产检'}
                requiredMark
                name="examInOurHos"
                initialValue={'1'}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                  onChange={() => {
                    setIsCurHis(!isCurHis);
                  }}
                >
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </FormItem>
              {!isCurHis && (
                <FormItem
                  label={'高危因素'}
                  requiredMark
                  name="isHighRisk"
                  initialValue={'NO'}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Radio.Group
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    onChange={() => {
                      setHasDanger(!hasDanger);
                    }}
                  >
                    <Radio value="NO">无</Radio>
                    <Radio value="YES">有</Radio>
                  </Radio.Group>
                </FormItem>
              )}
              {hasDanger && (
                <FormItem
                  name={'highRisk'}
                  childrenAlign="left"
                  rules={[
                    {
                      required: true,
                      message: '高危因素不能为空',
                    },
                  ]}
                >
                  <ReTextarea
                    placeholder="请输入高危因素"
                    className={styles.ReTextarea}
                    placeholderClassName={styles.placeholder}
                    adjustPosition
                  />
                </FormItem>
              )}
            </>
          )}
          {!checked && (
            <>
              <FormItem
                label={'症状'}
                requiredMark
                name={'symptom'}
                rules={[
                  {
                    type: 'string',
                    required: true,
                    message: '请输入症状',
                  },
                ]}
              >
                <ReInput
                  className={styles.reInput}
                  placeholderClassName={styles.placeholder}
                  placeholder="请输入症状"
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
                />
              </FormItem>
              <FormItem label={'辅助检查结果'} readOnly />
              <FormItem
                name={'examResult'}
                childrenAlign="left"
                rules={[
                  {
                    required: true,
                    message: '辅助检查结果不能为空',
                  },
                ]}
              >
                <ReTextarea
                  placeholder="请输入辅助检查结果"
                  className={styles.ReTextarea}
                  placeholderClassName={styles.placeholder}
                  adjustPosition
                />
              </FormItem>
            </>
          )}
          <FormItem
            label="紧急联系人"
            name="emergencyContact"
            requiredMark
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
              placeholder="请输入姓名"
              type="text"
              maxLength={15}
              className={styles.reInput}
              placeholderClassName={styles.placeholder}
            />
          </FormItem>
          <FormItem
            label="与患者关系"
            name="relation"
            requiredMark
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
              placeholder="请输入关系"
              type="text"
              maxLength={15}
              className={styles.reInput}
              placeholderClassName={styles.placeholder}
            />
          </FormItem>
          <FormItem
            label={'联系人证件类型'}
            name="documentType"
            requiredMark
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
              data={initType.idTypes?.map((item) => ({
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
                    label="证件号"
                    name="certificateNo"
                    initialValue=""
                    rules={[
                      {
                        type: 'idCard',
                        required: true,
                        message: '请输入正确的身份证',
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
          <FormItem
            label={'联系电话'}
            requiredMark
            name={'phone'}
            rules={[
              {
                type: 'phone',
                required: true,
                message: '请输入正确的手机号',
              },
            ]}
          >
            <ReInput
              className={styles.reInput}
              placeholderClassName={styles.placeholder}
              placeholder="请输入联系电话"
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
            />
          </FormItem>
        </Form>
        <WhiteSpace />
        <Tip
          className={styles.tip}
          items={[
            <View key={'add-tip'} className={styles.tipText}>
              请仔细核对相关信息，正确填写联系方式并保持畅通，无法接收信息则后果自负
            </View>,
          ]}
        />

        <Button
          type="primary"
          onTap={() => {
            form.submit();
          }}
          loading={addLoading}
          disabled={addLoading}
        >
          提交住院预约信息
        </Button>
      </Form>
    </View>
  );
});
