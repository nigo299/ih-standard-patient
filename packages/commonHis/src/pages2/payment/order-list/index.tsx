import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchPay from '@/pages2/payment/order-list/components/batch-pay';
import SinglePay from '@/pages2/payment/order-list/components/single-pay';
export default () => {
  const { config } = useHisConfig();
  if (config.clinicPayBatchType === 'BATCH') {
    return <BatchPay />;
  }
  if (config.clinicPayBatchType === 'SINGLE') {
    return <SinglePay />;
  }
};
