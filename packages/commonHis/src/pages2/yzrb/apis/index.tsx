import createApiHooks from 'create-api-hooks';
import request from '@/apis/utils/request';
import {
  PostApiDeansDailyInpatientDepartmentInfoParams,
  PostApiDeansDailyOthersDepartmentInfoParams,
  PostApiDeansDailyOutpatientDepartmentInfoParams,
  PostInpatientDepartmentDetail,
  PostInpatientDepartmentInfoRes,
  PostOthersDepartmentInfoRes,
  PostOutDepartmentInfoRes,
  PostOutpatientDepartmentDetailRes,
} from './types';

/** types 在 /src/types/project.d.ts中维护 */
export default {
  // 公共分类门诊查询汇总
  postApiDeansDailyOutpatientDepartmentInfo: createApiHooks(
    (params: PostApiDeansDailyOutpatientDepartmentInfoParams) =>
      request.post<PostOutDepartmentInfoRes>(`/api/ihis/his/facade/server`, {
        ...params,
        transformCode: 'KQ00061',
      }),
  ),
  // 公共分类住院查询汇总
  postApiDeansDailyInpatientDepartmentInfo: createApiHooks(
    (params: PostApiDeansDailyInpatientDepartmentInfoParams) =>
      request.post<PostInpatientDepartmentInfoRes>(
        `/api/ihis/his/facade/server`,
        {
          ...params,
          transformCode: 'KQ00062',
        },
      ),
  ),
  // 公共分类其他查询汇总
  postApiDeansDailyOthersDepartmentInfo: createApiHooks(
    (params: PostApiDeansDailyOthersDepartmentInfoParams) =>
      request.post<PostOthersDepartmentInfoRes>(`/api/ihis/his/facade/server`, {
        ...params,
        transformCode: 'KQ00068',
      }),
  ),
  // 公共分类门诊科室查询明细
  postOutpatientDepartmentDetailApi: createApiHooks((params: any) =>
    request.post<PostOutpatientDepartmentDetailRes>(
      `/api/deansDaily/outpatientDepartmentDetail`,
      params,
    ),
  ),
  // 住院科室查询明细
  PostOutpatientDepartmentDetailApi: createApiHooks((params: any) =>
    request.post<PostInpatientDepartmentDetail>(
      `/api/deansDaily/inpatientDepartmentDetail`,
      params,
    ),
  ),
};
