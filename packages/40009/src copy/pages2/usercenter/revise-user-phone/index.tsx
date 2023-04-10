import React, { useCallback, useEffect } from 'react';
import { View, navigateBack } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Button,
  TransferChange,
  ReInput,
  Space,
  Form,
  FormItem,
  PartTitle,
  showToast,
} from '@kqinfo/ui';
import { useDownCount } from 'parsec-hooks';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/usercenter';
import { checkPhoneForm } from '@/utils';

export default () => {
  const { patientId } = useGetParams<{ patientId: string }>();
  const [form] = Form.useForm();
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
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
      title: '修改手机号',
    });
  });
  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  return (
    <View className={styles.page}>
      <PartTitle bold>修改手机号</PartTitle>
      <View className={styles.content}>
        <Form
          form={form}
          cell
          labelWidth="4em"
          requiredMark={false}
          className={styles.label}
          onFinish={(values: any) =>
            useApi.修改就诊人详情
              .request({
                patientId,
                patientMobile: values['patientMobile'],
                verifyCode: values['verifyCode'],
              })
              .then((res) => {
                if (res.code === 0) {
                  showToast({
                    icon: 'success',
                    title: '修改成功!',
                  }).then(() => navigateBack());
                }
              })
          }
        >
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
              placeholder="请输入手机号码"
              type="digit"
              maxLength={11}
              adjustPosition
              className={styles.reInput}
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
                    placeholder="请输入验证码"
                    className={styles.reInput}
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
        <Button
          type="primary"
          bold
          className={styles.button}
          onTap={form.submit}
        >
          提交
        </Button>
      </View>
    </View>
  );
};
