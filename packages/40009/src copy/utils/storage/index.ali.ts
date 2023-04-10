import { REQUEST_QUERY } from '@/config/constant';
import {
  setStorageSync,
  getStorageSync,
  clearStorageSync,
  removeStorageSync,
} from 'remax/ali';
import { keys } from './index';

const prefixKey = (key: keys) => {
  return `fe-his-${REQUEST_QUERY.hisId}-` + key;
};

export default {
  get: (key: keys) =>
    getStorageSync({
      key: prefixKey(key),
    }).data,
  set: (key: keys, data: string | Record<string, any>) => {
    setStorageSync({
      key: prefixKey(key),
      data,
    });
  },
  del: (key: keys) =>
    removeStorageSync({
      key: prefixKey(key),
    }),
  clear: () => clearStorageSync(),
};
