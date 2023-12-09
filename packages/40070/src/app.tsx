import React from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry } from '@kqinfo/ui';
import './app.less';
import storage from '@/utils/storage';
Sentry.init({
  dsn: 'https://eca6c8739c6f4541bdaa0b095f4eeb6e@sentry.cqkqinfo.com/14',
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
  return (
    <StateProviders>
      <ConfigProvider brandPrimary={'#FD92C3'}>
        {props.children as React.ReactElement}
      </ConfigProvider>
    </StateProviders>
  );
};
export default App;
