import React from 'react';
import { getHisConfig } from '@/config/his/index';
import BatchPay from './components/BatchPay';
import SinglePay from './components/SinglePay';
export default () => {
  const His = getHisConfig();
  const his = new His();
  console.log(his.isBatchPay);
  return !!his.isBatchPay ? <BatchPay /> : <SinglePay />;
};
