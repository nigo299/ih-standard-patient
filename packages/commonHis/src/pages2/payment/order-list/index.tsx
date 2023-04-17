import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchPay from './components/batch-pay';
import SinglePay from './components/single-pay';
export default () => {
  const { config } = useHisConfig();
  switch (config?.batchPayType) {
    case 0:
      return <SinglePay />;
    case 1:
      return <BatchPay />;
  }
};
