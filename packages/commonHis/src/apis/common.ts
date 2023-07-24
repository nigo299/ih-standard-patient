import request from '@/apis/utils/request';
import createApiHooks from 'create-api-hooks';
import storage from '@/utils/storage';

export interface OcrResult {
  addresss: string;
  backUrl: string;
  birth: string;
  hisId: string;
  idNo: string;
  idType: 1;
  name: string;
  nationality: string;
  sex: string;
}

export interface TokenType {
  code: number;
  msg: string;
  data: string;
  hisCostTime: number;
  success: boolean;
}

export interface UploadImgType extends API.ResponseDataType {
  data: {
    val: string;
  };
}

export interface InvoiceType extends API.ResponseDataType {
  data: {
    ebillDataList: {
      patCardNo: string;
      payOrderId: string;
      billNo: string;
      billQRCode: string;
      pictureNetUrl: string;
      pictureUrl: string;
      createTime: string;
      channelMode: string;
      random: string;
      billBatchCode: string;
      status: string;
    }[];
  };
}

export interface FacadeType extends API.ResponseDataType {
  data: {
    code: number;
    data: any;
    hisCostTime: number;
    msg: string;
    [key: string]: any;
  };
}

interface CustomerTypeLIst extends API.ResponseDataType {
  data: {
    id: number; //主键ID
    hisId: number; //医院ID
    hospitalId: string; //第三方系统里的医院ID
    subHospitalId: string; //第三方系统里的院区ID
    whereUse: string; //使用渠道（载体）枚举值（GZH-微信公众号；ZZJ-自助机）
    whereUseName: string; // 使用渠道(载体)名称
    configName: string; //配置名称
    whereShowCode: string; //显示界面/位置的编码
    whereShow: string; //显示界面/位置
    jumpType: string; //跳转方式（枚举：CLICK-点击跳转；SCAN-扫码）
    jumpTypeName: string; // 跳转方式名称
    jumpUrl: string; //跳转链接
    status: number; //启用状态(0-未启用，1-启用)
    statusName: string; //启用状态名称
    creatorId: string; //创建人id
    creatorName: string; //创建人
    createTime: string; //创建时间
    updateTime: string; //更新时间
  }[];
}
interface ConfigType extends API.ResponseDataType {
  data: {
    id: number; //主键ID
    hisId: number; //机构ID
    hisName: string; //机构名称
    configType: 'DOCTOR' | 'EXPAND' | 'BANNER'; //配置类型（医生数-DOCTOR；拓展功能-EXPAND；banner控制-BANNER）
    sort: number; //外层顺序
    doctorRecordInfo: {
      showCount: number; //最大展示医生数
    }; //就诊过医生配置信息
    doctorRecordInfoList: {
      id: number; //id
      hisId: number; //医院ID
      doctorId: number; //医生ID
      name: string; //医生姓名
      visitType: string; //出诊类型
      image: string; //医生头像
      circleImage: string; //圆形医生头像
      deptId: number; //科室编码
      deptName: string; //科室名称
    }[];
    expandInfo: {
      //拓展功能区配置信息
      title: string; //图标标题
      imgUrl: string; //图片url
      jumpType: string; //跳转类型（H5-H5，小程序-MINI_APP）
      jumpUrl: string; //跳转地址、路径
      appId: string; //小程序appid
      sort: number; //排序
    }[];
    bannerInfo: {
      //banner信息
      title: string; //图标标题
      imgUrl: string; //图片url
      jumpType: string; //跳转类型（H5-H5，小程序-MINI_APP）
      jumpUrl: string; //跳转地址、路径
      appId: string; //小程序appid
      sort: number; //排序
    }[];
    createTime: string; //创建时间
    updateTime: string; //修改时间
  }[];
}

export interface InfoType extends API.ResponseDataType {
  data: {
    id: number; //主键ID
    hisId: number; //机构ID
    hisName: string; //机构名称
    noticeType: 'GHXZ' | 'GHCGTS' | 'SYTS'; //提示类型(挂号须知-GHXZ；挂号成功提示-GHCGTS；首页提示-SYTS)
    noticeTypeName: string; //提示类型名称
    noticeMethod: 'DLYM' | 'TC' | 'WBK'; //提示方法(独立页面-DLYM；弹窗-TC；文本块-WBK)
    noticeMethodName: string; //提示方法名称
    noticeInfo: string; //提示内容（支持富文本）
    status: boolean; //启用状态
    createId: number; //创建者ID
    creator: string; //创建者
    createTime: string; //创建时间
    updateTime: string; //修改时间
  }[];
}

