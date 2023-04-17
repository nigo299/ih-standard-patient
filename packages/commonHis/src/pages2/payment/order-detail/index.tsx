import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchDetail from './components/BatchDetail';
import SingleDetail from './components/SingleDetail';
export default () => {
  const { config } = useHisConfig();
  return !!config?.isBatchPay ? <BatchDetail /> : <SingleDetail />;
};
