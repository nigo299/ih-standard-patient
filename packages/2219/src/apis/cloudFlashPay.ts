import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';
export interface WaitpayType {
  hisId: number;
  hisName: string;
  patientId: string;
  deptName: string;
  doctorName: string;
  hisOrderNo: string;
  totalFee: string;
  selfFee: string;
  medicalFee: string;
  payName: string;
  date: string;
  patCardNo: string;
  hisSerilNo: string;
  itemList: {
    itemName: string;
    itemUnit: string;
    itemPrice: number;
    itemNum: number;
    itemSpces: string;
    totalFee: number;
    catName: string;
  }[];
}
export interface PaymentWaitpayListType extends API.ResponseDataType {
  data: { waitOpList: WaitpayType[] };
}

export interface WaitDetialType {
  hisId: number;
  patientId: string;
  patientName: string;
  deptName: string;
  doctorName: string;
  hisOrderNo: string;
  totalFee: string;
  selfFee: string;
  medicalFee: string;
  payName: string;
  date: string;
  patCardType: number;
  patCardNo: string;
  field_2: string;
  field_1: string;
  itemList: {
    itemName: string;
    itemUnit: string;
    itemPrice: number;
    itemNum: number;
    itemSpces: string;
    totalFee: number;
    catName: string;
  }[];
}
export interface PaymentWaitDetailType extends API.ResponseDataType {
  data: WaitDetialType;
}

export interface RegisterpayorderType extends API.ResponseDataType {
  data: {
    payOrderId: string;
    orderId: string;
    totalFee: string;
    selfFee: string;
    medicalFee: string;
    patCardNo: string;
    qrList: {
      payChannel: string;
      qrContent: string;
    }[];
  };
}

export default {
  门诊待缴费列表查询: createApiHooks(
    (params: {
      ext_patCardNo?: string;
      extFields?: any;
      ext_patCardType: string;
    }) => {
      return request.post<PaymentWaitpayListType>(
        '/api/intelligent/hifond/api/oppay/waitpaylist',
        params,
      );
    },
  ),
  门诊待缴费列表详情查询: createApiHooks(
    (params: {
      partnerId?: string;
      ext_patCardNo?: string;
      hisOrderNo: string;
      ext_deptName?: string;
      ext_doctorName?: string;
      ext_patientName?: string;
      extFields?: string;
      ext_patCardType: string;
      ext_patHisNo: string;
      patCardNo?: string;
    }) => {
      return request.post<PaymentWaitDetailType>(
        '/api/intelligent/hifond/api/oppay/waitpaydetail',
        params,
      );
    },
  ),
  门诊缴费下单: createApiHooks(
    (params: {
      hisOrderNo: string;
      ext_patCardNo: string;
      ext_patCardType: string;
      payChannel: string;
      obid?: number | string;
    }) => {
      return request.post<RegisterpayorderType>(
        `/api/intelligent/hifond/api/oppay/getOporder`,
        params,
      );
    },
  ),
  获取支付链接: createApiHooks((params: { hisOrderNo: string }) => {
    return request.post<RegisterpayorderType>(
      `/api/intelligent/hifond/api/oppay/getscanpayqr`,
      params,
    );
  }),
  就诊人详情: createApiHooks((params: { patCardNo: string }) => {
    return request.post(`/api/intelligent//hifond/api/personal/detail`, params);
  }),
};
