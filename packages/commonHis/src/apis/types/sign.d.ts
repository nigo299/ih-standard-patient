export interface WaitSignListItem {
  beginTime: string; //'分时开始时间(格式：24HH:MI)';
  endTime: string; //分时结束时间(格式：24HH:MI)';
  patCardNo: string; //患者就诊卡号';
  patCardType: string; //诊疗卡类型(院内诊疗卡-21;社保卡-22;医保卡-23;区域健康卡-24;)';
  patId: string; //病人id';
  patIdType: string; //证件类型(1-身份证 2-港澳居民身份证 3-台湾居民身份证 4-护照)';
  patIdNo: string; //证件号码';
  patName: string; //患者姓名';
  patMobile: string; //手机号码';
  patAge: string; //年龄';
  patGender: string; //性别(0：女；1：男)';
  deptCode: string; //科室代码';
  deptName: string; //科室名称';
  doctorCode: string; //医生代码';
  doctorName: string; //医生姓名';
  scheduleDate: string; //号源日期(格式：YYYY-MM-DD)';
  timeFlag: string; //时段(1：上午2：下午3：晚上)';
  regFee: string; //挂号费(单位：分)';
  orderSource: string; //预约来源';
  hisOrdNum: string; //医院订单号';
  districtCode: string;
  payTime: string; //交易时间(格式：YYYY-MM-DD 24HH:MI:SS)';
  status: number; //挂号状态(1：未支付未签到 0：已支付未签到 2：已签到未接诊 3：已接诊 4：已取消)';
}
export interface WaitSignReq {
  signFeatures: string; //1 挂号，2 检查，3 检验
  patId: string; //病人id 挂号功能、检验功能 必传
  deptCode?: string;
  doctorCode?: string;
  cardType: string; //卡类型。检查功能
  cardNo: string; //cardNo 卡号码。检查功能
  currentStateList?: string; //要查询的当前状态（-1：已作废，0-已开立，1-已预约，2-已登记，3-已检查，4-报告已完成）。检查功能
  stateResult?: string; //状态编码。检查功能
}
export interface SendSignReq {
  signFeatures: string; //1 挂号，2 检查，3 检验
  signType: string; //签到类型。1 蓝牙，2 GPS定位
  districtCode: string; //院区编码
  lng?: string; //用户当前经度，定位签到必需
  lat?: string; //用户当前维度，定位签到必需
  // 👇"{\"sectionName\":\"\", \"deviceId\":\"\", \"did\":\"\",\"map\":\"\", \"deptName\":\"\"}"
  blueTooth?: string; //蓝牙信息，蓝牙签到必需，json字符串
  hisOrdNum?: string; //挂号单号。挂号签到必需
  dev?: string; //位置标识
  signIn?: string; //打卡信息。检查签到必需，检查列表中返回数据，json字符串
  patId?: string; //患者ID，检验签到必需
  position?: string; //打卡院区，检验签到中蓝牙签到必需（冉家坝为1）
}
