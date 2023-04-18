import { navigateTo } from 'remax/one';
/** 口腔医院个人中心页的特有判断逻辑 */
export default function userCenterSpecialJudge(
  list: ListType,
  selectPatient: selectPatientType,
): void {
  if (list.title === '报告及影像查询') {
    navigateTo({
      url: `/pages/report/report-list/index?patientId=${selectPatient?.patientId}`,
    });
    return;
  }
  if (list.title === '大学城挂号记录') {
    window.location.href = list.url;
    return;
  }
  if (list.title === '附三院挂号记录') {
    window.location.href = list.url;
    return;
  }
}
type ListType = {
  title: string;
  url: string;
};
type selectPatientType = {
  patientId: string;
};
