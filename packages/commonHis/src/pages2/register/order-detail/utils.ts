import { OrderDetailType } from '@/apis/register';
import { HOSPITAL_NAME } from '@/config/constant';

export const visitTime = '就诊时间';
export const registerSuccessTips =
  '挂号成功，请根据签到时间至少提前20分钟携带绑定的卡（身份证、医保卡、院内诊疗卡）到科室分诊处签到候诊。';
export const RegisterCardPatientNo = 'patCardNo';
export const getHisName = (orderDetail: OrderDetailType) => {
  if (orderDetail?.hisName) {
    return orderDetail?.hisName;
  }
  return HOSPITAL_NAME;
};
