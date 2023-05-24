import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';
import { PatientType } from './usercenter';
import { NUCLEIC_HID } from '@/config/constant';
export interface DeptType {
  createTime: string;
  employeeCount: number;
  hisId: number;
  hisType: number;
  id: number;
  isSummary: number;
  name: string;
  no: string;
  pathCode: string;
  pid: number;
  sortNo: number;
  status: number;
  tel: string;
  updateTime: string;
  address?: string;
  children: DeptType[];
  img: string;
  summary: string;
}

export interface RegisterDeptListType extends API.ResponseDataType {
  data: DeptType[];
}

export interface ScheduleWeekType {
  deptId: string;
  hisId: number;
  monthDay: string;
  scheduleDate: string;
  selected: boolean;
  status: number;
  weekDate: string;
}

export interface RegisterWeekScheduleListType extends API.ResponseDataType {
  data: ScheduleWeekType[];
}

export interface ScheduledoctorType {
  deptName: string;
  doctorId: string;
  image: string;
  sourceType: string;
  level: 1 | 2 | 3;
  title: string;
  doctorSessType: string;
  doctorSessTypeCode: 1 | 2 | 3;
  name: string;
  doctorSex: string;
  doctorSkill: string;
  doctorSummary: string;
  doctorTitle: string;
  extPropes: {
    hymc: string;
  };
  leftSource: number;
  registerFee: number;
  scheduleDate: number;
  sortNo: number;
  /** 0停诊 1有号 2无号 */
  status: 0 | 1 | 2;
  totalSource: number;
  /** 拓展透传字段，用来传递一些特定的值 */
  extFields: any[];
}

export interface RegisterScheduleDoctorListType extends API.ResponseDataType {
  data: ScheduledoctorType[];
}

export interface DeptDoctorType {
  deptId: string;
  doctorId: string;
  deptName: string;
  deptDoctorId: number;
  deptHisType: number;
  hisDistrict: string;
  image: string;
  level: string;
  regFee: number;
  name: string;
  specialty: string;
}
export interface DeptDoctorlistType extends API.ResponseDataType {
  data: {
    beginIndex: number;
    beginPageIndex: number;
    currentPage: number;
    endPageIndex: number;
    numPerPage: number;
    pageCount: number;
    recordList: DeptDoctorType[];
    totalCount: number;
  };
}

export interface DatescheduleType {
  deptId: string;
  doctorId: string;
  hisId: string;
  monthDay: string;
  scheduleDate: string;
  selected: boolean;
  status: number;
  weekDate: string;
}

export interface RegisterDateschedulelistType extends API.ResponseDataType {
  data: DatescheduleType[];
}

export interface ScheduleType {
  extPropes: {
    sourceType: string;
  };
  leftSource: number;
  registerFee: number;
  scheduleId: string;
  status: number;
  visitBeginTime: string;
  visitEndTime: string;
  visitPeriod: number;
  visitQueue: string;
  extFields: string;
}

export interface RegisterSchedulelistType extends API.ResponseDataType {
  data: {
    doctorId: string;
    hisId: string;
    scheduleDate: string;
    deptId: string;
    itemList: ScheduleType[];
  };
}

export interface RegisterConfimType {
  deptName: string;
  doctorName: string;
  doctorTitle: string;
  hisName: string;
  leftBindNum: number;
  patientList: PatientType[];
  registerType: string;
  registerTypeName: string;
  scheduleDate: string;
  totalFee: number;
  visitBeginTime: string;
  visitEndTime: string;
  visitPeriod: 1 | 2 | 3 | 4 | 5;
  visitWeekName: string;
}
export interface RegisterConfirmType extends API.ResponseDataType {
  data: RegisterConfimType;
}

export interface RegisterGeneratororderType extends API.ResponseDataType {
  data: {
    orderId: string;
    payOrderId: string;
    extFields?: string;
    bizType: 1 | 2;
  };
}

export interface RegisterpayorderType extends API.ResponseDataType {
  data: {
    cashierURI: string;
    payOrderId: string;
  };
}

export interface DoctorDetailType {
  circleImage: string;
  deptId: number;
  deptImage: string;
  deptName: string;
  deptNo: string;
  doctorId: string;
  grade: string;
  hisDoctorId: string;
  hisDoctorName: string;
  hisId: number;
  hisName: string;
  hisType: number;
  id: number;
  image: string;
  introduction: string;
  isDeleted: number;
  level: string;
  name: string;
  qrContent: string;
  qrTicket: string;
  qrUrl: string;
  specialty: string;
  status: string;
  type: string;
  workingLife: number;
  hisDistrict: string;
}
export interface RegisterDoctorDetailType extends API.ResponseDataType {
  data: DoctorDetailType;
}

