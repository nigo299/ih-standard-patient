import React, { useCallback, useEffect } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Button,
  FormItem,
  PartTitle,
  Space,
  Form,
  TransferChange,
  ReInput,
} from '@kqinfo/ui';
import { useDownCount } from 'parsec-hooks';
import useApi from '@/apis/login';
import globalState from '@/stores/global';
import { encryptPhone } from '@/utils';
import styles from './index.less';

export default () => {
  const [form] = Form.useForm();
  const { user } = globalState.useContainer();
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const getPhoneCode = useCallback(async () => {
    const phone = user?.phone;
    if (phone) {
      const { code } = await useApi.修改用户手机号的验证码.request({
        phone,
      });
      if (code === 0) {
        setCountdown(60);
      }
    }
  }, [setCountdown, user?.phone]);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '绑定手机',
    });
  });
  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  return (
    <View>
      <Space alignItems="center" className={styles.tip}>
        {`第一步：验证当前绑定的手机号，当前已绑定${
          user?.phone && encryptPhone(user.phone)
        }`}
      </Space>
      <View className={styles.content}>
        <Form
          form={form}
          cell
          className={styles.form}
          onFinish={(values: any) => {
            if (user?.phone) {
              useApi.验证手机号和验证码
                .request({
                  phone: user.phone,
                  validateCode: values['validateCode'],
                })
                .then((res) => {
                  if (res.code === 0) {
                    navigateTo({
                      url: '/pages/mine/revise-phone/index',
                    });
                  }
                });
            }
          }}
        >
          <Space>
            <PartTitle bold>验证码</PartTitle>
          </Space>

          <FormItem
            childrenAlign={'left'}
            name={'validateCode'}
            rules={[
              {
                required: true,
                message: '请输入正确的验证码',
              },
            ]}
          >
            <TransferChange>
              {(onChange, value) => (
                <Space
                  alignItems="center"
                  justify="space-between"
                  className={styles.formWrap}
                >
                  <ReInput
                    onChange={onChange}
                    value={value}
                    placeholder="请输入验证码"
                    maxLength={6}
                    adjustPosition
                    className={styles.reInput}
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
          下一步
        </Button>
      </View>
    </View>
  );
};
