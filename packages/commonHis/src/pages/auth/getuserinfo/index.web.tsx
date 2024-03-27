import React from 'react';
import { navigateBack, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Loading, showModal } from '@kqinfo/ui';
import useApi from '@/apis/login';
import { getBrowserUa, reLaunchUrl, returnUrl } from '@/utils';
import { showToast } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';
import storage from '@/utils/storage';
import patientState from '@/stores/patient';
import { useHisConfig } from '@/hooks';

export default () => {
  const { config } = useHisConfig();
  const { getPatientList } = patientState.useContainer();
  const { code, jumpUrl } = useGetParams<{ code: string; jumpUrl: string }>();
  usePageEvent('onShow', async () => {
    // 医保环境授权逻辑
    const authUrl = decodeURIComponent(jumpUrl);
    if (
      jumpUrl &&
      process.env.REMAX_APP_PLATFORM === 'app' &&
      authUrl.indexOf('encData') > -1
    ) {
      const newJumpUrl =
        authUrl.indexOf('&encData') > -1
          ? authUrl.split('&encData')
          : authUrl.split('?encData');
      const encDataPrams = `encData${newJumpUrl[1]}`;
      if (encDataPrams) {
        storage.set('authUrl', authUrl);
        const { data: codeData } = await useApi.通过code登录.request({
          code: encodeURIComponent(encDataPrams),
        });
        if (codeData?.token) {
          storage.set('login_access_token', codeData?.token);
          // storage.set('testurl', newJumpUrl[0]);

          getPatientList();
          reLaunchUrl(
            newJumpUrl[0]?.includes('?jumpUrl')
              ? newJumpUrl[0]?.split('?jumpUrl=')[1]
              : newJumpUrl[0],
          );
        }
      }
      return;
    }

    if (getBrowserUa() === 'wechat') {
      if (!code && !storage.get('login_access_token')) {
        const backurl = `${returnUrl()}${window.location.hash}`;
        const { code, data } = await useApi.获取配置信息.request();
        if (
          !storage.get('jumpUrl')?.includes('/pages2/usercenter/add-user/index')
        ) {
          storage.set('jumpUrl', decodeURIComponent(jumpUrl));
        }
        if (code === 0) {
          window.location.href = `https://wx.cqkqinfo.com/wx/wechat/authorizeCode/${
            data.hisAuthCode
          }?scope=snsapi_base&backurl=${encodeURIComponent(backurl)}`;
        } else {
          showToast({
            title: '登录失败',
            icon: 'none',
          }).then(() => navigateBack());
        }
      } else {
        const { data } = await useApi.通过code登录.request({
          code,
          scope: 'base',
        });
        if (data?.token) {
          storage.set('login_access_token', data?.token);
          const url = storage.get('jumpUrl') || '/pages/home/index';
          if (!decodeURIComponent(jumpUrl).includes('pages/home/index')) {
            if (config.isMergeIndex) {
              window.history.replaceState(null, 'index', '#/pages/home/index');
            }
            window.history.pushState(null, 'index', '#/pages/home/index');
          }
          // 门诊扫码付不需要跳转注册
          if (url.includes('pages2/payment/order-list/index?patCardNo')) {
            navigateTo({
              url,
            });
            return;
          }
          if (!data?.user?.openid) {
            navigateTo({
              url: '/pages/auth/login/index',
            });
            return;
          }
          storage.set('openid', data?.user?.openid);
          getPatientList();
          navigateTo({
            url,
          });
        } else {
          showModal({
            title: '提示',
            content: '登录错误，请重新登录！',
            showCancel: false,
            confirmText: '我知道了',
          }).then(() => {
            storage.clear();
            reLaunchUrl('/pages/home/index');
          });
        }
      }
    }

    setNavigationBar({
      title: '授权登录',
    });
  });
  // web端重定向授权登录
  return <Loading />;
};