interface VisitRecordList extends API.ResponseDataType {
  data: {
    patName: string; //姓名
    patSex: string; //性别（M-男；F-女）
    patAge: string; //年龄
    createTime: string; //绑卡/建档时间
    recordList: {
      recordId: string; //就诊记录ID
      patHisId: string; //就诊人医院唯一ID
      patCardNo: string; //就诊人就诊卡号
      patName: string; //就诊人姓名
      recordType: string; //就诊类别（OPD-门诊；IPD-住院）
      visitDate: string; //就诊时间
      deptCode: string; //科室编码
      deptName: string; //科室名称
      doctorCode: string; //医生编码
      doctorName: string; //医生姓名
    }[];
  };
}
interface outPatientRecord extends API.ResponseDataType {
  data: {
    recordId: string; //就诊记录ID
    patName: string; //姓名
    patSex: string; //性别
    patAge: string; //年龄
    recordType: string; //就诊类别（OPD-门诊；IPD-住院）
    essentialInfo: {
      //就诊基本信息
      deptName?: string; //就诊科室
      doctorName?: string; //接诊医生
      patCardNo?: string; //就诊卡号
      visitDate?: string; //就诊时间
      admissionNum?: string; //住院号
      bedNo?: string; //病床号
      inDeptName?: string; //入院科别
      outDeptName?: string; //出院科别
      inTime?: string; //入院时间
      outTime?: string; //出院时间
    };
    medicalRecord: {
      //门诊病历信息
      recordId: string; //就诊记录ID
      mainNarration: string; //主述
      nowHistory: string; //现病史
      pastHistory: string; //既往史
      examInfo: string; //体格检查信息
      diagnosis: string; //诊断
      opinions: string; //治疗意见
    };
    prescription: //处方/医嘱信息
    {
      prescName: string; //处方/医嘱名称
      doctorName: string; //开单医生
      deptName: string; //开单科室
      createTime: string; //开单时间
      prescriptionType?: string;
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
    report: //报告信息
    {
      reportId: string; //报告ID
      reportType: string; //报告类型
      reportName: string; //报告名称
      reportStatus: string; //报告状态
      reportTime: string; //报告时间
      examTime: string; //审核时间
      deptName: string; //送检科室名
      doctorName: string; //送检医生姓名
      exeDeptCode: string; //执行科室代码
      exeDeptName: string; //执行科室名
      reporter: string; //报告人
      auditor: string; //审核人
    }[];
    operation: //手术信息
    {
      operationId: string; //手术记录ID
      operationType: string; //手术类型
      operationName: string; //手术名称
      operationTime: string; //手术时间
      deptName: string; //执行科室
      doctorName: string; //执行医生
    }[];
  };
}

interface AccountsRecord extends API.ResponseDataType {
  data: {
    recordId: string; //就诊记录ID
    patName: string; //姓名
    patSex: string; //性别
    patAge: string; //年龄
    recordType: string; //就诊类别（OPD-门诊；IPD-住院）
    essentialInfo: {
      //就诊基本信息
      deptName?: string; //就诊科室
      doctorName?: string; //接诊医生
      patCardNo?: string; //就诊卡号
      visitDate?: string; //就诊时间
      admissionNum?: string; //住院号
      bedNo?: string; //病床号
      inDeptName?: string; //入院科别
      outDeptName?: string; //出院科别
      inTime?: string; //入院时间
      outTime?: string; //出院时间
    };
    settlementInfo: {
      //结算信息
      totalFee: string; //费用总额
      insuranceFee: string; //医保支付金额，单位：分
      selfFee: string; //自费支付金额，单位：分
      otherFee: string; //其他费用，单位：分
      balanceType: string; //结算类别（YB-医保；ZF-自费）
      feeList: [
        //费用明细
        {
          feeType: string; //费别（DRUG-药品；EXAM-检验检查；TREAT-治疗；OTHER-其他）
          medicalType: string; //医保类型
          itemName: string; //项目名称
          price: string; //单价，单位：分
          num: string; //数量
          total: string; //单项总额
        },
      ];
    };
  };
}

export default {
  基础能力平台token获取: createApiHooks(() =>
    request.get<TokenType>('/api/ihis/user/base/token/ocr', {
      headers: {
        'x-showLoading': 'false',
      },
    }),
  ),
  基础能力平台OCR身份识别: createApiHooks(
    (params: { imageFileName: string; backUrl: string }) =>
      request.get<OcrResult>(
        'https://wx.cqkqinfo.com/basicapi/basic/ocr/ocrImage',
        { params },
      ),
  ),
  获取图片上传地址: createApiHooks(
    (params: { media_id: string; ACCESS_TOKEN_URL: string }) =>
      request.post<UploadImgType>(
        '/api/ihis/user/record/auth/api/ocr/getVirUpload',
        {
          ...params,
          openId: storage.get('openid'),
        },
      ),
  ),
  查询电子发票: createApiHooks(
    (params: {
      patCardNo?: string;
      payOrderId?: string;
      beginDate?: string;
      endDate?: string;
      extFields?: any;
    }) => request.post<InvoiceType>('/api/intelligent/api/ebill/info', params),
  ),
  透传字段: createApiHooks(
    (params: {
      transformCode: string;
      Identify?: string;
      IdType?: string;
      patId?: string;
      patCardNo?: string;
      patCardType?: string | number;
      time?: string;
      nullah_number?: string;
      resourceId?: string;
      beginTime?: string;
      endTime?: string;
      type?: string;
      pictureUrl1?: string;
      pictureUrl2?: string;
      showLoading?: 'loading' | 'false';
      VisitId?: string;
      DocId?: string;
      patHisNo?: string;
      deptCode?: string;
      ids?: string;
      startDate?: string;
      endDate?: string;
      hisId?: string;
      cardNo?: string;
      cardType?: string;
      authToken?: string;
      patType?: number;
      patName?: string;
      patSex?: string;
      patAge?: number;
      patMobile?: string;
      patIdNo?: string;
      payTime?: string;
      feeCode?: string;
      doctorCode?: string;
      scheduleDate?: string;
      timeFlag?: string;
      regFee?: string;
    }) =>
      request.post<FacadeType>('/api/ihis/his/facade/server', params, {
        headers: {
          'x-showToast': 'false',
        },
      }),
  ),
  蚂蚁森林能量获取: createApiHooks((params: { scene: '1' | '2' }) =>
    request.post<FacadeType>(
      '/api/intelligent/api/alipay/ant/send-energy',
      params,
      {
        headers: {
          'x-showToast': 'false',
        },
      },
    ),
  ),
  查询配置列表: createApiHooks(
    (params: { whereUse: string; whereShowCode: string; status: number }) =>
      request.get<CustomerTypeLIst>('/api/intelligent/api/customer_service', {
        params,
      }),
  ),
  就诊记录列表查询: createApiHooks(
    (params: {
      hisId?: string;
      patCardNo?: string;
      patHisId?: string;
      startDate?: string;
      endDate?: string;
      recordType?: string | number;
    }) =>
      request.get<VisitRecordList>('/api/intelligent/ihis/visit/record', {
        params,
      }),
  ),
  门诊就诊记录详情: createApiHooks(
    (params: { recordId?: string; extFields?: any }) =>
      request.get<outPatientRecord>(
        '/api/intelligent/ihis/visit/record/outpatient',
        {
          params,
        },
      ),
  ),
  住院就诊记录详情: createApiHooks(
    (params: { recordId?: string; extFields?: string }) =>
      request.get<outPatientRecord>(
        '/api/intelligent/ihis/visit/record/inhospital',
        {
          params,
        },
      ),
  ),
  门诊结算详情: createApiHooks(
    (params: { recordId?: string; feeType?: string }) =>
      request.get<AccountsRecord>(
        '/api/intelligent/ihis/visit/record/outpatient/settlement',
        {
          params,
        },
      ),
  ),
  住院结算详情: createApiHooks(
    (params: { recordId?: string; feeType?: string }) =>
      request.get<AccountsRecord>(
        '/api/intelligent/ihis/visit/record/inhospital/settlement',
        {
          params,
        },
      ),
  ),
  注意事项内容查询: createApiHooks(
    (params: { noticeType?: string; noticeMethod?: string }) =>
      request.get<InfoType>('/api/kaiqiao/content/notice/info', {
        params,
        headers: {
          'x-showLoading': 'false',
        },
      }),
  ),
  获取首页配置信息: createApiHooks(() =>
    request.get<ConfigType>(
      '/api/intelligent/ihis/intelligent/home/page/config',
    ),
  ),
  ///api/intelligent/ihis/queue
  排队进度查询: createApiHooks(
    (params: {
      patCardNo?: string;
      patHisId?: string;
      queueType: string; //visitation-就诊队列；examine-检查队列；inspect-检验队列；medicine-取药队列
      patHisNo?: string;
    }) =>
      request.get<{ data: { recordList: any[] } } & API.ResponseDataType>(
        '/api/intelligent/ihis/queue/info',
        {
          params,
        },
      ),
  ),
};
