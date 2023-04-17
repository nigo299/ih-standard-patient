import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchDetail from './components/BatchDetail';
import SingleDetail from './components/SingleDetail';
export default () => {
  const { isBatchPay } = useHisConfig();
  return !!isBatchPay ? <BatchDetail /> : <SingleDetail />;
};
