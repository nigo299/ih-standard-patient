import { useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import storage from '@/utils/storage';
import useApi, { UserType } from '@/apis/login';
import { PLATFORM } from '@/config/constant';
import {
  decrypt,
  getBrowserUa,
  encryptIdNo,
  encryptName,
  encryptPhone,
} from '@/utils';
import { wxInit } from '@kqinfo/ui';

export interface AlipayUserInfoType {
  aliPayRealName: string;
  encryptAliPayRealName: string;
  aliPayCertNo: string;
  encryptAliPayCertNo: string;
  aliPayPhone: string;
  encryptAliPayPhone: string;
}

export default createContainer(() => {
  const [elderly, setElderly] = useState(storage.get('elderly') || false);
  const [user, setUser] = useState<UserType>({
    nickName: '',
    headImage: '',
    phone: '',
    realName: '',
    aliPayCertNo: '',
    aliPayRealName: '',
    encryptPhone: '',
  });
  const [searchQ, setSearchQ] = useState('');
  const [initWechat, setInitWechat] = useState(false);
  const getUserInfo = useCallback(async (request?: boolean /** 强制请求 */) => {
    if (!storage.get('userInfo') || request) {
      const { data } = await useApi.获取用户信息.request();
      if (data?.nickName || data?.phone) {
        data.phone = data?.encryptPhone
          ? decrypt(data.encryptPhone)
          : data.phone;
        // 获取实名认证信息导致phone字段被加密
        if (PLATFORM === 'ali') {
          data.phone = data.mobile;
        }
        storage.set('userInfo', JSON.stringify(data));
        setUser(data);
      }
      if (data?.aliPayRealName && data?.aliPayCertNo && data.phone) {
        const aliPayRealName = decrypt(data.aliPayRealName);
        const aliPayCertNo = decrypt(data.aliPayCertNo);
        const aliPayPhone = data.phone;
        storage.set(
          'alipayUserInfo',
          JSON.stringify({
            aliPayRealName,
            encryptAliPayRealName: encryptName(aliPayRealName),
            aliPayCertNo,
            encryptAliPayCertNo: encryptIdNo(aliPayCertNo),
            aliPayPhone,
            encryptAliPayPhone: encryptPhone(aliPayPhone),
          }),
        );
      }
    } else {
      let userInfo = storage.get('userInfo') as any;
      userInfo = JSON.parse(userInfo) as UserType;
      setUser(userInfo);
    }
  }, []);
  const initWxSDK = useCallback(async () => {
    if (getBrowserUa() === 'wechat' && PLATFORM === 'web' && !initWechat) {
      const { code, data } = await useApi.获取配置信息.request();
      if (code == 0 && data?.appId && data?.signature) {
        const { appId, signature, timestamp, noncestr } = data;
        try {
          await wxInit({
            configData: {
              appId,
              signature,
              timestamp,
              nonceStr: noncestr,
              openTagList: ['wx-open-launch-weapp', 'wx-open-launch-app'],
            },
          });
          console.log('微信初始化sdk成功');
          setInitWechat(true);
          return;
        } catch (err) {
          console.log('微信初始化sdk错误', err);
        }
      } else {
        return Promise.reject();
      }
    } else {
      return;
    }
  }, [initWechat]);
  return {
    elderly,
    setElderly: useCallback((elderly: boolean) => {
      storage.set('elderly', elderly);
      setElderly(elderly);
    }, []),
    user,
    setUser,
    getUserInfo,
    initWxSDK,
    searchQ,
    setSearchQ,
    initWechat,
  };
});
