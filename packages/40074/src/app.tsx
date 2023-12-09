import React from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry } from '@kqinfo/ui';
import './app.less';
import storage from '@/utils/storage';
Sentry.init({
  dsn: 'https://21f0497b5c2444fc873f0b1c90252df8@sentry.cqkqinfo.com/15',
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
      <ConfigProvider brandPrimary={'#ee5b94'}>
        {props.children as React.ReactElement}
      </ConfigProvider>
    </StateProviders>
  );
};
export default App;
