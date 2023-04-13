import { REQUEST_QUERY } from '@/config/constant';
import {
  setStorageSync,
  getStorageSync,
  clearStorageSync,
  removeStorageSync,
} from 'remax/wechat';

export type keys =
  | 'login_access_token'
  | 'search_doctor'
  | 'elderly'
  | 'audioData'
  | 'openid'
  | 'jumpUrl'
  | 'authUrl'
  | 'userInfo'
  | 'idNo'
  | 'mobile'
  | 'orderId'
  | 'bizType'
  | 'alipayUserInfo'
  | 'sheetVisible'
  | 'cancelVal'
  | 'payment_selectList'
  | 'medinsurePayOrderInfo'
  | 'medicalPay'
  | 'aliPayReqBizNo'
  | 'getUserInfoPage'
  | 'medicalCancel'
  | 'isHealth'
  | 'waitPayListParams'
  | 'createOpOrderParams'
  | 'canApplyRefund';

const prefixKey = (key: string) => {
  return `fe-his-${REQUEST_QUERY.hisId}-` + key;
};

interface Storage {
  get: {
    (key: keys): string | undefined;
    (key: 'elderly'): boolean;
  };
  set: {
    (key: keys, value: string): void;
    (key: 'elderly', value: boolean): void;
  };
  del: {
    (key: keys): void;
  };
  clear: () => void;
}

const storage: Storage = {
  get: (key: string) => {
    switch (key) {
      case 'elderly':
        return !!getStorageSync(prefixKey(key));
      default:
        return getStorageSync(prefixKey(key));
    }
  },
  set: (key: string, data: any) => {
    setStorageSync(prefixKey(key), data);
  },
  del: (key) => removeStorageSync(prefixKey(key)),
  clear: () => clearStorageSync(),
};

export default storage;
