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
}

export default {
  查询就诊人绑定卡号: createApiHooks((params) =>
    request.post<HisCardListType>(`/api/intelligent/personal/his-card`, params),
  ),

  设置默认就诊人: createApiHooks((params: { patientId: string }) =>
    request.put<API.ResponseDataType>(
      `/api/intelligent/personal/default`,
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
};
