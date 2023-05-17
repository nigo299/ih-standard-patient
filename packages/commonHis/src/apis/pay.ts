import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';
import { H5_PAY } from '@/config/constant';

export interface ChoosepayType {
  appId: string;
  nonceStr: string;
  packages: string;
  paySign: string;
  signType: 'MD5' | 'HMAC-SHA256' | 'RSA' | undefined;
  timeStamp: string;
  alipayTradeNo: string;
}
interface ChoosePaymodeType extends API.ResponseDataType {
  data: ChoosepayType;
}

interface ChooseH5PaymodeType extends API.ResponseDataType {
  data: string;
  code: number;
}

export interface OrderStatusType {
  status: 'P' | 'L' | 'S' | 'F' | 'H' | 'C';
  statusName: string;
}
export interface SearchOrderStatusType extends API.ResponseDataType {
  data: OrderStatusType;
}

export interface MedInsureAlipayType extends API.ResponseDataType {
  data: {
    authUrl: string;
    payAuthNo: string;
    authNo: string;
    medicalCardInstId: string;
    medicalCardId: string;
  };
  code: number;
}

export interface WechatAuthUrlType extends API.ResponseDataType {
  data: {
    authUrl: string;
  };
  code: number;
}

export interface MedInsureWechatType extends API.ResponseDataType {
  data: {
    cityId: string;
    payAuthNo: string;
    userName: string;
    userCardType: string;
    userCardNo: string;
  };
  code: number;
}

export interface ThridPayType extends API.ResponseDataType {
  data: string;
}

export default {
  缴费支付下单: createApiHooks((params: { orderId: string }) => {
    return request.post<ChoosePaymodeType>(
      `/api/ihis/order/order/pay/app`,
      params,
    );
  }),
  h5支付下单: createApiHooks(
    (params: { orderId: string; callbackUrl: string }) => {
      return request.post<ChooseH5PaymodeType>(
        `/api/ihis/order/order/pay/${H5_PAY ? 'h5' : 'mini'}`,
        params,
      );
    },
  ),
  查询订单支付状态: createApiHooks(
    (params: {
      orderId: string;
      /** 1：预约挂号缴费 2：当天挂号缴费 3：门诊缴费 4：住院押金缴费 5 : 就诊卡充值 6 : 取号 */
      bizType: number;
    }) => {
      return request.post<SearchOrderStatusType>(
        '/api/intelligent/api/common/order-status',
        params,
      );
    },
  ),
  支付宝医保免密授权: createApiHooks(
    (params: {
      /** 业务下单生成的payOrderId */
      reqBizNo: string;
      totalAmount: string;
      callUrl: string;
      bizChannel: string;
      scenes?: string;
      orderId?: string;
    }) => {
      return request.post<MedInsureAlipayType>(
        '/api/ihis/user/user/medInsure/auth/alipay',
        params,
        {
          headers: {
            'x-showLoading': 'false',
          },
        },
      );
    },
  ),
  门诊医保异常用户申请退费接口: createApiHooks(
    (params: { orderId: string; payAuthNo: string }) =>
      request.post<ThridPayType>(
        '/api/intelligent/api/op/apply-refund-order',
        params,
      ),
  ),
  微信医保渠道免密授权URL获取: createApiHooks(
    (params: {
      /** 授权成功回调地址 */
      callUrl: string;
      bizChannel: string;
    }) => {
      return request.post<WechatAuthUrlType>(
        '/api/kaiqiao/order/medinsure/getAuthUrl/wechat',
        params,
      );
    },
  ),
  微信医保免密授权: createApiHooks(
    (params: {
      /** 授权获得的authCode */
      qrcode: string;
      bizChannel: string;
      orderId?: string;
    }) => {
      return request.post<MedInsureWechatType>(
        '/api/ihis/user/user/medInsure/auth/wechat',
        params,
        {
          headers: {
            'x-showLoading': 'false',
          },
        },
      );
    },
  ),
  医保移动支付: createApiHooks(
    (params: {
      orderId: string;
      payOrderId: string;
      /** 业务类型（支付业务唯一ID：10-预约挂号；11-门诊缴费；12-住院服务；13-当班挂号） */
      uniqueCode: number;
    }) =>
      request.post<ThridPayType>('/api/intelligent/medical/thrid/pay', params, {
        headers: {
          'x-showLoading': 'false',
        },
      }),
  ),
};
