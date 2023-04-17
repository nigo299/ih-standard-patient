import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchPay from './components/batch-pay';
import SinglePay from './components/single-pay';
export default () => {
  const { config } = useHisConfig();
  if (config.clinicPayBatchType === 'BATCH') {
    return <BatchPay />;
  }
  if (config.clinicPayBatchType === 'SINGLE') {
    return <SinglePay />;
  }
};
