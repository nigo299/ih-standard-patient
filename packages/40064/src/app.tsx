import React, { useEffect } from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry } from '@kqinfo/ui';
import eruda from 'eruda';
import './app.less';
import storage from '@/utils/storage';
Sentry.init({
  dsn: 'https://f053ab3d9f6546749b1a96989072dd3f@sentry.cqkqinfo.com/13',
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
  useEffect(() => {
    if (storage.get('debugger') === 'true') {
      eruda.init();
    }
  }, []);
  return (
    <StateProviders>
      <ConfigProvider brandPrimary={'#2780D9'}>
        {props.children as React.ReactElement}
      </ConfigProvider>
    </StateProviders>
  );
};
export default App;
