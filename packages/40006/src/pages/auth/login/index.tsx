import React, { memo, useEffect, useCallback } from 'react';
import { Image, View, navigateBack } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Space,
  Button,
  FormItem,
  Form,
  ReInput,
  TransferChange,
  BackgroundImg,
  Modal,
} from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import { useDownCount } from 'parsec-hooks';
import { checkPhoneForm, reLaunchUrl } from '@/utils';
import { showToast } from '@kqinfo/ui';
import useAuthApi from '@/apis/login';
import storage from '@/utils/storage';
import patientState from '@/stores/patient';
import styles from '@/pages/auth/login/index.less';
import classNames from 'classnames';
import useGetParams from '@/utils/useGetParams';

export default memo(() => {
  const { callback = '0', isHealth } = useGetParams<{
    callback: string;
    isHealth: string;
  }>();
  const { getPatientList } = patientState.useContainer();
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
    const { code } = await useAuthApi.获取验证码.request({
      phone: form.getFieldValue('phone'),
    });
    if (code === 0) {
      setCountdown(120);
    }
  }, [form, setCountdown]);
  const jumpToUrl = useCallback(() => {
    if (isHealth === '1' || storage.get('isHealth') === '1') {
      window.location.replace(
        `https://healthmall.cqkqinfo.com/H5App-p40012/#/pages/index/index?openId=${storage.get(
          'openid',
        )}`,
      );
    }
    if (callback === '1') {
      navigateBack();
      return;
    }
    const jumpUrl = storage?.get('jumpUrl') || '/pages/home/index';
    if (jumpUrl && jumpUrl.indexOf('auth/login') > -1) {
      reLaunchUrl('/pages/home/index');
    } else {
      reLaunchUrl(jumpUrl);
    }
  }, [callback, isHealth]);
  usePageEvent('onShow', () => {
    if (isHealth === '1') {
      storage.set('isHealth', isHealth);
      getPatientList();
    }
    if (storage.get('openid')) {
      jumpToUrl();
    }
    setNavigationBar({
      title: '登录',
    });
  });
  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  return (
    <BackgroundImg className={styles.page}>
      <Modal />
      <Space vertical className={styles.content}>
        <Image
          src={`${IMAGE_DOMIN}/auth/logo.png`}
          className={styles.logo}
          mode="aspectFill"
        />
        <Space vertical className={styles.title}>
          <View>欢迎登录{HOSPITAL_NAME}</View>
          <View>智慧医院</View>
        </Space>
        <Form
          form={form}
          className={styles.form}
          // onFinish={(values: any) => {
          //   useAuthApi.注册
          //     .request({
          //       phone: values['phone'],
          //       validateCode: values['validateCode'],
          //     })
          //     .then((res) => {
          //       if (res.code === 0 && res.data.openid) {
          //         storage.set('openid', res.data.openid);
          //         showToast({
          //           icon: 'success',
          //           title: '登录成功!',
          //         }).then(() => {
          //           jumpToUrl();
          //           getPatientList();
          //         });
          //       }
          //     });
          // }}
          onFinish={async (values: any) => {
            const { code, data, msg } = await useAuthApi.注册.request({
              phone: values['phone'],
              validateCode: values['validateCode'],
            });
            if (code === 0 && data.openid) {
              storage.set('openid', data.openid);
              showToast({
                icon: 'success',
                title: '登录成功!',
              }).then(() => {
                jumpToUrl();
                getPatientList();
              });
            } else if (msg?.includes('该手机号已绑定')) {
              Modal.show({
                title: '温馨提示',
                content:
                  '该手机号已被其他用户占用，若确认该手机号为您本人使用，请点击【继续注册】',
                okText: '继续注册',
                onOk: () =>
                  new Promise((resolve, reject) => {
                    useAuthApi.用户手机被占用后继续绑定
                      .request({
                        phone: values['phone'],
                        validateCode: values['validateCode'],
                      })
                      .then((res) => {
                        if (res.code === 0 && res.data.openid) {
                          storage.set('openid', res.data.openid);
                          showToast({
                            icon: 'success',
                            title: '登录成功!',
                          }).then(() => {
                            resolve('');
                            jumpToUrl();
                            getPatientList();
                          });
                        }
                      })
                      .catch(reject);
                  }),
              });
            }
          }}
        >
          <FormItem
            name={'phone'}
            requiredMark={false}
            colon={false}
            className={styles.formItem}
            label={
              <Space justify="center" alignItems="center">
                <Image
                  src={`${IMAGE_DOMIN}/auth/phone.png`}
                  className={styles.itemImg}
                  mode="aspectFit"
                />
                <View className={styles.solid} />
              </Space>
            }
            rules={[
              {
                type: 'phone',
                required: true,
                message: '请输入正确的手机号码',
              },
            ]}
          >
            <ReInput
              className={styles.reInput}
              placeholderStyle={{ color: '#666' }}
              placeholder="请输入手机号码"
              type="digit"
              maxLength={11}
              adjustPosition
            />
          </FormItem>
          <FormItem
            name={'validateCode'}
            requiredMark={false}
            colon={false}
            className={styles.formItem}
            label={
              <Space justify="center" alignItems="center">
                <Image
                  src={`${IMAGE_DOMIN}/auth/code.png`}
                  className={styles.itemImg}
                  mode="aspectFit"
                />
                <View className={styles.solid} />
              </Space>
            }
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
                    placeholderStyle={{ color: '#666' }}
                    placeholder="请输入验证码"
                    maxLength={6}
                    adjustPosition
                  />
                  <Button
                    type={'primary'}
                    size={'action'}
                    ghost
                    className={classNames(styles.getCodeBtn, {
                      [styles.disabled]: countdown > 0,
                    })}
                    onTap={getPhoneCode}
                  >
                    {countdown > 0 ? countdown : '获取验证码'}
                  </Button>
                </Space>
              )}
            </TransferChange>
          </FormItem>
          <Button
            type="primary"
            className={styles.button}
            onTap={() => form.submit()}
          >
            登录
          </Button>
          <Space justify="center" className={styles.text3}>
            手机号注册验证后将自动登录
          </Space>
        </Form>
      </Space>
    </BackgroundImg>
  );
});
