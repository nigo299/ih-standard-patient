import React from 'react';
import { useAppEvent } from 'remax/macro';
import StateProviders from '@/stores';
import { ConfigProvider, debug } from '@kqinfo/ui';
import { reLaunchUrl } from '@/utils';
import socialPayAuth from '@/utils/socialPayAuth';
import { PLATFORM, THEME_COLOR } from './config/constant';
import storage from '@/utils/storage';
import './promise.prototype.finally.js';
import './app.less';
import '@/utils/setWeixinFontSize';
debug(true);
const href = window?.location?.href;
if (
  href?.includes('isDebug=true') ||
  window.location.href.includes('mdmis.cq12320.cn')
) {
  debug(true);
}

const App: React.FC = (props) => {
  useAppEvent('onLaunch', (options) => {
    if (!storage.get('search_doctor')) {
      storage.set(
        'search_doctor',
        JSON.stringify(['核酸', '口腔', '呼吸', '儿科']),
      );
    }
    // 限制只有开通了的渠道才能使用应用
    // if (
    //   PLATFORM !== 'wechat' &&
    //   PLATFORM !== 'ali' &&
    //   getBrowserUa() !== 'wechat' &&
    //   getBrowserUa() !== 'alipay' &&
    //   process.env.REMAX_APP_PLATFORM !== 'app'
    // ) {
    //   reLaunchUrl('/pages/maintain/index');
    // }
    // 线上医保App环境直接授权跳转
    const href = window?.location?.href;
    if (
      href?.includes('encData=') &&
      process.env.REMAX_APP_PLATFORM === 'app' &&
      !href?.includes('/pages/auth/getuserinfo/index')
    ) {
      socialPayAuth(href, false).then((res) => {
        if (!res?.payAuthNo) {
          reLaunchUrl(
            `/pages/auth/getuserinfo/index?jumpUrl=${encodeURIComponent(
              window.location.hash.slice(1),
            )}`,
          );
        }
      });
    }

    // 支付宝小程序环境光华平台埋点
    if (PLATFORM === 'ali') {
      const monitor = require('@/alipaylog');
      monitor.init({
        pid: 'wkwv6qabyg9nxedelmj9kw==',
        options: options,
        sample: 1,
        autoReportApi: true,
        autoReportPage: true, // Http请求返回数据中状态码字段名称
        code: ['code'], // Http返回数据中的error message字段名称
        msg: ['数据发送失败'],
      });
      monitor.setCommonInfo({ tag: '重庆沙坪坝区妇幼保健院' });
    }
  });
  return (
    <StateProviders>
      <ConfigProvider brandPrimary={THEME_COLOR}>
        {props.children as React.ReactElement}
      </ConfigProvider>
    </StateProviders>
  );
};
export default App;
