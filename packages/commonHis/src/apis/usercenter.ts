import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';

export interface PatientType {
  /**父母姓名 */
  parentName?: string;
  parentIdType: string;
  patCardNo: string;
  patCardType: number;
  patHisNo: string;
  bindMedicareCard: number;
  birthday: string;
  bindStatus: number;
  healthCardFlag: number;
  idTypeName: string;
  patCardNoEncry?: string;
  patCardTypeName?: string;
  patInNo?: string;
  relationName?: string;
  relationType?: number;
  id?: string;
  idNo: string;
  parentIdNo?: string;
  idType: number;
  patientAddress?: string;
  isDefault: 1 | 0;
  /** 患者身份证（明文展示） */
  patientFullIdNo: string;
  /** 父母身份证(明文展示) */
  patientFullParentIdNo?: string;
  patientMobile: string;
  patientFullMobile?: string;
  patientId: string;
  patientType?: number;
  patientName: string;
  patientSex: 'M' | 'F';
  patientAge?: number;
  userId?: string;
  hisName?: string;
  encryptIdNo: string;
  encryptPatientMobile: string;
  encryptPatientName: string;
  healthCardId: string;
  patientNameSimple: string;
  encryptPatientIdNo: string;
}
export interface CardProfileType extends API.ResponseDataType {
  data: {
    idTypes: {
      dictKey: string;
      dictValue: string;
      sortNo: number;
    }[];
    childrenMaxAge: number;
    isNewCard: number;
    /** 控制移动医保支付显示 */
    medicalPay: string[];
    patientTypes: {
      dictKey: string;
      dictValue: string;
      sortNo: number;
    }[];
    relationTypes: {
      dictKey: string;
      dictValue: string;
      sortNo: number;
    }[];
    isFace: 1 | 0;
    isOcr: 1 | 0;
  };
}
interface medicalInfo extends API.ResponseDataType {
  data: string; //医保余额
}
export interface HisCardType {
  patientSex: string;
  birthday: string;
  patientAge: string;
  patCardNo: string;
  patCardType: number;
  patHisNo: string;
  patientName: string;
  patientMobile: string;
  idNo?: string;
  patientAddress?: string;
  parentName: string;
  parentIdNo?: string;
  encryptPatientMobile: string;
}

export interface HisCardListType extends API.ResponseDataType {
  data: HisCardType[];
}

export interface PatientListType extends API.ResponseDataType {
  data: {
    cardList: PatientType[];
    leftBindNum: number;
  };
}

export interface PatientInfoType extends API.ResponseDataType {
  data: PatientType;
}

export interface HelathCardInfoType extends API.ResponseDataType {
  data: {
    healthCardId: string; // 电子健康卡号
    name: string;
    birthday: string; // 出生日期
    address: string;
    jhrGx: string; // 监护人关系。0表示本人,0-本人，1-父，2-母
    gender: string;
    phone: string;
    marriage: string; // 婚姻状态
    citizenship: string;
    idNo: string;
    idNoType: string;
    qrCodeText: string;
  };
  code: number;
  msg?: string;
}

export default {
  获取医院挷卡配置信息: createApiHooks(() =>
    request.get<CardProfileType>(`/api/intelligent/personal/bind-card-profile`),
  ),
  获取就诊人列表: createApiHooks(() =>
    request.get<PatientListType>(
      `/api/intelligent/personal/patient`,
      // {
      //   headers: {
      //     'x-showLoading': 'false',
      //   },
      // }
    ),
  ),
  查询就诊人绑定卡号: createApiHooks((params) =>
    request.post<HisCardListType>(`/api/intelligent/personal/his-card`, params),
  ),
  建档绑卡: createApiHooks((params) =>
    request.post<API.ResponseDataType>(
      `/api/intelligent/personal/add-patient`,
      params,
    ),
  ),
  设置默认就诊人: createApiHooks((params: { patientId: string }) =>
    request.put<API.ResponseDataType>(
      `/api/intelligent/personal/default`,
      params,
    ),
  ),
  解绑就诊人: createApiHooks((params: { patientId: string }) =>
    request.put<API.ResponseDataType>(
      `/api/intelligent/personal/unbind`,
      params,
    ),
  ),
  查询就诊人详情: createApiHooks(
    ({
      patientId,
      idFullTransFlag,
    }: {
      patientId: string;
      idFullTransFlag?: '1' | '0';
    }) =>
      request.get<PatientInfoType>(
        `/api/intelligent/personal/patient/${patientId}/${idFullTransFlag}`,
      ),
  ),
  查询电子健康卡详情: createApiHooks((params: { patientId: string }) =>
    request.get<HelathCardInfoType>(
      `/api/intelligent/personal/patient/health/card/${params.patientId}`,
      {
        headers: {
          'x-showToast': 'false',
        },
      },
    ),
  ),
  发送短信验证码: createApiHooks((params: { phone: string }) =>
    request.post<HelathCardInfoType>(
      `/api/intelligent/validate/code/send`,
      params,
    ),
  ),
  验证短信验证码: createApiHooks(
    (params: { phone: string; verifyCode: string }) =>
      request.post<HelathCardInfoType>(
        `/api/intelligent/validate/code/check`,
        params,
      ),
  ),
  修改就诊人详情: createApiHooks(
    (params: {
      patientId: string;
      nation?: string;
      patientAddress?: string;
      patientMobile?: string;
      verifyCode?: string;
    }) =>
      request.post<HelathCardInfoType>(
        `/api/intelligent/personal/update-base-info`,
        params,
      ),
  ),
  医保个人信息查询: createApiHooks(
    (params: { patientId: string; platformSource?: number; hisId?: number }) =>
      request.get<medicalInfo>(`/api/intelligent/personal/medical/psn-info`, {
        params,
      }),
  ),
};
