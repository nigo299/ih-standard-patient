import React from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry } from '@kqinfo/ui';
import './app.less';
import storage from '@/utils/storage';
Sentry.init({
  dsn: 'https://9fc5f818169641d49641a88becfe46d7@sentry.cqkqinfo.com/12',
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
      <ConfigProvider brandPrimary={'#5CA3F3'}>
        {props.children as React.ReactElement}
      </ConfigProvider>
    </StateProviders>
  );
};
export default App;
