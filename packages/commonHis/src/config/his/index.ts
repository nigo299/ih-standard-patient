import HisBase from './hisBase';
import His40007 from './his40007';

let cacheHis: InstanceType<typeof HisBase> | null = null;

export const getHisConfig = () => {
  if (cacheHis !== null) return cacheHis;
  const hisId = getHisId();
  switch (hisId) {
    case '40007':
      cacheHis = new His40007();
      return new His40007();
    default: {
      cacheHis = new HisBase(hisId);
      return new HisBase(hisId);
    }
  }
};

export const getHisId = () => {
  // TODO 调整获取hisId的方式
  return '40007';
};
