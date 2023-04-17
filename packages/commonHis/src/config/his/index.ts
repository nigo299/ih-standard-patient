import HisBase from './hisBase';
import His40007 from './his40007';
import His40009 from './his40009';
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
    default: {
      cacheHis = new HisBase(hisId);
      return new HisBase(hisId);
    }
  }
};
export const getHisId = () => {
  // TODO 调整获取hisId的方式
  return '40009';
};
