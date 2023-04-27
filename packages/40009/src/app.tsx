import React, { useEffect } from 'react';
import StateProviders from '@/stores';
import { ConfigProvider } from '@kqinfo/ui';
import eruda from 'eruda';
import storage from '@/utils/storage';
import './app.less';

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
