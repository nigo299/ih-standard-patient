import { useCallback, useMemo } from 'react';
import useApi from '@/apis/usercenter';
import {
  navigateToMiniProgram,
  showToast,
  switchVariable,
  getPlatform,
} from '@kqinfo/ui';
import { NUCLEIC_APPID, NUCLEIC_HID } from '@/config/constant';
import { navigateTo } from 'remax/one';
import showModal from '@/utils/showModal';

export default ({ patientId = '' }: { patientId?: string }) => {
  const {
    data: { data: patientInfo },
  } = useApi.查询就诊人详情({
    params: {
      patientId,
      idFullTransFlag: '1',
    },
    needInit: !!patientId,
  });
  const nucleicJumpParams = useMemo(
    () =>
      `&lite=true&patientId=${patientInfo?.patientId}&name=${encodeURIComponent(
        patientInfo?.patientName,
      )}&idNo=${
        patientInfo?.patientFullIdNo
      }&sex=${patientInfo?.patientSex?.toLocaleLowerCase()}&age=${
        patientInfo?.patientAge
      }&tel=${patientInfo?.patientFullMobile}&formId=4&userId=${
        patientInfo?.patientId
      }`,
    [patientInfo],
  );
  return {
    nucleicJumpParams,
    jumpNucleic: useCallback(() => {
      if (!patientId) {
        showModal({
          title: '没有就诊人信息',
          content: '清添加就诊人',
          showCancel: false,
        }).then(() => {
          navigateTo({
            url: `/pages2/usercenter/select-user/index`,
          });
        });
        return Promise.reject();
      }
      return navigateToMiniProgram({
        appId: NUCLEIC_APPID,
        path: switchVariable({
          wechat: `pages/qrhs/index?hid=${NUCLEIC_HID}${nucleicJumpParams}`,
          ali: `/pages/index/index?${nucleicJumpParams}`,
        })(getPlatform),
      }).catch(() => {
        showToast({
          icon: 'none',
          title: '跳转小程序失败，请重试!',
        });
        return Promise.reject();
      });
    }, [nucleicJumpParams, patientId]),
  };
};
