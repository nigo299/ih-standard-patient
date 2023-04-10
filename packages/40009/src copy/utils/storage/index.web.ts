import { REQUEST_QUERY } from '@/config/constant';
import { keys } from './index';

const prefixKey = (key: keys) => {
  return `fe-his-${REQUEST_QUERY.hisId}-` + key;
};

export default {
  get: (key: keys) => localStorage.getItem(prefixKey(key)),
  set: (key: keys, data: string) => {
    localStorage.setItem(prefixKey(key), data);
  },
  del: (key: keys) => localStorage.removeItem(prefixKey(key)),
  clear: () => localStorage.clear(),
};
