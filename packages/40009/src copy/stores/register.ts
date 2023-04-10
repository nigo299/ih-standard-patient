import { useCallback, useState } from 'react';
import { navigateTo } from 'remax/one';
import { createContainer } from 'unstated-next';
import {
  RegisterConfimType,
  DoctorDetailType,
  DeptType,
} from '@/apis/register';
import { DeptDetailType } from '@/apis/microsite';
import useApi from '@/apis/register';
import { getCurrentPageUrl } from '@/utils';
export interface IProps {
  deptId: string;
  doctorId: string;
  scheduleId: string;
}

export default createContainer(() => {
  const [hospitalList, setHospitalList] = useState<DeptType[]>([]);
  const [deptList, setDeptList] = useState<DeptType[]>([]);
  const [confirmInfo, setConfirmInfo] = useState<RegisterConfimType & IProps>({
    deptId: '',
    doctorId: '',
    scheduleId: '',
    deptName: '',
    doctorName: '',
    doctorTitle: '',
    hisName: '',
    leftBindNum: 0,
    patientList: [],
    registerType: '',
    registerTypeName: '',
    scheduleDate: '',
    totalFee: 0,
    visitBeginTime: '',
    visitEndTime: '',
    visitPeriod: 1,
    visitWeekName: '',
  });
  const [doctorDetail, setDoctorDetail] = useState<DoctorDetailType>({
    circleImage: '',
    deptId: 0,
    deptImage: '',
    deptName: '',
    doctorId: '',
    grade: '',
    hisDistrict: '',
    hisDoctorId: '',
    hisDoctorName: '',
    hisId: 0,
    hisName: '',
    hisType: 2,
    id: 0,
    image: '',
    introduction: '',
    isDeleted: 0,
    level: '',
    deptNo: '',
    workingLife: 0,
    name: '',
    qrContent: '',
    qrTicket: '',
    qrUrl: '',
    specialty: '',
    status: '',
    type: '',
  });
  const [deptDetail, setDeptDetail] = useState<DeptDetailType>({
    img: '',
    summary: '',
    tel: '',
    address: '',
    createTime: '',
  });

  const getDeptList = useCallback(async (type: string) => {
    const { data, code } = await useApi.查询科室列表.request();
    if (code === 0 && data?.length === 1) {
      const deptList =
        type && type === 'reserve'
          ? data[0].children.filter((item) => !item.name.includes('核酸'))
          : data[0].children;
      setDeptList(deptList);
      const pages = getCurrentPageUrl();
      if (pages?.indexOf('register/department') === -1) {
        navigateTo({
          url: `/pages2/register/department/index?type=${type}`,
        });
      }
    }
    if (code === 0 && data?.length > 1) {
      setHospitalList(data);
      navigateTo({
        url: `/pages2/register/select-hospital/index?type=${type}`,
      });
    }
  }, []);
  return {
    hospitalList,
    setHospitalList,
    deptList,
    setDeptList,
    confirmInfo,
    setConfirmInfo,
    doctorDetail,
    setDoctorDetail,
    deptDetail,
    setDeptDetail,
    getDeptList,
  };
});
