import HisBase from './hisBase';
import His40070 from './his40070';
import His40072 from './his40072';
import His40074 from './his40074';
import His40009 from './his40009';
import His2219 from './his2219';
import His40011 from './his40011';
import { HIS_ID } from '@/config/constant';

let cacheHis: InstanceType<typeof HisBase> | null = null;
export const getHisConfig = () => {
  if (cacheHis !== null) return cacheHis;
  const hisId = getHisId();
  switch (hisId) {
    case '40070':
      cacheHis = new His40070();
      return new His40070();
    case '40009':
      cacheHis = new His40009();
      return new His40009();
    case '2219':
      cacheHis = new His2219();
      return new His2219();
    case '40011':
      cacheHis = new His40011();
      return new His40011();
    case '40072':
      cacheHis = new His40072();
      return new His40072();
    case '40074':
      cacheHis = new His40074();
      return new His40074();
    default: {
      cacheHis = new HisBase(hisId);
      return new HisBase(hisId);
    }
  }
};
export const getHisId = () => {
  return HIS_ID;
};
