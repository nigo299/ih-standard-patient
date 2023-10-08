import { getBrowserUa } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import React from 'react';
import { redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { APPID, IS_ALIPAY } from '@/config/constant';

export default () => {
  const { patCardNo, scanType } = useGetParams<{
    patCardNo: string;
    scanType?: string;
  }>();
  usePageEvent('onShow', () => {
    if (getBrowserUa() === 'alipay') {
      if (!IS_ALIPAY) {
        redirectTo({
          url: '/pages/maintain/index',
        });
        return;
      }
      // 支付宝小程序
      window.location.href = `https://render.alipay.com/p/s/i/?scheme=${encodeURIComponent(
        `alipays://platformapi/startapp?appId=${APPID}&page=pages2/payment/order-list/index&query=${encodeURIComponent(
          `patCardNo=${patCardNo}&scanType=${scanType}`,
        )}`,
      )}`;
    }
    if (getBrowserUa() === 'wechat') {
      redirectTo({
        url: `/pages2/payment/order-list/index?patCardNo=${patCardNo}&scanType=${scanType}`,
      });
    }
    setNavigationBar({
      title: '处方单扫码付',
    });
  });
  return <></>;
};
