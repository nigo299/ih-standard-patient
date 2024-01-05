import React, { useEffect } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Loading } from '@kqinfo/ui';
import patientState from '@/stores/patient';
import useApi from '@/apis/common';
import { decrypt } from '@/utils';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { patientId } = useGetParams<{
    patientId: string;
  }>();
  const { setFaceInfo, defaultPatientInfo, faceInfo } =
    patientState.useContainer();
  const { data, loading, request } = useApi.获取应用管理系统授权页({
    params: {
      patientId,
    },
    needInit: true,
  });
  usePageEvent('onLoad', () => {
    let flag = true;
    if (flag) return;
    setFaceInfo({
      idNo: decrypt(defaultPatientInfo?.encryptIdNo as string) as string,
      name: decrypt(defaultPatientInfo?.encryptPatientName as string) as string,
      success: false,
    });
    navigateTo({
      url: '/pages2/usercenter/face-verify/index',
    });
  });
  useEffect(() => {
    if (faceInfo.success) {
      request({ patientId });
    }
  }, [faceInfo.success, patientId, request]);
  useEffect(() => {
    if (data?.data?.indexUrl) {
      window.location.href = data.data?.indexUrl;
    }
  }, [data.data?.indexUrl]);
  return <View>{loading ? <Loading /> : null}</View>;
};
