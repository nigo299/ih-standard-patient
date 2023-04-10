import React, { useCallback, useEffect } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Button,
  TransferChange,
  ReInput,
  Space,
  Form,
  FormItem,
  showToast,
} from '@kqinfo/ui';
import { useDownCount } from 'parsec-hooks';
import styles from './index.less';
import { checkPhoneForm } from '@/utils';
import useApi from '@/apis/login';
import globalState from '@/stores/global';

export default () => {
  const { getUserInfo } = globalState.useContainer();
  const [form] = Form.useForm();
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  const getPhoneCode = useCallback(async () => {
    const phone = form.getFieldValue('phone');
    if (!checkPhoneForm(phone)) {
      showToast({
        icon: 'none',
        title: '请输入正确的手机号',
      });
      return;
    }
    const { code } = await useApi.修改用户手机号的验证码.request({
      phone,
    });
    if (code === 0) {
      setCountdown(120);
    }
  }, [form, setCountdown]);

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
        第二步：绑定新手机号
      </Space>
      <View className={styles.content}>
        <Form
          form={form}
          cell
          labelWidth="4em"
          childrenAlign={'left'}
          requiredMark={false}
          className={styles.label}
          labelCls={styles.label}
          onFinish={(values: any) => {
            useApi.修改用户手机号
              .request({
                phone: values['phone'],
                validateCode: values['validateCode'],
              })
              .then((res) => {
                if (res.code === 0) {
                  showToast({
                    icon: 'success',
                    title: '修改手机号成功',
                  }).then(() => {
                    getUserInfo(true);
                    navigateTo({
                      url: '/pages/mine/user-info/index',
                    });
                  });
                }
              });
          }}
        >
          <FormItem
            label={'手机号码'}
            name={'phone'}
            rules={[
              {
                type: 'phone',
                required: true,
                message: '请输入正确的手机号码',
              },
            ]}
          >
            <ReInput
              placeholder="请输入新绑定手机号码"
              type="idcard"
              maxLength={11}
              adjustPosition
              className={styles.reInput}
            />
          </FormItem>
          <FormItem
            label={'验证码'}
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
                <Space alignItems="center" className={styles.reInput}>
                  <ReInput
                    onChange={onChange}
                    value={value}
                    placeholder="请输入验证码"
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
        <View className={styles.tip2}>绑定手机后，可使用手机号登录</View>
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
