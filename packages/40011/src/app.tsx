import React from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry } from '@kqinfo/ui';
import './app.less';
import storage from '@/utils/storage';
Sentry.init({
  dsn: 'https://aff3ce17ec434998883190f8f67ede95@sentry.cqkqinfo.com/10',
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
      <ConfigProvider brandPrimary={'#009630'}>
        {props.children as React.ReactElement}
      </ConfigProvider>
    </StateProviders>
  );
};
export default App;
