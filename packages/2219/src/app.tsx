import React from 'react';
import StateProviders from '@/stores';
import { ConfigProvider } from '@kqinfo/ui';
import './app.less';
import storage from '@/utils/storage';

const href = window?.location?.href;
if (href?.includes('isFace=false')) {
  storage.set('isFace', 'false');
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
