import React from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry, debug } from '@kqinfo/ui';
import './app.less';
import storage from '@/utils/storage';
Sentry.init({
  dsn: 'https://fd95a1639b804fee9b31ab66a8afe0ba@sentry.cqkqinfo.com/9',
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
const href = window?.location?.href;
if (
  href?.includes('isDebug=true') ||
  window.location.href.includes('mdmis.cq12320.cn')
) {
  debug(true);
}
const App: React.FC = (props) => {
  return (
    <StateProviders>
      <ConfigProvider brandPrimary={'#1f90e2'}>
        {props.children as React.ReactElement}
      </ConfigProvider>
    </StateProviders>
  );
};
export default App;
