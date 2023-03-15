import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';

export interface ReportType {
  reportId: string;
  reportName: string;
  reportStatus: string;
  reportTime: string;
  reportType: number;
}

export interface ReportListType extends API.ResponseDataType {
  data: {
    patCardNo: string;
    patientName: string;
    reportList: ReportType[];
  };
}

export interface CheckReportType {
  checkId: string;
  checkMethod: string;
  checkName: string;
  checkPart: string;
  checkSituation: string;
  deptName: string;
  doctorName: string;
  option: string;
  patAge: number;
  patBirth: string;
  patCardNo: string;
  patSex: 'M' | 'F';
  patientName: string;
  reportTime: string;
  type: number;
  remarks?: string;
  advice?: string;
}

export interface ReportCheckDetailType extends API.ResponseDataType {
  data: CheckReportType;
}

export interface InspectReportType {
  deptName: string;
  doctorName: string;
  inspectId: string;
  inspectName: string;
  inspectTime: string;
  items: {
    abnormal: string;
    itemInstrument: string;
    itemName: string;
    itemNumber: string;
    itemUnit: string;
    refRange: string;
    result: string;
    type: number;
  }[];
  patAge: number;
  patBirth: string;
  patCardNo: string;
  patSex: string;
  patientName: string;
  reportTime: string;
  resultCode: string;
  resultMessage: string;
  implementDeptName: string;
  inspectSample: string;
  type: number;
}

export interface ReportInspectDetailModel extends API.ResponseDataType {
  data: InspectReportType;
}

export default {
  查询报告列表: createApiHooks((params: { patientId: string }) => {
    return request.post<ReportListType>(
      `/api/intelligent/api/report/getreportlist`,
      params,
    );
  }),
  查询检查报告详情: createApiHooks(
    (params: { patientId: string; checkId: string; patCardNo: string }) => {
      return request.post<ReportCheckDetailType>(
        `/api/intelligent/api/report/getcheckresultdetail`,
        params,
      );
    },
  ),
  查询检验报告详情: createApiHooks(
    (params: { patientId: string; inspectId: string; patCardNo: string }) => {
      return request.post<ReportInspectDetailModel>(
        '/api/intelligent/api/report/getinspectresultdetail',
        params,
      );
    },
  ),
};
