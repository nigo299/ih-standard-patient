import React from 'react';
import { UserAuthorization } from '@kqinfo/ui';
import useApi from '@/apis/login';
import storage from '@/utils/storage';
import patientState from '@/stores/patient';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { HOSPITAL_NAME, IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import { reLaunch, navigateBack, redirectTo } from 'remax/one';
import { decrypt } from '@/utils';
import { useMount, useUnmount } from 'ahooks';

export default () => {
  const { getPatientList } = patientState.useContainer();
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '用户授权登录',
    });
  });
  useMount(() => {
    storage.set('getUserInfoPage', 'true');
  });
  useUnmount(() => {
    storage.del('getUserInfoPage');
  });
  return (
    <UserAuthorization
      homeUrl={'/pages/home/index'}
      agreementUrl={'/pages/auth/agreement/index'}
      aliScopes={['auth_user', 'hospital_order', 'mfrstre', 'nhsamp']}
      logo={`${IMAGE_DOMIN}/auth/logo.png`}
      onAuthorization={async ({ code, authCode, ...res }) => {
        const { data } = await useApi.通过code登录.request({
          code: code || authCode,
          miniUser: res.userInfo,
        });
        if (data?.token) {
          storage.set('login_access_token', data?.token);
          const url = storage.get('jumpUrl') || '/pages/home/index';

          if (url.includes('pages2/payment/order-list/index?patCardNo')) {
            reLaunch({
              url,
            });
            return;
          }
          if (!data?.user?.openid) {
            if (PLATFORM === 'ali') {
              const userInfo = await useApi.获取支付宝实名信息.request();
              if (userInfo?.data?.phone) {
                const aliPayPhone = decrypt(userInfo?.data?.phone);
                const result = await useApi.注册.request({
                  phone: aliPayPhone as string,
                  validateCode: 'cqkqif',
                });
                if (result?.data?.openid) {
                  storage.set('openid', result?.data?.openid);
                  getPatientList();
                  navigateBack();
                }
              }
            } else {
              redirectTo({
                url: '/pages/auth/login/index?callback=1',
              });
            }
          } else {
            storage.set('openid', data?.user?.openid);
            getPatientList();
            navigateBack();
          }
        }
      }}
      hisName={HOSPITAL_NAME}
    />
  );
};
