import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchDetail from '@/pages2/payment/order-detail/components/batch-detail';
import SingleDetail from '@/pages2/payment/order-detail/components/single-detail';

export default () => {
  const { config } = useHisConfig();

  if (config.clinicPayBatchType === 'BATCH') {
    return <BatchDetail />;
  }

  if (
    config.clinicPayBatchType === 'SINGLE' ||
    config.clinicPayBatchType === 'JOINT'
  ) {
    return <SingleDetail />;
  }
};
