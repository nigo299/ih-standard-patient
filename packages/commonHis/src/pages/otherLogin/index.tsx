import React, { useEffect } from 'react';
import { View, redirectTo } from 'remax/one';
import Cookie from 'js-cookie';
import storage from '@/utils/storage';
import patientState from '@/stores/patient';
import useApi from '@/apis/common';
import { Loading } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';

export default () => {
  console.log('href', window.location.href);
  const { jumpUrl } = useGetParams<{ jumpUrl: string }>();
  const { getPatientList } = patientState.useContainer();
  const { request: loginReg, loading } = useApi.通用登录授权({
    needInit: false,
  });
  useEffect(() => {
    // 获取cookie中的code
    let code = Cookie.get('serial_number');
    if (!code) {
      // 如果无法获取cookie中的code，则获取storage中的code
      code =
        storage.get('cookieCode') ||
        'FD2ED5E17D8BBF17BC4B1F2CAFE1B5CB6408D1A4B0011F66A28BDBFA37EF9F3B752A68B0AA298CC78FEDD7D24ECD7A5FDC4DB2EC9151F2042D2E2B431E3E067A';
    }
    storage.set('cookieCode', code);
    if (code) {
      loginReg({
        code: code,
        platformSource: '14', //渝康健 14
      }).then((res) => {
        if (res.data.token) {
          // 登录成功，存储token
          storage.set('login_access_token', res?.data?.token);
          window.localStorage.set('ih-patient-token', res?.data?.token);
          getPatientList();
          const url = jumpUrl
            ? decodeURIComponent(jumpUrl)
            : '/pages/ykhome/index';
          redirectTo({
            url,
          });
        }
      });
    }
  }, [getPatientList, jumpUrl, loginReg]);

  return <View>{loading && <Loading />}</View>;
};
