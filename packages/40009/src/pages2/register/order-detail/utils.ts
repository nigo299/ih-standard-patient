import { OrderDetailType } from 'commonHis/src/apis/register';
import { HOSPITAL_NAME } from '@/config/constant';
import { getDeptName } from '../confirm';

export * from 'commonHis/src/pages2/register/order-detail/utils';
export const visitTime = '报到时间';
export const registerSuccessTips =
  '挂号成功，请根据报到时间携带绑定身份证或医保卡到科室分诊处签到候诊（最早可提前30分钟签到候诊，就诊时间以现场实际等候情况为准）,';
export const getHisName = (orderDetail: OrderDetailType) => {
  if (orderDetail?.deptName?.includes('分院')) {
    const deptName = getDeptName(orderDetail?.deptName);
    return `重庆松山医院口腔医共体 (${deptName})`;
  }
  return HOSPITAL_NAME;
};
