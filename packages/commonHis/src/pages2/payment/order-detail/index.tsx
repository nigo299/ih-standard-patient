import React from 'react';
import { getHisConfig } from '@/config/his/index';
import BatchDetail from './components/BatchDetail';
import SingleDetail from './components/SingleDetail';
export default () => {
  const His = getHisConfig();
  const his = new His();
  console.log(his.isBatchPay);
  return !!his.isBatchPay ? <BatchDetail /> : <SingleDetail />;
};
