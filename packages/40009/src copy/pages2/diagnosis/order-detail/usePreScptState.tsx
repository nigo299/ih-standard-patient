import { useGlobalState } from 'parsec-hooks';
type PreScpt = {
  paitentInfo: Array<{
    title: string;
    content: React.ReactNode | string;
  }>; //就诊记录ID
  prescription: //处方/医嘱信息
  {
    prescName: string; //处方/医嘱名称
    doctorName: string; //开单医生
    deptName: string; //开单科室
    createTime: string; //开单时间
    prescriptionType?: string; //医嘱类别（LONG-长期医嘱，SHORT-临时医嘱）
    prescDetail: //处方/医嘱详情
    {
      drugType: string; //药品类型
      drugName: string; //药品名称
      drugSpec: string; //规格
      drugNum: string; //数量
      useMethod: string; //用法
      dosage: string; //用量
      dosageUnit: string; //用量单位
      medicalType: string; //医保类型
    }[];
  }[];
};
export default () => {
  return useGlobalState('preScpt', {} as PreScpt);
};
