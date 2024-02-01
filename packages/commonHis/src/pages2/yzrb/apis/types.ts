// 公共分类门诊查询汇总请求类型
export interface PostApiDeansDailyOutpatientDepartmentInfoParams {
  startDate?: string; // 开始时间
  endDate?: string; // 结束时间
  compareType?: string;
}
// 公共分类门诊查询汇总返回数据类型
export interface PostOutDepartmentInfoRes {
  data: {
    data: {
      amountOfSpecifiedDays: string; //指定日期收入总金额
      newAddPatient: string; //新增患者人数
      // bindNum
      bindNum: string; //绑卡建档人数
      totalAmount: string; //门诊总金额
      totalPatient: string; //门诊总人数
      averageCost: string; //总均次就诊费用
      visitsAverageNum: string; //医生平均看诊次数
      amountYOY: string; //总金额同比
      amountMOM: string; //总金额环比
      patientYOY: string; //总人数同比
      patientMOM: string; //总人数环比
      deptInfo: {
        //各科室数据数组
        deptName: string; //科室名称
        deptAmount: string; //科室收入
        deptAverageCost: string; //科室均次费用
        visits: string; //就诊人次
        lastMonthAmount: string; //上月收入汇总
        deptId: string; //科室id
      }[];
    };
  };
}
// 住院查询汇总请求类型
export interface PostApiDeansDailyInpatientDepartmentInfoParams {
  startDate?: string; // 开始时间
  endDate?: string; // 结束时间
  compareType?: string;
}
export interface PostInpatientDepartmentInfoRes {
  data: {
    data: {
      amountOfSpecifiedDays: string; //指定日期收入总金额
      newAddPatient: string; //新增住院人数
      inHospitalPatient: string; //在院人数
      outHospitalPatient: string; //出院人数x
      totalAmount: string; //住院总金额
      totalPatient: string; //住院总人数
      averageCost: string; //总均次住院费用
      outHospitalAverageCost: string; //出院均次费用
      bedUtilization: string; //病床使用率
      amountYOY: string; //总金额同比
      amountMOM: string; //总金额环比
      patientYOY: string; //总人数同比
      patientMOM: string; //总人数环比
      outHospitalAmount: string; // 出院总金额
      inHospitalData: {
        //在院数据
        totalAmount: string; //住院总金额
        inHospitalPatient: string; //在院人数
        deptName: string; //科室名称
        deptAmount: string; //科室收入
        deptAverageCost: string; //科室均次费用
        visits: string; //就诊人次
        lastMonthAmount: string; //上月收入汇总
      }[];
      outHospitalData: {
        //出院数据
        totalAmount: string; //住院总金额
        outHospitalPatient: string; //出院人数
        deptName: string; //科室名称
        deptAmount: string; //科室收入
        deptAverageCost: string; //科室均次费用
        visits: string; //就诊人次
        lastMonthAmount: string; //上月收入汇总
      }[];
    };
  };
}
// 其他查询汇总请求类型
export interface PostApiDeansDailyOthersDepartmentInfoParams {
  startDate?: string; // 开始时间
  endDate?: string; // 结束时间
  compareType?: string;
}
export interface PostOthersDepartmentInfoRes {
  data: {
    data: {
      auxiliaryDepartmentExpensesAmount: string; //辅助科室费用总金额
      incomeCategoriesAmount: string; //新增住院人数
      pharmacyRevenueAmount: string; //在院人数
      physicalTherapyIncomeAmount: string; //出院人数x
      physicalTherapyIncomeNum: string; //住院总金额
      auxiliaryDepartmentExpensesVoList: {
        amount: string; //辅助科室费用总金额
        deptId: string; //科室id
        deptName: string; //科室名称
        incomeType: string; //收入类型
        personNum: string; //人数
        physicalTherapyDate: string; //日期
        physicalTherapyProject: string; //物理治疗项目
      }[];
      incomeCategoriesVoList: {
        amount: string; //辅助科室费用总金额
        incomeCategories: string; //收入类别
        incomeDate: string; //日期
        incomeType: string; //收入类型
        proportion: string; //占比
      }[];
      pharmacyRevenueVoList: {
        amount: string; //辅助科室费用总金额
        drugType: string; //药品类别
        pharmacyRevenueDate: string; //日期
        proportion: string; //占比
      }[];
      physicalTherapyIncomeVoList: {
        amount: string; //辅助科室费用总金额
        deptId: string; //科室id
        deptName: string; //科室名称
        incomeType: string; //收入类型
        personNum: string; //人数
        physicalTherapyDate: string; //日期
        physicalTherapyProject: string; //物理治疗项目
      }[];
    };
  };
}
//门诊科室查询明细请求参数
export interface PostOutpatientDepartmentDetailReq {
  startDate: string; //开始时间
  endDate: string; //结束时间
  deptId: string; //科室ID
}
//门诊科室查询明细返回数据
export interface PostOutpatientDepartmentDetailRes {
  totalAmount: string; //门诊总金额
  totalPatient: string; //门诊总人数
  averageCost: string; //总均次就诊费用
  visitsAverageNum: string; //医生平均看诊次数
  deptName: string; //科室名称
  doctorInfo: {
    //各医生数据数组
    doctorName: string; //医生名字
    doctorAmount: string; //医生收入
    doctorAverageCost: string; //医生均次费用
    visits: string; //就诊人次
    doctorTitle: string; //上月收入汇总
  }[];
  title: {
    doctorTitle: string; //医生职称
    num: string; //人数
  }[];
}
//住院科室查询明细请求参数
export interface PostInpatientDepartmentDetailReq {
  startDate: string; //开始时间
  endDate: string; //结束时间
  deptId: string; //科室ID
}
//住院科室查询明细返回数据
export interface PostInpatientDepartmentDetail {
  totalAmount: string; //住院总金额
  totalPatient: string; //住院总人数
  averageCost: string; //总均次就诊费用
  bedUtilization: string; //病床使用率
  deptName: string; //科室名称
  newAddPatient: string; //新增住院人数
  inHospitalPatient: string; //在院人数
  outHospitalPatient: string; //出院人数
  inTotalAmount: string; //在院数据-住院总金额
  outTotalAmount: string; //出院数据-住院总金额
  inAverageCost: string; //在院数据-均次就诊费用
  outAverageCost: string; //出院数据-均次就诊费用
  title: {
    doctorTitle: string; //医生职称
    num: string; //人数
  }[];
}
