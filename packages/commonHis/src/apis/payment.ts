import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';
export interface WaitpayType {
  date: string;
  deptName: string;
  doctorName: string;
  hisName: string;
  gender: 'F' | 'M';
  age: string;
  hisOrderNo: string;
  medicalFee: string;
  patientId: string;
  patCardNo: string;
  patientName: string;
  hisBillNo: string;
  payName: string;
  selfFee: string;
  totalFee: string;
  medicalParam: string;
  doctorIdNo: string;
  deptNo: string;
  doctorId: string;
  deptId: string;
  medicalFlag: string;
  patHisNo: string;
  itemList: {
    itemName: string;
    itemNum: string;
    itemPrice: string;
    itemUnit: string;
    totalFee: string;
  }[];
  hisSerilNo: string;
  patientInfo: {
    patientName: string;
    patientSex: string;
    patientAge: number;
    encryptIdNo: string;
  };
}
export interface PaymentWaitpayListType extends API.ResponseDataType {
  data: WaitpayType[];
}

export interface WaitDetialType {
  date: string;
  hisName: string;
  age: string;
  gender: 'M' | 'F';
  hisOrderNo: string;
  itemList: Array<{
    itemCatName: string;
    itemName: string;
    itemNum: string;
    itemPrice: string;
    itemSpces: string;
    itemUnit: string;
    name: string;
    totalFee: string;
  }>;
  patCardNo: string;
  patientId: string;
  patientName: string;
  totalFee: number;
  payName: string;
}
export interface PaymentWaitDetailType extends API.ResponseDataType {
  data: WaitDetialType;
}

export interface PaymentOrderType {
  bizName: string;
  bizType: '1' | '2' | '3' | '4';
  deptName: string;
  doctorName: string;
  hisId: string;
  hisName: string;
  hisOrderNo: string;
  hisOrderTime: string;
  medicalFee: number;
  name: string;
  orderId: string;
  patCardNo: string;
  patCardType: string;
  patHisNo: string;
  patientAge: number;
  patientId: string;
  patientIdNo: string;
  patientIdType: 1;
  patientMobile: string;
  patientName: string;
  patientSex: string;
  payOrderId: string;
  payType: string;
  payedTime: string;
  platformId: string;
  platformSource: number;
  selfFee: number;
  status: string;
  totalFee: number;
  totalRealFee: number;
  userId: string;
}
export interface CreateoporderType extends API.ResponseDataType {
  data: PaymentOrderType;
}

export interface RegisterpayorderType extends API.ResponseDataType {
  data: {
    cashierURI: string;
    payOrderId: string;
  };
}

interface PaymentpayOrderType {
  createTime: string;
  medicalFee: number;
  name: string;
  orderId: string;
  patCardNo: string;
  patCardType: number;
  deptName: string;
  patientName: string;
  payedTime: string;
  refundStatus: number;
  status: string;
  statusName: string;
  totalFee: number;
  totalRealFee: number;
  patientSex: 'M' | 'F';
  patientAge: number;
}
interface PaymentOrderListType extends API.ResponseDataType {
  data: PaymentpayOrderType[];
}

interface OrderDetailType {
  agtOrdNum: string;
  bizName: string;
  bizType: string;
  createTime: string;
  errorMsg: string;
  hisName: string;
  hisOrderNo: string;
  hisOrderTime: string;
  hisSerialNo: string;
  patientSex: 'M' | 'F';
  patientAge: number;
  itemList: Array<{
    itemCatName: string;
    itemName: string;
    itemNum: string;
    itemPrice: string;
    itemSpces: string;
    itemUnit: string;
    totalFee: string;
  }>;
  medicalFee: number;
  name: string;
  orderId: string;
  patCardNo: string;
  patHisNo: string;
  patientId: string;
  patientIdNo: string;
  patientIdType: number;
  patientName: string;
  payStatus: number;
  payedTime: string;
  platformSource: number;
  payOrderId: string;
  refundList: Array<{
    refundDesc: string;
    refundFee: number;
    refundSerialNo: string;
    refundStatus: number;
    refundStatusName: string;
    refundSuccessTime: string;
    refundTime: string;
  }>;
  refundStatus: number;
  status: string;
  statusName: string;
  systemType: number;
  totalFee: number;
  guideInfo: string;
  totalRealFee: number;
  deptName: string;
  doctorName: string;
  preSettlementResult: string;
  patientInfo: {
    patientName: string;
    patientSex: string;
    patientAge: number;
    encryptIdNo: string;
  };
}

interface PaymentOrderDetailType extends API.ResponseDataType {
  data: OrderDetailType;
}
export default {
  查询门诊待缴费列表: createApiHooks(
    (params: {
      patientId?: string;
      patientName?: string;
      patCardNo?: string;
      scanFlag?: string;
    }) => {
      return request.post<PaymentWaitpayListType>(
        '/api/intelligent/api/op/wait-pay-list',
        params,
      );
    },
  ),
  查询门诊待缴费详情: createApiHooks(
    (params: {
      patientId?: string;
      patCardNo?: string;
      hisOrderNo: string;
      deptName?: string;
      doctorName?: string;
      scanFlag?: string;
    }) => {
      return request.post<PaymentWaitDetailType>(
        '/api/intelligent/api/op/wait-pay-detail',
        params,
      );
    },
  ),
  查询门诊缴费记录: createApiHooks(() => {
    return request.get<PaymentOrderListType>(
      `/api/intelligent/api/op/my-out-patient-records`,
    );
  }),
  查询门诊缴费订单详情: createApiHooks((params: { orderId: string }) => {
    return request.post<PaymentOrderDetailType>(
      '/api/intelligent/api/op/order-detail',
      params,
    );
  }),
  创建门诊缴费订单: createApiHooks(
    (params: {
      patientId?: string;
      hisOrderNo: string;
      patCardNo?: string;
      scanFlag?: string;
      deptName?: string;
      doctorName?: string;
      createDate?: string;
      extraParam?: string;
    }) => {
      return request.post<CreateoporderType>(
        `/api/intelligent/api/op/create-op-order`,
        params,
      );
    },
  ),
  门诊缴费支付下单: createApiHooks((params: { orderId: string }) => {
    return request.post<RegisterpayorderType>(
      `/api/ihis/order/order/pay/app`,
      params,
    );
  }),
};
