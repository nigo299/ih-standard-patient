import React from 'react';
import { View, navigateTo } from 'remax/one';
import storage from '@/utils/storage';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { redirectUrl, token, openId } = useGetParams<{
    redirectUrl: string;
    token: string;
    openId: string;
  }>();
  const url = decodeURIComponent(redirectUrl);
  if (!!token && !!openId) {
    storage.set('login_access_token', token);
    navigateTo({
      url,
    });
  }
  return <View>123</View>;
};
