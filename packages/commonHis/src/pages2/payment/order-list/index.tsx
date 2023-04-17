import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchPay from './components/BatchPay';
import SinglePay from './components/SinglePay';
export default () => {
  const { isBatchPay } = useHisConfig();
  return !!isBatchPay ? <BatchPay /> : <SinglePay />;
};
