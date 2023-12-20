export const isDev = process.env.NODE_ENV !== 'production';
export const PLATFORM = process.env.REMAX_PLATFORM;
export const THEME_COLOR = '#008dd9';
export const THEME_COLOR2 = '#008dd9';
export const STEP_COLOR = '#ffffff';
export const IMAGE_DOMIN = `${
  isDev
    ? '/images'
    : PLATFORM === 'web'
    ? process.env.REMAX_APP_IMAGE_DOMIN
    : 'https://tihs.cqkqinfo.com/patients/p40012-his/images'
}`;
export const STEP_ITEMS = ['选择院区', '选择科室', '选择医生', '选择时间'];
export const HOSPITAL_NAME = '双桥经开区人民医院';
export const HIS_ID = '40012';
export const HOSPITAL_TEL = '023-43780184';
export const REQUEST_QUERY = {
  hisId: 40012,
  platformId: PLATFORM === 'ali' ? 4001202 : 4001201,
  platformSource:
    process.env.REMAX_APP_PLATFORM === 'app'
      ? 10
      : PLATFORM === 'web'
      ? 1
      : PLATFORM === 'wechat'
      ? 7
      : 2, // 1公众号  2支付宝小程序 7微信小程序 10 医保线上App
};
// 是否需要开启问卷调查
export const NUCLEIC_INVESTIGATION = PLATFORM === 'ali' ? false : false;
// 预检分诊小程序appid
export const NUCLEIC_APPID =
  PLATFORM === 'ali' ? '2021003128602151' : 'wx3ff25d8c71ecd5db';
export const NUCLEIC_HID = 9;
// 是否需要订单详情中电子发票
export const ORDER_INVOICE = false;
// 是否开启二级科室
export const CHILDREN_DEPTLIST = false;
// 门诊缴费是否支持全选(false只能单选,true会显示全选按钮)
export const PAYMENT_SELECTALL =
  process.env.REMAX_APP_PLATFORM === 'app' ? false : true;
// 门诊缴费必须全部支付
export const PAYMENT_SELECTALL_PAY = true;
// 是否启用H5支付(flase为立即缴费小程序支付)
export const H5_PAY = false;
// 是否有支付宝小程序
export const IS_ALIPAY = false;
// 支付宝小程序appid
export const APPID = PLATFORM === 'ali' ? '' : '';
// 是否开启意见反馈（小桥医助小程序）
export const IS_FEEDBACL = PLATFORM === 'web';
export const IS_DEPT = false; // PLATFORM !== 'ali'
// https://lbs.amap.com/console/show/picker
export const ADDRESS = {
  longitude: 105.768876,
  latitude: 29.489483,
  name: HOSPITAL_NAME,
  address: '重庆市大足区双桥经开区车城大道6号',
};
export const WEB_ADDRESS = `https://mapapi.qq.com/web/mapComponents/locationMarker/v/index.html?marker=coord:${ADDRESS.latitude},${ADDRESS.longitude};title:${HOSPITAL_NAME};addr:${ADDRESS.address}&key=TKUBZ-D24AF-GJ4JY-JDVM2-IBYKK-KEBCU&referer=myapp&ch=uri-api&ADTAG=uri-api.myapp`;

export const IDTYPES = [
  { dictValue: '身份证', sortNo: 1, dictKey: '1' },
  { dictValue: '港澳证件', sortNo: 2, dictKey: '2' },
  { dictValue: '台湾证件', sortNo: 3, dictKey: '3' },
  { dictValue: '护照', sortNo: 4, dictKey: '4' },
  { dictValue: '证件', sortNo: 5, dictKey: '100' },
  { dictValue: '出生医学证明', sortNo: 6, dictKey: '8' },
];

/**
 * 前后端业务类型映射关系
 * @type 1：预约挂号缴费 2：当天挂号缴费 3：住院押金缴费 4：门诊缴费 5 : 就诊卡充值 6 : 取号
 * 支付成功需要跳转的详情页
 * @detail
 */

export const PAY_TYPE = {
  DBGH: {
    title: '当天挂号缴费',
    detail: '/pages2/register/order-detail/index',
    type: 2,
  },
  YYGH: {
    title: '预约挂号缴费',
    detail: '/pages2/register/order-detail/index',
    type: 1,
  },
  ZYYJBJ: {
    title: '住院押金缴费',
    detail: '/pages2/inhosp/order-detail/index',
    type: 3,
  },
  MZJF: {
    title: '门诊缴费',
    detail: '/pages2/payment/order-detail/index',
    type: 4,
  },
};
