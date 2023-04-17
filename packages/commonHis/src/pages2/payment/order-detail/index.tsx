import React from 'react';
import { useHisConfig } from '@/hooks';
import BatchDetail from './components/batch-detail';
import SingleDetail from './components/single-detail';

export default () => {
  const { config } = useHisConfig();
  switch (config?.batchPayType) {
    case 0:
      return <SingleDetail />;
    case 1:
      return <BatchDetail />;
  }
};