export interface DeptListType {
  deptId: string;
  deptList: DeptListType[];
  deptName: string;
  deptType: number;
  hisId: string;
  hisName: string;
  parentDeptId: string;
}
export interface DoctorListType {
  deptId: string;
  deptName: string;
  doctorId: string;
  doctorImg: string;
  doctorName: string;
  doctorSex: string;
  doctorSkill: string;
  doctorTitle: string;
  firstDeptId: string;
  firstDeptName: string;
  hisId: string;
}
export interface SearchRegisterDeptOrDoctorType extends API.ResponseDataType {
  data: {
    deptList: DeptListType[];
    doctorList: DoctorListType[];
  };
}

export interface OrderStatusType {
  status: 'P' | 'L' | 'S' | 'F' | 'H' | 'C';
  statusName: string;
}
export interface SearchOrderStatusType extends API.ResponseDataType {
  data: OrderStatusType;
}

interface OrderListType {
  bizName: string;
  bizType: string;
  createTime: string;
  deptId: string;
  deptName: string;
  doctorId: string;
  doctorName: string;
  orderId: string;
  orderTime: string;
  patCardNo: string;
  patientId: string;
  patientName: string;
  patientSex: string;
  patientAge: string;
  patientType: number;
  payStatus: number;
  platformSource: number;
  refundStatus: number;
  status: 'P' | 'L' | 'S' | 'F' | 'H' | 'C';
  /** 0：待就诊 1：已就诊 2：未就诊 */
  visitStatus: 0 | 1 | 2;
  statusName: string;
  totalFee: number;
  totalRealFee: number;
  visitBeginTime: string;
  visitDate: string;
  visitEndTime: string;
  visitPeriod: number;
}
interface RegisterOrderListType extends API.ResponseDataType {
  data: OrderListType[];
}

export interface OrderDetailType {
  agtOrdNum: string;
  bizName: string;
  bizType: string;
  canCancelFlag: 1 | 0; // １能取消，０不能取消
  canPayFlag: 1 | 0; // 1能继续支付，0不能支付
  leftPayTime: number;
  cancelTime: string;
  cancelReason: string;
  deptName: string;
  deptNo: string;
  doctorName: string;
  doctorTitle: string;
  errorMsg: string;
  hisName: string;
  hisOrderNo: string;
  orderId: string;
  payOrderId: string;
  orderTime: string;
  parentName: string;
  patCardNo: string;
  patCardType: string;
  patientAge: string;
  patHisNo: string;
  patientId: string;
  patientIdNo: string;
  patientIdType: number;
  patientName: string;
  patientType: number;
  patientSex: 'M' | 'F';
  payStatus: number;
  payedTime: string;
  platformSource: number;
  refundStatus: number;
  hisRecepitNo: string;
  showStopInsure: number;
  status: 'P' | 'L' | 'S' | 'F' | 'H ' | 'C';
  statusName: string;
  stopFlag: number;
  systemType: number;
  totalFee: number;
  totalRealFee: number;
  refundList: Array<{
    refundDesc: string;
    refundFee: number;
    refundSerialNo: string;
    refundStatus: number;
    refundStatusName: string;
    refundSuccessTime: string;
    refundTime: string;
  }>;
  userId: string;
  visitBeginTime: string;
  visitDate: string;
  visitEndTime: string;
  visitPeriod: number;
  visitPosition: string;
  visitWeekName: string;
  weekDate: string;
  extFields?: string;
  /** 订单支付渠道 */
  medicalChannel:
    | 'wechat'
    | 'alipay'
    | 'wechatMedical'
    | 'alipayMedical'
    | 'medicalApp';
  /** 医保费用明细 */
  preSettlementResult: string;
  encryptIdNo: string;
  encryptPatientIdNo: string;
}
interface RegisterOrderDetialType extends API.ResponseDataType {
  data: OrderDetailType;
}

interface QuestionnaireType extends API.ResponseDataType {
  data: {
    tzYznfr: 0 | 1;
    lxbWuhanlv: 0 | 1;
    lxbWuhanjc: 0 | 1;
    lxbBdjcs: 0 | 1;
    lxbJcfrbr: 0 | 1;
    lxbJjxfb: 0 | 1;
    mm1: string;
    mm2: string;
  }[];
}

