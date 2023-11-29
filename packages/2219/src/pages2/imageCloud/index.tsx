import React, { useEffect } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import patientState from '@/stores/patient';
import { Loading } from '@kqinfo/ui';
import useApi from '@/apis/common';
import useGetParams from '@/utils/useGetParams';
import { decrypt } from 'commonHis/src/utils';

export default () => {
  const { setFaceInfo, defaultPatientInfo, faceInfo } =
    patientState.useContainer();
  const { patientId } = useGetParams<{
    patientId: string;
  }>();
  const { data, loading, request } = useApi.获取应用管理系统授权页({
    params: {
      patientId,
    },
    needInit: false,
  });
  usePageEvent('onShow', () => {
    setFaceInfo({
      idNo: decrypt(defaultPatientInfo?.encryptIdNo) as string,
      name: decrypt(defaultPatientInfo?.encryptPatientName) as string,
      success: false,
      checkMedical: true,
    });
    navigateTo({
      url: '/pages2/usercenter/face-verify/index',
    });
  });
  useEffect(() => {
    if (faceInfo.success) {
      // request({ patientId });
      navigateTo({
        url: '/pages/home/index',
      });
    }
  }, [faceInfo.success, patientId, request]);
  useEffect(() => {
    if (data?.data?.indexUrl) {
      window.location.href = data.data?.indexUrl;
    }
  }, [data.data?.indexUrl]);
  return <View>{loading ? <Loading /> : null}</View>;
};
