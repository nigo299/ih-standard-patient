import { useCallback } from 'react';
import { redirectTo, navigateBack } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useApi from '@/apis/common';
import patientState from '@/stores/patient';
import showModal from '@/utils/showModal';

export default () => {
  const { defaultPatientInfo } = patientState.useContainer();
  const searchFilmInfo = useCallback(async () => {
    const res = await useApi.透传字段.request({
      transformCode: 'KQ00006',
      Identify: defaultPatientInfo?.patientFullIdNo || '',
      IdType: '3',
    });
    if (res.data.data) {
      window.location.href = res.data.data;
    } else {
      showModal({
        title: '提示',
        content: '暂未获取到电子胶片信息, 请重新选择就诊人!',
      }).then(({ confirm }) => {
        if (confirm) {
          redirectTo({
            url: '/pages2/usercenter/select-user/index?pageRoute=/pages/film/index',
          });
        } else {
          navigateBack();
        }
      });
    }
  }, [defaultPatientInfo?.patientFullIdNo]);
  usePageEvent('onShow', async () => {
    if (defaultPatientInfo.patientFullIdNo) {
      searchFilmInfo();
    } else {
      redirectTo({
        url: '/pages2/usercenter/select-user/index?pageRoute=/pages/film/index',
      });
    }
    setNavigationBar({
      title: '电子胶片',
    });
  });
  return null;
};
