import request from './utils/request';
import createApiHooks from 'create-api-hooks';
import { SendSignReq, WaitSignListItem, WaitSignReq } from './types/sign';

// /api/intelligent/api/sign-config/list
export const 待签到列表查询 = createApiHooks((params: WaitSignReq) => {
  return request.get<{ data: WaitSignListItem[] } & API.ResponseDataType>(
    `/api/intelligent/api/sign-config/list`,
    { params },
  );
});
///api/intelligent/api/sign-config/sign
export const 发起预约签到 = createApiHooks((params: SendSignReq) => {
  return request.post<API.ResponseDataType>(
    `/api/intelligent/api/sign-config/sign`,
    params,
  );
});
