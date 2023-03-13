import request from './utils/request';
import createApiHooks from 'create-api-hooks';
export interface InhospPatientType {
  admissionNum: string;
  balance: number;
  bedNo: string;
  consumeFee: number;
  deptName: string;
  extFields: string;
  hisId: string;
  hisName: string;
  idNo: string;
  otherDesc: string;
  idType: number;
  inDate: string;
  inhospitalNo: string;
  inhospitalRecordId: string;
  mobile: string;
  outDate: string;
  patCardNo: string;
  patCardType: number;
  patientId: string;
  patientName: string;
  status: string;
  totalFee: number;
  patientSex: string;
  patientAge: number;
}
export interface InhospInfoType extends API.ResponseDataType {
  data: InhospPatientType;
}

export interface DayListType {
  itemName: string;
  itemNumber: string;
  itemPrice: string;
  itemTime: string;
  itemTotalFee: string;
  itemType: string;
  itemUnit: string;
}

export interface ExpensesdaylistType extends API.ResponseDataType {
  data: {
    admissionNum: string;
    bedNo: string;
    beginDate: string;
    channelType: string;
    deptName: string;
    endDate: string;
    isDefalut: number;
    items: DayListType[];
    patientId: string;
    patientName: string;
    readyMedFee: string;
    relationType: number;
    settleType: string;
    totalFee: string;
  };
}

export interface SaveorderType extends API.ResponseDataType {
  data: {
    orderId: string;
    payOrderId: string;
  };
}

export interface InhosppayorderType extends API.ResponseDataType {
  data: {
    cashierURI: string;
    payOrderId: string;
  };
}

interface OrderListType {
  createTime: string;
  orderId: string;
  patCardNo: string;
  patCardType: 21;
  patientName: string;
  payStatus: number;
  payedTime: string;
  refundStatus: number;
  deptName: string;
  status: 'P' | 'S' | 'F' | 'H' | 'C';
  statusName: string;
  totalFee: number;
}
interface InhospOrderListType extends API.ResponseDataType {
  data: OrderListType[];
}

interface OrderDetailType {
  admissionNum: string;
  agtOrdNum: string;
  createTime: string;
  deptName: string;
  hisOrderNo: string;
  extFields: string;
  hisId: string;
  hisName: string;
  orderId: string;
  patCardNo: string;
  patientName: string;
  payFee: number;
  payStatus: number;
  payType: string;
  payedTime: string;
  platformSource: number;
  refundDesc: string;
  refundStatus: number;
  status: string;
  statusName: string;
  systemType: number;
  tips: string;
  totalFee: number;
  totalRealFee: number;
  type: number;
  payOrderId: string;
}
interface InhospOrderDetialType extends API.ResponseDataType {
  data: OrderDetailType;
}

export default {
  查询住院信息: createApiHooks((params: { patientId: string }) =>
    request.post<InhospInfoType>(
      '/api/intelligent/api/in-hospital/record-detail',
      params,
    ),
  ),
  查询住院一日清单: createApiHooks(
    (params: {
      patientId: string;
      beginDate: string;
      endDate: string;
      admissionNum: string;
    }) =>
      request.post<ExpensesdaylistType>(
        '/api/intelligent/api/in-hospital/expenses-day-detail',
        params,
      ),
  ),
  生成住院订单: createApiHooks(
    (params: {
      price: number;
      extFields?: string;
      patientId: string;
      admissionNum: string;
      hisName: string;
    }) =>
      request.post<SaveorderType>(
        '/api/intelligent/api/in-hospital/save-order',
        params,
      ),
  ),
  查询住院订单列表: createApiHooks(() => {
    return request.post<InhospOrderListType>(
      `/api/intelligent/api/in-hospital/order-list`,
    );
  }),
  查询住院订单详情: createApiHooks((params: { orderId: string }) => {
    return request.post<InhospOrderDetialType>(
      `/api/intelligent/api/in-hospital/order-detail`,
      params,
    );
  }),
};