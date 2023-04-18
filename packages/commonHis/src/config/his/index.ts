import HisBase from './hisBase';
import His40007 from './his40007';
import His40009 from './his40009';
import His2219 from './his2219';
import { HIS_ID } from '@/config/constant';

let cacheHis: InstanceType<typeof HisBase> | null = null;
export const getHisConfig = () => {
  if (cacheHis !== null) return cacheHis;
  const hisId = getHisId();
  switch (hisId) {
    case '40007':
      cacheHis = new His40007();
      return new His40007();
    case '40009':
      cacheHis = new His40009();
      return new His40009();
    case '2219':
      cacheHis = new His2219();
      return new His2219();
    default: {
      cacheHis = new HisBase(hisId);
      return new HisBase(hisId);
    }
  }
};
export const getHisId = () => {
  return HIS_ID;
};
