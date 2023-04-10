import { useState } from 'react';
import { createContainer } from 'unstated-next';

export type PayMode = 'YYGH' | 'DBGH' | 'MZJF' | 'ZYYJBJ';
export interface OrderInfoType {
  bizType: PayMode;
  hisName: string;
  deptName?: string;
  doctorName?: string;
  doctorTitle?: string;
  patientName: string;
  patCardNo: string;
  patientFullIdNo?: string;
  totalFee: string | number;
  /** 就诊时间 */
  registerTime?: string;
  /** 业务类型 */
  orderId: string;
  /** 生成支付id */
  payOrderId: string;
  /** 医保支付宝扩展字段 */
  extFields?: string;
  /** h5支付跳转地址 */
  h5PayUrl?: string;
}

/** 挂号门诊支付相关的状态管理 */
export default createContainer(() => {
  const [orderInfo, setOrderInfo] = useState<OrderInfoType>({
    bizType: 'MZJF',
    hisName: '',
    deptName: '',
    registerTime: '',
    doctorName: '',
    doctorTitle: '',
    patientFullIdNo: '',
    patientName: '',
    patCardNo: '',
    totalFee: '',
    orderId: '',
    payOrderId: '',
    extFields: '',
    h5PayUrl: '',
  });
  return {
    orderInfo,
    setOrderInfo,
  };
});
