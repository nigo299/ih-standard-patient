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
