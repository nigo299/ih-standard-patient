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
export interface ListApiResponseData<D> {
  code: number;
  data: {
    beginIndex?: number;
    beginPageIndex?: number;
    countResultMap?: any;
    endPageIndex?: number;
    pageCount?: number;
    currentPage: number;
    numPerPage: number;
    recordList: D[];
    totalCount: number;
  };
  msg: string;
}
export interface ListParams {
  pageNum: number;
  numPerPage: number;
}
export interface MDTTeam extends API.ResponseDataType {
  data: {
    id: string;
    hisId: string;
    hospitalName: string;
    teamName: string;
    diseaseType: string;
    mode: string;
    avatarImage: string;
    visitSlot: Array<{
      week: string;
      startTime: string;
      endTime: string;
    }>;
    intro: string;
    createTime: string;
    updateTime: string;
    price: string;
    memberAmount: string;
    deptAmount: string;
  };
}
export interface MDTTeamItem {
  id: string;
  hisId: string;
  roomId: string;
  roomName: string;
  userId: string;
  patientId: string;
  patName: string;
  applySource: string;
  teamId: string;
  teamName: string;
  diseaseType: string;
  payState: string;
  mdtState: string;
  resourceId: string;
  createTime: string;
  updateTime: string;
  mdtStartTime: string;
  mdtEndTime: string;
  mdtFee: string;
  orderId: string;
  orderSerialNumber: string;
  purpose: string;
  rejectReviewReason: string;
  payTime: string;
  reviewTime: string;
  applyCancelTime: string;
  reviewCancelTime: string;
  finishTime: string;
  hospitalName: string;
  districtId: string;
  districtName: string;
  roomAddress: string;
  reportUrl: string;
  patCardNo: string;
  patSex: string;
  patAgeStr: string;
}
export interface TeamInfo extends API.ResponseDataType {
  data: {
    id: string;
    hisId: string;
    teamName: string;
    diseaseType: string;
    mode: string;
    enable: string;
    avatarImage: string;
    visitSlot: Array<{
      week: string;
      startTime: string;
      endTime: string;
    }>;
    intro: string;
    mdtRoomId: string;
    createTime: string;
    updateTime: string;
    price: string;
    memberAmount: string;
    deptAmount: string;
    teamMembers: Array<{
      id: string;
      mdtTeamId: string;
      cpHospitalId: string;
      doctorId: string;
      doctorName: string;
      memberRole: string;
      sort: string;
      createTime: string;
      updateTime: string;
      hospitalName: string;
      deptId: string;
      deptName: string;
      deptSort: string;
      doctorLevel: string;
      doctorImage: string;
      doctorSpecialty: string;
      doctorIntroduction: string;
    }>;
  };
}

export interface MDTTeamSchedule extends API.ResponseDataType {
  data: Array<{
    relationId: string;
    relationName: string;
    scheduleList: Array<{
      id: string;
      createTime: string;
      updateTime: string;
      relationId: string;
      visitDate: string;
      startTime: string;
      endTime: string;
      totalResourceNum: number;
      leftResourceNum: number;
      isPublish: number;
      type: string;
    }>;
  }>;
}

export default {
  查询团队列表: createApiHooks((params: { searchKey?: string }) =>
    request.get<MDTTeam>(`/api/ihis/cooperate/mdt-team`, {
      params,
    }),
  ),
  分页查询团队列表: createApiHooks(
    (params: ListParams & { patientId?: string; mdtState?: string }) =>
      request.get<ListApiResponseData<MDTTeamItem>>(
        `/api/ihis/cooperate/mdt-team`,
        {
          params,
        },
      ),
  ),
  线下MDT预支付: createApiHooks(
    (data: {
      id: string;
      payMethod: string; //H%,MINI
    }) =>
      request.post<HisCardListType>(
        `/api/ihis/cooperate/mdt-offline/prepay`,
        data,
      ),
  ),
  根据id查询团队详情: createApiHooks((params: { id: string }) =>
    request.get<TeamInfo>(`/api/ihis/cooperate/mdt-team/${params.id}`),
  ),
  排班详情: createApiHooks(
    (params: {
      teamId: string;
      visitDate: string;
      type: string;
      relationId?: string;
    }) =>
      request.get<MDTTeamSchedule>(
        `/api/ihis/cooperate/mdt-schedule/one-day/${params.teamId}`,
        {
          params,
        },
      ),
  ),
};
