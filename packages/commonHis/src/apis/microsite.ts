import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';

export interface HisInfoType extends API.ResponseDataType {
  data: {
    adminAccount: string;
    adminName: string;
    certFirstDate: null;
    certFirstTime: null;
    certUpdateDate: null;
    certUpdateTime: null;
    city: null;
    contactNumber: string;
    createTime: string;
    detailAddress: null;
    district: null;
    grading: null;
    hisAuthCode: string;
    hisCode: null;
    hisId: number;
    hisTopImg: null;
    honorImages: null;
    hospitalAddress: string;
    hospitalIntroduction: string;
    hospitalLevel: string;
    hospitalName: string;
    id: 26;
    instCode: null;
    instInfoSafeEnsure: null;
    instRegisterNumber: null;
    lat: null;
    level: null;
    licence: null;
    licenseEndDate: null;
    licenseEndTime: null;
    licenseStartDate: null;
    licenseStartTime: null;
    lng: null;
    moIds: null;
    name: string;
    phone: null;
    province: null;
    serviceScope: null;
    status: string;
    type: null;
    updateTime: string;
  };
}

export interface DeptType {
  deptId: string;
  deptName: string;
  hasChild: number;
}

export interface DeptListType extends API.ResponseDataType {
  data: {
    deptList: DeptType[];
  };
}

export interface DeptDetailType {
  address?: string;
  createTime?: string;
  hisDistrict?: string;
  hisId?: number;
  hisType?: number;
  hospitalDeptName?: string;
  hospitalDeptNo?: string;
  id?: number;
  img?: string;
  initials?: string;
  isDeleted?: number;
  medicalDepartment?: string;
  name?: string;
  no?: string;
  pathCode?: string;
  pid?: number;
  skill?: string;
  standardDeptName?: null;
  standardDeptNo?: null;
  status?: number;
  summary?: string;
  tel?: string;
  updateTime?: string;
}

export interface DeptInfoType extends API.ResponseDataType {
  data: DeptDetailType;
}

export interface ArticleListItem {
  content: string;
  coverImage: string;
  createTime: string;
  hisId: number;
  id: number;
  publishTime: string;
  publisher: string;
  pv: number;
  state: string;
  title: string;
  type: number;
  typeName: string;
  updateTime: string;
}

interface ArticleDetail {
  content: string;
  coverImage: string;
  createTime: string;
  hisId: number;
  id: number;
  publishTime: string;
  publisher: string;
  pv: number;
  state: string;
  title: string;
  type: number;
  typeName: string;
  updateTime: string;
  author: string;
}

export interface MicroDept {
  id: number;
  hisId: number;
  name: string;
  sortNo: number;
  pid: number;
  depts: string;
  children: MicroDept[];
}

export default {
  获取医院信息: createApiHooks(() => {
    return request.post<HisInfoType>(`/api/ihis/his/hospital/get/hisId`);
  }),
  获取科室列表: createApiHooks(() => {
    return request.post<DeptListType>(`/api/web/deptlist`);
  }),
  获取科室详情: createApiHooks((params: { no: string }) => {
    return request.get<DeptInfoType>(`/api/ihis/his/deptMain/detail`, {
      params: {
        ...params,
        hisType: 2,
      },
    });
  }),
  分页查询文章类型: createApiHooks(
    (params: { typeName: string; numPerPage: number; pageNum: number }) => {
      return request.get<{
        code: number;
        msg: string;
        success: boolean;
        data: {
          recordList: {
            id: number;
            typeName: string;
          }[];
        };
      }>(`/api/kaiqiao/his/article/type/page`, { params });
    },
  ),
  获取文章列表: createApiHooks(
    (params: {
      pageNum: number;
      numPerPage: number;
      type?: number;
      title?: string;
      state?: string;
    }) => {
      return request.get<{
        code: number;
        msg: string;
        success: boolean;
        data: {
          totalCount: number;
          recordList: ArticleListItem[];
        };
      }>(`/api/kaiqiao/his/article/page`, {
        params: {
          ...params,
        },
      });
    },
  ),
  获取文章详情: createApiHooks((params: { id: number }) => {
    return request.get<{
      code: number;
      msg: string;
      success: boolean;
      data: ArticleDetail;
    }>(`/api/kaiqiao/his/article/${params.id}`);
  }),
  科室分布目录层级: createApiHooks(() => {
    return request.get<{
      code: number;
      msg: string;
      success: boolean;
      data: MicroDept[];
    }>('/api/kaiqiao/his/microDept');
  }),
  新增浏览量: createApiHooks((params: { id: number }) => {
    return request.put<HisInfoType>('/api/kaiqiao/his/article/addPv', {
      ...params,
    });
  }),
};
