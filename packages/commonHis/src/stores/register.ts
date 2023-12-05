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
import { HIS_ID, PLATFORM } from '@/config/constant';

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
    const healthDept = [
      '陈家桥儿科',
      '陈家桥产科',
      '陈家桥妇科',
      '陈家桥儿保科',
      '儿科',
      '产科',
      '妇科',
      '儿保科',
      '陈家桥体检科',
      '陈家桥入托体检科',
      '教师体检科',
      '入园体检科',
    ];
    const { data, code } = await useApi.查询科室列表.request();
    const pages = getCurrentPageUrl();
    if (type === 'health' || (code === 0 && data?.length === 1)) {
      if (type === 'health') {
        const arr: DeptType[] = [];
        data.forEach((item) => {
          if (item.children) {
            item.children.forEach((innerItem) => {
              if (healthDept.includes(innerItem.name)) arr.push(innerItem);
            });
          }
        });
        setDeptList(arr);
      } else {
        const deptList =
          type && type === 'reserve'
            ? data[0].children.filter((item) => !item.name.includes('核酸'))
            : data[0].children;
        setDeptList(deptList);
      }
      // console.log('xxx');
      // return;
      if (pages?.indexOf('register/department') === -1) {
        navigateTo({
          url: `/pages2/register/department/index?type=${
            type === 'health' ? 'default' : type
          }&hisType=${hisType || ''}&isHealth=${type === 'health' ? 1 : 0}`,
        });
      }
    }
    if (code === 0 && data?.length > 1) {
      console.log(pages, 'pages');
      if (PLATFORM === 'ali' && HIS_ID === '2219') {
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
      redirectTo({
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
