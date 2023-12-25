import React, { useEffect } from 'react';
import { View } from 'remax/one';
import { Loading } from '@kqinfo/ui';
import useApi from '@/apis/common';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { patientId } = useGetParams<{
    patientId: string;
  }>();
  const { data, loading } = useApi.获取应用管理系统授权页({
    params: {
      patientId,
    },
    needInit: !!patientId,
  });
  useEffect(() => {
    if (data?.data?.indexUrl) {
      window.location.href = data.data?.indexUrl;
    }
  }, [data.data?.indexUrl]);
  return <View>{loading ? <Loading /> : null}</View>;
};
