import { PatientType } from '@/apis/usercenter';
import { PLATFORM } from '@/config/constant';
import { navigateTo } from 'remax/one';

export const handleMineNavTap = (
  list: { url: string; title: string; onClick: () => void },
  extra: {
    patientInfo?: PatientType;
  },
) => {
  if (list?.onClick) {
    list.onClick();
    return;
  }
  if (list.title === '报告及影像查询') {
    navigateTo({
      url: `/pages/report/report-list/index?patientId=${extra?.patientInfo?.patientId}&patHisNo=${extra?.patientInfo?.patHisNo}`,
    });
    return;
  }
  if (PLATFORM === 'web') {
    if (list.title === '大学城挂号记录') {
      window.location.href = list?.url;
      return;
    }
    if (list.title === '附三院挂号记录') {
      window.location.href = list?.url;
      return;
    }
    if (list.title === '旧版挂号记录查询') {
      window.location.href = list?.url;
      return;
    }
  }
  navigateTo({
    url: list?.url,
  });
};