interface CustomFormDataType extends API.ResponseDataType {
  data: {
    id: number;
    formId: number;
    updateTime: string;
    createTime: string;
    contentJson: string;
    userId: number;
  };
}

export interface HistoryType {
  patCardNo: string;
  hisId: number;
  depts: { no: string; deptId: string; name: string; parentDeptName: string }[];
  doctors: {
    no: string;
    deptId: string;
    deptName: string;
    name: string;
    title: string;
    visitTimes: string;
  }[];
}
interface RegisterHistoryType extends API.ResponseDataType {
  data: HistoryType;
}

export interface MedicalPayType {
  ordStas: string;
  hisName: string;
  psnAcctPay: number;
  feeSumamt: number;
  subHisName: string;
  extData: {
    preSetl: Partial<{
      cvlserv_pay: number;
      cvlserv_flag: string;
      med_type: string;
      brdy: string;
      naty: string;
      psn_cash_pay: number;
      certno: string;
      hifmi_pay: number;
      psn_no: string;
      act_pay_dedc: number;
      mdtrt_cert_type: string;
      balc: number;
      medins_setl_id: string;
      psn_cert_type: string;
      acct_mulaid_pay: number;
      clr_way: string;
      hifob_pay: number;
      oth_pay: number;
      medfee_sumamt: number;
      hifes_pay: number;
      gend: string;
      mdtrt_id: string;
      acct_pay: number;
      fund_pay_sumamt: number;
      fulamt_ownpay_amt: number;
      hosp_part_amt: number;
      inscp_scp_amt: number;
      insutype: string;
      maf_pay: number;
      psn_name: string;
      psn_part_amt: number;
      pool_prop_selfpay: number;
      psn_type: string;
      hifp_pay: number;
      overlmt_selfpay: number;
      preselfpay_amt: number;
      age: number;
      clr_type: string;
    }>;
  };
  othFeeAmt: number;
  deposit: number;
  fundPay: number;
  medicalReq: Partial<{
    acctUsedFlag: string;
    atddrNo: string;
    backUrl: string;
    begntime: string;
    caty: string;
    chrgBchno: string;
    deptCode: string;
    deptName: string;
    diseCodg: string;
    diseName: string;
    diseinfoList: string;
    drName: string;
    ecToken: string;
    feeType: string;
    feedetailList: string;
    fetts: number;
    fetusCnt: number;
    fulamtOwnpayAmt: string;
    gesoVal: number;
    idNo: string;
    idType: string;
    insuCode: string;
    iptOtpNo: string;
    mainCondDscr: string;
    matnType: string;
    mdtrtCertType: string;
    medOrgOrd: string;
    medType: string;
    medfeeSumamt: string;
    medicalCardId: string;
    medicalCardInstId: string;
    obid: string;
    orgCodg: string;
    payAuthNo: string;
    psnSetlway: string;
    rxCircFlag: string;
    spbillCreateIp: string;
    uldLatlnt: string;
    userName: string;
  }>;
  payOrdId: string;
  ownPayAmt: number;
}
interface MedicalPayDataType extends API.ResponseDataType {
  /** 医保下单医保App和微信支付宝移动医保都在用 */
  data: string;
  code: number;
}

