import request from 'commonHis/src/apis/utils/request';
import createApiHooks from 'create-api-hooks';
import { switchVariable } from '@kqinfo/ui';

const host = switchVariable({
  develop: 'https://tihs.cqkqinfo.com/test-api/api',
  production: 'https://ihs.cqkqinfo.com/api',
})('develop');
export interface RequestInfoListItem {
  RequestInfo: {
    AppointmentInfo: {
      appointmentAddr: '';
      appointmentDate: '20210812';
      appointmentID: '@00525549';
      appointmentTime: '11:00-12:00';
      appointmentType: '1';
      resourceID: '44499';
    };
    ExamItemList: {
      ExamItem: {
        FeeList: {
          Fee: {
            chargeID: '0';
            chargeItemCode: '58934';
            chargeItemName: '';
            chargeItemNumber: 0;
            chargeItemPrice: '0.0';
            chargeItemType: 0;
            chargeItemUnit: '';
            feeID: '1';
          };
        }[];
        examBodyPart: '曲面体层(颌全景)数字';
        examFloorID: 0;
        examFloorName: '冉家坝1楼全景/X光';
        examMethod: '摄影';
        examQueueCode: 'FS001';
        examQueueName: '曲面断层室(冉家坝1楼)';
        examQueueNumber: '';
        filmNum: 1;
        isHaveExamFilm: 0;
        itemCode: '58934';
        itemID: '1';
        itemName: '曲面体层(颌全景)数字摄影';
        medicalOrderNo: '';
      };
    }[];
    appointmentState: 1;
    checkSpecialTypeID: '';
    checkSpecialTypeName: '';
    checkType: '2';
    clinicalDiagnosis: '未见异常';
    defaultModality: 'IO';
    examPurpose: '';
    examState: string;
    execDepartmentID: '60901';
    execDepartmentName: '放射科(冉)';
    feeState: 1;
    feeType: '';
    inOrOutNumber: '2935118111';
    medicalOrderExecutionState: 1;
    medicalRecord: '颌全景';
    remark: '无';
    reportNoticePrintNum: 0;
    reportToDateTime: '20210811191810';
    reqDate: '20210811';
    reqDepartmentID: '70802';
    reqDepartmentName: '舒适牙科(冉)';
    reqDoctorID: '2182';
    reqDoctorName: '刘桥';
    reqHospitalID: '000001';
    reqHospitalName: '重庆医科大学附属口腔医院';
    reqTime: '151701';
    requestState: 0;
    reservationPrintNum: 0;
    sheetID: '25397461';
    urgent: 0;
  };
  age: 54;
  dept: string;
  name: '张涛';
  sex: string; // 男 女
}
export interface PatientInfo {
  address: '';
  age: '';
  bedNumber: '';
  bloodType: '';
  carteVitalNo: 'ZG1001629850';
  datetimeOfBirth: '19670115';
  emergencyNumber: '';
  ethnicity: '';
  familyTelephone: '';
  healthExaminationID: '';
  hospitalizationID: '';
  idNumber: '510202196701152914';
  inpatientAreaID: '';
  inpatientAreaName: '';
  marriage: '';
  medicalCardNo: 'ZG1001629850';
  name: '张涛';
  nationality: '';
  nativePlace: '';
  occupation: '';
  outpatientID: '2935118111';
  patientID: '1002945964';
  patientType: 0;
  placeOfBirth: '';
  registrationDepID: '';
  registrationDepName: '';
  registrationType: 0;
  sex: 1;
  socialSecurityCardNo: '';
  telephone: '15310238723';
  visitNo: 111;
  weight: '';
}

export interface SigninResp {
  // （0：正常，-10：调用HIS接口错误，-100：未到打卡地点，-200：传入的科室名称不对，-300：真趣许可证/cookie错误，以及其它）
  code: number;
  data: unknown;
  msg: string;
}

export interface JyListItem {
  createTime: string;
  deptCode: string;
  deptName: string;
  doctorCode: string;
  doctorName: string;
  hospitalCode: string;
  visitPosition: string;
  orderId: string;
  patName: string;
  patId: string;
}

export interface RegItem {
  beginTime: '08:37';
  deptName: '检验科(冉)';
  hospitalCode: string;
  visitPosition: string;
  patAge: string;
  patGender: string; // 0：女；1：男
  doctorName: '张燕';
  endTime: '08:40';
  hisOrdNum: '3234988';
  orderSource: '网上门诊';
  patCardNo: '';
  patCardType: '';
  patId: '1003395507';
  patIdNo: '500233199810297756';
  patIdType: '';
  patMobile: '18323664309';
  patName: '谢林峰';
  payTime: '2021-08-20 14:56:57';
  regFee: number;
  scheduleDate: '2021-08-23';
  status: string; //1：未支付未签到 0：已支付未签到 2：已签到未接诊 3：已接诊 4：已取消
  timeFlag: '上午';
}

export const useApi = {
  医院签到配置: createApiHooks(
    (params: { hisId: string; districtCode: string }) =>
      request.get<{
        code: number;
        data: {
          bluetoothStatus: number;
          positionStatus: number;
          districtLng: string;
          districtLat: string;
          signInRange: number;
          districtCode: string;
        };
      }>(`${host}/intelligent/api/sign-config/detail`, {
        headers: {
          'ih-version': '3.7.0.1',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        params,
      }),
  ),
};
