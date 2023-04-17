import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';
import { returnUrl } from '@/utils';
export interface AccessTokenModel extends API.ResponseDataType {
  data: {
    token: string;
    user: {
      openid: string;
      username: string;
    };
  };
}

export interface ApiConfig extends API.ResponseDataType {
  data: {
    hisAuthCode: string;
    signature: string;
    appId: string;
    name: string;
    jsapi_ticket: string;
    hisTopImg: string;
    noncestr: string;
    url: string;
    timestamp: number;
  };
}

export interface LoginType extends API.ResponseDataType {
  data: {
    username: string;
    openid: string;
  };
}

export interface UserType {
  id?: string;
  hisId?: string;
  accountName?: string;
  nickName?: string;
  phone?: string;
  mobile?: string;
  idNo?: string;
  sex?: string;
  email?: string;
  realName?: string;
  isRealName?: string;
  unionId?: string;
  bindCardNum?: string;
  status?: string;
  createTime?: string;
  updateTime?: string;
  platformId?: string;
  platformSource?: string;
  channelId?: string;
  headImage?: string;
  aliPayCertNo?: string;
  aliPayRealName?: string;
  encryptPhone: string;
}

export interface GetUserType extends API.ResponseDataType {
  data: UserType;
}

export interface DecryptDataType {
  idNo: string;
  appChnlId: string;
  authStas: string;
  chnlId: string;
  chnlUserId: string;
  mobile: string;
  name: string;
  octoken: string;
  payAuthNo: string;
}

export interface DecryptLogin extends API.ResponseDataType {
  data: {
    decryptData: DecryptDataType;
  };
}

export interface AuthUrlType extends API.ResponseDataType {
  data: {
    authFlag: string;
    url: string;
  };
}

export interface EncDataParamsType {
  appId?: string;
  signData?: string;
  encData?: string;
  encType?: string;
  signType?: string;
  version?: string;
}

export default {
  通过code登录: createApiHooks((params) => {
    return request.post<AccessTokenModel>(`/api/oauth/login`, params, {
      headers: {
        'x-showLoading': 'false',
      },
    });
  }),
  获取配置信息: createApiHooks(() => {
    return request.post<ApiConfig>(
      `/api/ihis/his/channelCfg/getJsApiConfig?url=${encodeURIComponent(
        returnUrl(),
      )}`,
      undefined,
      {
        headers: {
          'x-showLoading': 'false',
        },
      },
    );
  }),
  获取验证码: createApiHooks((params: { phone: string }) => {
    return request.post<LoginType>('/api/ihis/user/msg/sendValicode', null, {
      params: {
        ...params,
        type: 'login',
      },
    });
  }),
  注册: createApiHooks(
    (params: {
      username?: string;
      identityNumber?: string;
      identityType?: string;
      phone: string;
      validateCode: string;
    }) => {
      return request.post<LoginType>(
        `/api/oauth/bind-user`,
        { ...params, source: 'WISDOM' },
        {
          headers: {
            'x-showToast': 'false',
          },
        },
      );
    },
  ),
  获取用户信息: createApiHooks((params) => {
    return request.post<GetUserType>(
      `/api/ihis/user/user/getuser`,
      params,
      // {
      //   headers: {
      //     'x-showLoading': 'false',
      //     'x-showToast': 'false',
      //   },
      // }
    );
  }),
  用户手机被占用后继续绑定: createApiHooks(
    (params: {
      username?: string;
      identityNumber?: string;
      identityType?: string;
      phone: string;
      validateCode: string;
    }) => {
      return request.post<LoginType>(`/api/oauth/again-bind-user`, params);
    },
  ),

  修改用户手机号: createApiHooks(
    (params: { validateCode: string; phone: string }) => {
      return request.post<API.ResponseDataType>(
        `/api/ihis/user/user/updateuserinfo?validateCode=${params.validateCode}&phone=${params.phone}`,
      );
    },
  ),
  修改用户姓名: createApiHooks((params: { realName: string }) => {
    return request.post<API.ResponseDataType>(
      `/api/ihis/user/user/updateUser`,
      params,
    );
  }),
  修改用户手机号的验证码: createApiHooks((params: { phone: string }) => {
    return request.post<API.ResponseDataType>(
      `/api/ihis/user/user/sendvalidatecode?phone=${params.phone}`,
    );
  }),
  验证手机号和验证码: createApiHooks(
    (params: { phone: string; validateCode: string }) => {
      return request.post<API.ResponseDataType>(
        `/api/ihis/user/user/checkValidateCode?validateCode=${params.validateCode}&phone=${params.phone}`,
      );
    },
  ),
  医保app跳转h5加解密: createApiHooks(
    (params: {
      appId?: string;
      signData?: string;
      encData?: string;
      encType?: string;
      signType?: string;
      version?: string;
    }) => {
      return request.post<DecryptLogin>(
        `/api/kaiqiao/his/medinsure/decrypt`,
        params,
      );
    },
  ),
  获取授权url: createApiHooks(
    (params: {
      appChnlId: string;
      name: string;
      idNo: string;
      chnlUserId: string;
      fixNo?: string;
      hisId: string | number;
      bizChannel: string;
      callBack?: string;
    }) => {
      return request.post<AuthUrlType>(
        '/api/kaiqiao/order/medinsure/getAuthUrl',
        params,
      );
    },
  ),
  获取支付宝实名信息: createApiHooks(() =>
    request.post<GetUserType>('/api/ihis/user/user/getAlipayUser'),
  ),
};
