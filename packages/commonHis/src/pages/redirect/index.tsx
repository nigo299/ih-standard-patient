import React from 'react';
import { View, navigateTo } from 'remax/one';
import storage from '@/utils/storage';
import useGetParams from '@/utils/useGetParams';
import { showToast } from '@kqinfo/ui';

export default () => {
  const { redirectUrl, token, openId } = useGetParams<{
    redirectUrl: string;
    token: string;
    openId: string;
  }>();
  const url = decodeURIComponent(redirectUrl);
  if (!!token && !!openId) {
    storage.set('login_access_token', token);
    storage.set('openid', openId);
    navigateTo({
      url,
    });
  } else {
    showToast({
      title: '未获取到token或openId,请退出重试',
      icon: 'none',
    });
  }
  return <View />;
};
