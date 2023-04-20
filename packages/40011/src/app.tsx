import React from 'react';
import StateProviders from '@/stores';
import { ConfigProvider } from '@kqinfo/ui';
import './app.less';

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
