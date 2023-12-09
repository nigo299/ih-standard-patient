import React, { useEffect } from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry } from '@kqinfo/ui';
import eruda from 'eruda';
import storage from '@/utils/storage';
import './app.less';
import { HOSPITAL_NAME } from './config/constant';
Sentry.init({
  dsn: 'https://2f8a9dd3eabd4b238f0959d8c64fa585@sentry.cqkqinfo.com/8',
});

Sentry.setTag('医院名称', HOSPITAL_NAME);
const App: React.FC = (props) => {
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
