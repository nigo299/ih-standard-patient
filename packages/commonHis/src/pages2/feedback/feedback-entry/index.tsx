import React from 'react';
import { View } from '@remax/one';
import useGetParams from '@/utils/useGetParams';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import IPD from './component/IPD';
import OPD from './component/OPD';
export default () => {
  const { type = 'IPD' } = useGetParams<{
    type: string;
    deptName: string;
    deptId: string;
    doctorName: string;
    doctorId: string;
  }>();

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '意见反馈',
    });
  });
  return (
    <View>
      {type === 'IPD' && <IPD />}
      {type === 'OPD' && <OPD />}
    </View>
  );
};
