import React from 'react';
import { WebView } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import useGetParams from '@/utils/useGetParams';
import setNavigationBar from '@/utils/setNavigationBar';
import { PLATFORM } from '@/config/constant';

export default () => {
  const { url, title } = useGetParams<{ url: string; title: string }>();
  usePageEvent('onShow', () => {
    setNavigationBar({
      title,
    });
  });
  if (PLATFORM === 'web' && url) {
    window.location.href = decodeURIComponent(url);
    return null;
  } else {
    return (
      <WebView
        src={`https://wx.cqkqinfo.com/iframe/index.html?url=${url}&title=${title}`}
      />
    );
  }
};
