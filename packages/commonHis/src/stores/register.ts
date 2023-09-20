import { useCallback, useState } from 'react';
import { navigateTo, redirectTo } from 'remax/one';
import { createContainer } from 'unstated-next';
import {
  RegisterConfimType,
  DoctorDetailType,
  DeptType,
} from '@/apis/register';
import { DeptDetailType } from '@/apis/microsite';
import useApi from '@/apis/register';
import { getCurrentPageUrl } from '@/utils';
import { PLATFORM } from '@/config/constant';

export interface IProps {
  deptId: string;
  doctorId: string;
  scheduleId: string;
}
const aliHospitalList = ['冉家坝', '上清寺', '沙坪坝'];
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

  const getDeptList = useCallback(async (type: string, hisType?: string) => {
    const { data, code } = await useApi.查询科室列表.request();
    const pages = getCurrentPageUrl();
    if (code === 0 && data?.length === 1) {
      const deptList =
        type && type === 'reserve'
          ? data[0].children.filter((item) => !item.name.includes('核酸'))
          : data[0].children;
      setDeptList(deptList);

      if (pages?.indexOf('register/department') === -1) {
        navigateTo({
          url: `/pages2/register/department/index?type=${type}&hisType=${
            hisType || ''
          }`,
        });
      }
    }
    if (code === 0 && data?.length > 1) {
      console.log(pages, 'pages');
      if (PLATFORM === 'ali') {
        const list = data.filter((item) => {
          return aliHospitalList.find((i) => item.name.includes(i));
        });
        setHospitalList(list);
      } else {
        setHospitalList(data);
      }
      if (type === 'doctor') {
        redirectTo({
          url: `/pages2/register/select-hospital/index?type=default&summary=true&doctor=true`,
        });
        return;
      } else if (type === 'dept') {
        redirectTo({
          url: `/pages2/register/select-hospital/index?type=default&summary=true`,
        });
        return;
      }
      navigateTo({
        url: `/pages2/register/select-hospital/index?type=default`,
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
