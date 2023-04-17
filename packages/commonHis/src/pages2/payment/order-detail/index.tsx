import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchDetail from './components/batch-detail';
import SingleDetail from './components/single-detail';

export default () => {
  const { config } = useHisConfig();

  if (config.clinicPayBatchType === 'BATCH') {
    return <BatchDetail />;
  }

  if (config.clinicPayBatchType === 'SINGLE') {
    return <SingleDetail />;
  }
};
