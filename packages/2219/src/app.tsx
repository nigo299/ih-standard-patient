import React from 'react';
import StateProviders from '@/stores';
import { ConfigProvider, Sentry, debug } from '@kqinfo/ui';
import './app.less';
import storage from '@/utils/storage';
import { getBrowserUa } from 'commonHis/src/utils';
const wx = require('weixin-js-sdk');
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
if (getBrowserUa() === 'wechat') {
  console.log('wx', wx);
  wx.hideOptionMenu();
  wx.hideMenuItems({
    menuList: [],
  });
}

// if (window.location.href.includes('mdmis.cq12320.cn')) {
//   debug(true);
// }
debug(true);
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
