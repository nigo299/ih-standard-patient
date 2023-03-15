import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';

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

export interface ComplainInfo {
  id: number;
  complaintsReason: string;
  createDate: string;
  patientName: string;
  complaintsContent: string;
  complaintsCert: string;
  replyList: {
    replyContent: string;
    replyName: string;
    createDate: string;
    id: number;
    replyUrl: string;
    type: '1' | '2';
    complaintsId: number;
    userId: number;
    userName: string;
    adminId: null;
    adminName: string;
    status: '1';
    updateTime: '2021-11-22 10:48:37';
    createTime: '2021-11-22 10:48:37';
    updateDate: '2021-11-22 10:48';
    hisId: null;
    platformId: null;
  }[];
}

export interface ComplainSetInfo {
  // 新增
  complaintsCert: string;
  complaintsContent: string;
  complaintsReason: string;
  complaintsId?: number;
  type?: number;

  // 追加
  replyUrl: string;
  replyContent: string;

  // 针对问诊订单
  deptName: string;
  deptId: string;
  doctorName: string;
  doctorId: string;
}

export default {
  获取意见反馈列表: createApiHooks(() =>
    request.post<ListApiResponseData<ComplainInfo>>(
      `/api/ihis/user/complaints/getcomplaintslist`,
    ),
  ),
  获取意见反馈详情: createApiHooks((params: { id: number }) =>
    request.post<{
      data: ComplainInfo;
    }>(`/api/ihis/user/complaints/getcomplaintsdetailinfo`, null, { params }),
  ),
  新增意见反馈: createApiHooks(
    (params: {
      [N in keyof ComplainSetInfo]?: ComplainSetInfo[N];
    }) =>
      request.post<{
        code: number;
        msg: string;
        data: null;
      }>(`/api/ihis/user/complaints/addcomplaintsinfo`, null, { params }),
  ),
  追加回复: createApiHooks(
    (params: {
      [N in keyof ComplainSetInfo]?: ComplainSetInfo[N];
    }) =>
      request.post<{
        code: number;
        msg: string;
        data: null;
      }>(`/api/ihis/user/complaints/appendReply`, null, { params }),
  ),
  OSS签名: createApiHooks(() =>
    request.post<{
      code: number;
      msg: string;
      data: {
        accessId: 'LTAI4FseUVLTfv9tsQhnTMzH';
        callback: 'eyJjYWxsYmFja0JvZHlUeXBlIjoiYXBwbGljYXRpb24vanNvbiIsImNhbGxiYWNrSG9zdCI6Imh0dHBzOi8vaWguY3FrcWluZm8uY29tIiwiY2FsbGJhY2tVcmwiOiJodHRwczovL2loLmNxa3FpbmZvLmNvbS9hcGkvZWhpcy9jb21tb24vb3NzL2NhbGxiYWNrIiwiY2FsbGJhY2tCb2R5IjoiYnVja2V0PSR7YnVja2V0fSZmaWxlbmFtZT0ke29iamVjdH0mc2l6ZT0ke3NpemV9Jm1pbWVUeXBlPSR7bWltZVR5cGV9JmhlaWdodD0ke2ltYWdlSW5mby5oZWlnaHR9JndpZHRoPSR7aW1hZ2VJbmZvLndpZHRofSJ9';
        code: 0;
        dir: 'PIC';
        expire: '1593577894';
        extFields: null;
        host: 'https://ihoss.oss-cn-beijing.aliyuncs.com';
        policy: 'eyJleHBpcmF0aW9uIjoiMjAyMC0wNy0wMVQwNDozMTozNC41MThaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJQSUMiXV19';
        sign: 'EFs7Uhfmi5xs0IHe1hUao85OAw8=';
      };
    }>('/api/ihis/his/file/sign', null, {
      params: { bucket: 'ihoss', dir: 'PIC' },
    }),
  ),
};
