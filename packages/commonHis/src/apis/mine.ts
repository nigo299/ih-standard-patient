import request from './utils/request';
import createApiHooks from 'create-api-hooks';

export interface DoctorType {
  deptId: string;
  deptName: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  hisId: string;
  hisDoctorId: string;
  hisDoctorName: string;
  level: string;
  name: string;
  image: string;
}

export interface FavoriteDoctorListType extends API.ResponseDataType {
  data: DoctorType[];
}

export default {
  查询关注医生: createApiHooks(() => {
    return request.post<FavoriteDoctorListType>(
      '/api/ihis/user/favorite/getmyfavoritelist',
    );
  }),
};