export default {
  查询科室列表: createApiHooks(
    (parmas: { deptName?: string /** 模糊搜索 */ }) => {
      return request.get<RegisterDeptListType>('/api/ihis/his/deptMain', {
        params: {
          ...parmas,
          hisType: 2,
        },
      });
    },
  ),
  查询科室排班日期: createApiHooks(
    (params: { deptId: string | number; extFields?: any }) => {
      return request.post<RegisterWeekScheduleListType>(
        '/api/intelligent/api/register/date-schedule-list',
        params,
      );
    },
  ),
  查询科室医生号源: createApiHooks(
    (params: { deptId: string | number; scheduleDate: string }) => {
      return request.post<RegisterScheduleDoctorListType>(
        '/api/intelligent/api/register/schedule-doctor-list',
        params,
      );
    },
  ),
  查询科室医生列表: createApiHooks(
    (params: {
      deptId?: string;
      doctorName?: string /** 模糊搜索 */;
      pageNum?: number;
      numPerPage?: number;
    }) => {
      return request.get<DeptDoctorlistType>('/api/ihis/his/doctorMain', {
        params: {
          ...params,
          hisType: 2,
        },
      });
    },
  ),
  查询医生排班日期: createApiHooks(
    (params: { deptId: string | number; doctorId: number | string }) => {
      return request.post<RegisterDateschedulelistType>(
        '/api/intelligent/api/register/date-schedule-list',
        params,
      );
    },
  ),
  查询医生排班号源: createApiHooks(
    (params: {
      deptId: string | number;
      doctorId: string | number;
      scheduleDate: string;
    }) => {
      return request.post<RegisterSchedulelistType>(
        '/api/intelligent/api/register/schedule-list',
        params,
      );
    },
  ),
  锁号信息确认: createApiHooks((params) => {
    return request.post<RegisterConfirmType>(
      '/api/intelligent/api/register/register-confirm',
      params,
    );
  }),
  锁号: createApiHooks((params) => {
    return request.post<RegisterGeneratororderType>(
      '/api/intelligent/api/register/generator-order',
      params,
    );
  }),
  取消锁号: createApiHooks(
    (params: {
      orderId: string;
      cancelReason: string;
      payAuthNo?: string;
      extFields?: any;
    }) => {
      return request.post<API.ResponseDataType>(
        `/api/intelligent/api/register/cancel-order`,
        params,
        {
          headers: {
            'x-showToast': 'false',
            'x-showLoading': 'false',
          },
        },
      );
    },
  ),
  查询医生详情: createApiHooks(
    (params: { doctorId: string; deptNo: string }) => {
      return request.get<RegisterDoctorDetailType>(
        '/api/ihis/his/doctorMain/detail',
        {
          params: {
            ...params,
            hisType: 2,
          },
        },
      );
    },
  ),
  查询是否关注医生: createApiHooks(
    (params: { doctorId: string; deptId: string }) => {
      return request.get<RegisterDoctorDetailType>(
        '/api/ihis/user/favorite/myfavorited',
        {
          params,
          headers: {
            'x-showToast': 'false',
          },
        },
      );
    },
  ),
  关注医生: createApiHooks((params: { deptId: string; doctorId: string }) => {
    return request.post<API.ResponseDataType>(
      '/api/ihis/user/favorite/addmyfavorite',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
  }),
  取消关注医生: createApiHooks(
    (params: { deptId: string; doctorId: string }) => {
      return request.post<API.ResponseDataType>(
        '/api/ihis/user/favorite/cancelmyfavorite',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        },
      );
    },
  ),
  查询订单支付状态: createApiHooks((params: { orderId: string }) => {
    return request.post<SearchOrderStatusType>(
      '/api/order/orderstatus',
      params,
    );
  }),
  查询挂号订单列表: createApiHooks(() => {
    return request.post<RegisterOrderListType>(
      '/api/intelligent/api/register/order-list',
    );
  }),
  查询挂号订单详情: createApiHooks(({ orderId }: { orderId: string }) => {
    return request.get<RegisterOrderDetialType>(
      `/api/intelligent/api/register/order-detail/${orderId}`,
    );
  }),
  查询是否填写问卷: createApiHooks(({ patientId }: { patientId: string }) => {
    return request.get<QuestionnaireType>(
      `https://ncpcheck2.cqkqinfo.com/public/form/patient`,
      {
        params: {
          patientId,
          hospitalId: NUCLEIC_HID,
        },
      },
    );
  }),
  查询是否填写流调问卷: createApiHooks(
    (params: { formId: string; userId: string }) => {
      return request.get<CustomFormDataType>(
        `https://api-hospitalcheckin-stage.parsec.com.cn/public/custom-form-data/detail`,
        {
          params,
        },
      );
    },
  ),
  查询历史挂号记录: createApiHooks(
    (params: { patCardNo: string; size: number }) => {
      return request.post<RegisterHistoryType>(
        '/api/intelligent/api/register/history',
        params,
      );
    },
  ),
  医保下单: createApiHooks(
    (params: {
      orderId: string;
      payOrderId: string;
      uniqueCode: number;
      totalFee: number;
      selfFee: number;
      payAuthNo: string;
      ocToken: string;
      insuCode: string;
      extFields?: string;
      /** 支付宝医保支付回调地址 */
      backUrl?: string;
      /** 医保电子凭证机构编号，支付宝医保必传 */
      medicalCardInstId?: string;
      /** 用户医保电子凭证授权码，支付宝医保必传 */
      medicalCardId?: string;
    }) => {
      return request.post<MedicalPayDataType>(
        '/api/intelligent/medical/pay',
        params,
        {
          headers: {
            'x-showLoading': 'false',
          },
        },
      );
    },
  ),
};
