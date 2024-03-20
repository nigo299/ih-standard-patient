import { PatientType } from '@/apis/usercenter';
import { navigateTo } from 'remax/one';

export const handleMineNavTap = (
  list: { url: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extra: {
    patientInfo?: PatientType;
  },
) => {
  navigateTo({ url: list.url });
};

// 就诊号是否特殊名称 (目前针对大渡口妇幼特订)
export const patCardSpecialKey = false;
