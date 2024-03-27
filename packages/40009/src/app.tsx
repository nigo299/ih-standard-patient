import React, { useEffect } from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry } from '@kqinfo/ui';
import eruda from 'eruda';
import storage from '@/utils/storage';
import './app.less';
import { useAppEvent, usePageEvent } from 'remax/macro';
import socialPayAuth from 'commonHis/src/utils/socialPayAuth';
import { reLaunchUrl } from 'commonHis/src/utils';
Sentry.init({
  dsn: 'https://2f8a9dd3eabd4b238f0959d8c64fa585@sentry.cqkqinfo.com/8',
  beforeSend(event) {
    const patientId = storage.get('patientId');
    if (patientId) {
      event.user = {
        id: patientId,
      };
    }
    return event;
  },
});
const App: React.FC = (props) => {
  useAppEvent('onLaunch', () => {
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
  });
  useEffect(() => {
    if (storage.get('debugger') === 'true') {
      eruda.init();
    }
  }, []);

  return (
    <StateProviders>
      <ConfigProvider brandPrimary={'#CF000E'}>
        {props.children as React.ReactElement}
      </ConfigProvider>
    </StateProviders>
  );
};
export default App;
