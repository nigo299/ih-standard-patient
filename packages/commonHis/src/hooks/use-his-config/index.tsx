import { getHisConfig } from '@/config/his';
import { useMemo } from 'react';

export default () => {
  const hisData = useMemo(() => getHisConfig(), []);
  return hisData;
};
