import React from 'react';
import { useTitle } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';
import Detail from './detail';

export default () => {
  const { visitId, type } = useGetParams<{
    visitId: string;
    type: string;
  }>();
  useTitle('就诊详情');
  console.log('type', type);
  return <>{!!type ? <Detail visitId={visitId} type={type} /> : <></>}</>;
};
