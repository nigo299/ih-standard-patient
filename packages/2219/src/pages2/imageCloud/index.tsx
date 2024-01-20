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
  const isChild = defaultPatientInfo?.patientAge
    ? defaultPatientInfo.patientAge <= 14
    : false;
  const { data, loading, request } = useApi.获取应用管理系统授权页({
    params: {
      patientId,
    },
    needInit: false,
  });
  usePageEvent('onLoad', () => {
    setFaceInfo({
      idNo: decrypt(
        isChild
          ? defaultPatientInfo?.encryptParentIdNo
          : defaultPatientInfo?.encryptIdNo,
      ) as string,
      name: decrypt(
        isChild
          ? defaultPatientInfo?.encryptParentName
          : defaultPatientInfo?.encryptPatientName,
      ) as string,
      success: false,
      checkMedical: false,
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
    console.log(data);
    if (data?.data?.indexUrl) {
      window.location.href = data.data?.indexUrl;
    }
  }, [data]);
  return <View>{loading ? <Loading /> : null}</View>;
};
