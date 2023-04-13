import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';
import storage from '@/utils/storage';

export interface OcrResult {
  addresss: string;
  backUrl: string;
  birth: string;
  hisId: string;
  idNo: string;
  idType: 1;
  name: string;
  nationality: string;
  sex: string;
}

export interface TokenType {
  code: number;
  msg: string;
  data: string;
  hisCostTime: number;
  success: boolean;
}

export interface UploadImgType extends API.ResponseDataType {
  data: {
    val: string;
  };
}

export interface InvoiceType extends API.ResponseDataType {
  data: {
    ebillDataList: {
      patCardNo: string;
      payOrderId: string;
      billNo: string;
      billQRCode: string;
      pictureNetUrl: string;
      pictureUrl: string;
      createTime: string;
      channelMode: string;
      random: string;
      billBatchCode: string;
      status: string;
    }[];
  };
}
export interface InfoType extends API.ResponseDataType {
  data: {
    id: number; //主键ID
    hisId: number; //机构ID
    hisName: string; //机构名称
    noticeType: 'GHXZ' | 'GHCGTS' | 'SYTS'; //提示类型(挂号须知-GHXZ；挂号成功提示-GHCGTS；首页提示-SYTS)
    noticeTypeName: string; //提示类型名称
    noticeMethod: 'DLYM' | 'TC' | 'WBK'; //提示方法(独立页面-DLYM；弹窗-TC；文本块-WBK)
    noticeMethodName: string; //提示方法名称
    noticeInfo: string; //提示内容（支持富文本）
    status: boolean; //启用状态
    createId: number; //创建者ID
    creator: string; //创建者
    createTime: string; //创建时间
    updateTime: string; //修改时间
  }[];
}

export interface FacadeType extends API.ResponseDataType {
  data: {
    code: number;
    data: any;
    hisCostTime: number;
    msg: string;
  };
}

export default {
  基础能力平台token获取: createApiHooks(() =>
    request.get<TokenType>('/api/ihis/user/base/token/ocr', {
      headers: {
        'x-showLoading': 'false',
      },
    }),
  ),
  基础能力平台OCR身份识别: createApiHooks(
    (params: { imageFileName: string; backUrl: string }) =>
      request.get<OcrResult>(
        'https://wx.cqkqinfo.com/basicapi/basic/ocr/ocrImage',
        { params },
      ),
  ),
  获取图片上传地址: createApiHooks(
    (params: { media_id: string; ACCESS_TOKEN_URL: string }) =>
      request.post<UploadImgType>(
        '/api/ihis/user/record/auth/api/ocr/getVirUpload',
        {
          ...params,
          openId: storage.get('openid'),
        },
      ),
  ),
  查询电子发票: createApiHooks(
    (params: {
      patCardNo?: string;
      payOrderId?: string;
      beginDate?: string;
      endDate?: string;
      extFields?: any;
    }) => request.post<InvoiceType>('/api/intelligent/api/ebill/info', params),
  ),
  透传字段: createApiHooks(
    (params: {
      transformCode: string;
      Identify?: string;
      IdType?: string;
      patId?: string;
      patCardNo?: string;
      patCardType?: string | number;
      time?: string;
      resourceId?: string;
      beginTime?: string;
      endTime?: string;
      type?: string;
      pictureUrl1?: string;
      pictureUrl2?: string;
      showLoading?: 'loading' | 'false';
      drugInfo?: string;
    }) =>
      request.post<FacadeType>('/api/ihis/his/facade/server', params, {
        headers: {
          'x-showToast': 'false',
        },
      }),
  ),
  蚂蚁森林能量获取: createApiHooks((params: { scene: '1' | '2' }) =>
    request.post<FacadeType>(
      '/api/intelligent/api/alipay/ant/send-energy',
      params,
      {
        headers: {
          'x-showToast': 'false',
        },
      },
    ),
  ),
  签到: createApiHooks((params) =>
    request.post('/krqzjtest/api/customize/medical/sign', params),
  ),
  排队: createApiHooks((params) =>
    request.post('/krqzjtest/api/customize/medical/queue', params),
  ),
  注意事项内容查询: createApiHooks(
    (params: { noticeType?: string; noticeMethod?: string }) =>
      request.get<InfoType>('/api/kaiqiao/content/notice/info', {
        params,
      }),
  ),
};
