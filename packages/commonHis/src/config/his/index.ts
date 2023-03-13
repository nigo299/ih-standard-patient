import HisBase from './hisBase';
import His40007 from './his4007';

let cacheHis: typeof HisBase | null = null;

export const getHisConfig = () => {
  if (cacheHis !== null) return cacheHis;
  const hisId = getHisId();
  switch (hisId) {
    case '40007':
      cacheHis = His40007;
      return His40007;
    default: {
      cacheHis = HisBase;
      return HisBase;
    }
  }
};

export const getHisId = () => {
  // TODO 调整获取hisId的方式
  return '40007';
};
