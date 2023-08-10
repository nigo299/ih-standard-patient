import React from 'react';
import { View } from '@remax/one';
import useGetParams from '@/utils/useGetParams';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import IPD from './component/IPD';
import OPD from './component/OPD';
export default () => {
  const {
    hisId,
    dept,
    deptId = undefined,
    no = undefined,
  } = useGetParams<{
    hisId: string;
    dept: string;
    deptId: string;
    no: string;
  }>();

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '意见反馈',
    });
  });
  return (
    <View>
      {deptId && <IPD dept={dept} hisId={hisId} deptId={deptId} />}
      {no && <OPD hisId={hisId} no={no} />}
    </View>
  );
};
