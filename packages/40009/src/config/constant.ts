export const isDev = process.env.NODE_ENV !== 'production';
export const PLATFORM = process.env.REMAX_PLATFORM;
export const THEME_COLOR = '#CF000E';
export const THEME_COLOR2 = '#FF9743';
export const STEP_COLOR = '#80CFD6';
export const STEP_ITEMS = ['选择院区', '选择科室', '选择医生', '选择时间'];
export const IMAGE_DOMIN = `${
  isDev
    ? '/images'
    : PLATFORM === 'web'
    ? process.env.REMAX_APP_IMAGE_DOMIN
    : 'https://tihs.cqkqinfo.com/patients/p40009-his/images'
}`;
export const HOSPITAL_NAME = '重庆松山医院';
export const HOSPITAL_TEL = '023-63110120';
export const REQUEST_QUERY = {
  hisId: 40009,
  platformId: PLATFORM === 'ali' ? 4000902 : 4000903,
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
export const NUCLEIC_INVESTIGATION = false;
// 预检分诊小程序appid
export const NUCLEIC_APPID =
  PLATFORM === 'ali' ? '2021003128602151' : 'wx3ff25d8c71ecd5db';
export const NUCLEIC_HID = 9;
// 是否需要订单详情中电子发票
export const ORDER_INVOICE = false;
// 是否开启二级科室
export const CHILDREN_DEPTLIST = true;
// 门诊缴费是否支持全选(false只能单选,true会显示全选按钮)
export const PAYMENT_SELECTALL =
  process.env.REMAX_APP_PLATFORM === 'app' ? false : false;
// 门诊缴费必须全部支付
export const PAYMENT_SELECTALL_PAY = false;
// 是否启用H5支付(flase为立即缴费小程序支付)
export const H5_PAY = false;
// 是否有支付宝小程序
export const IS_ALIPAY = true;
// 支付宝小程序appid
export const APPID = PLATFORM === 'ali' ? '2021002125656335' : '';
// 是否开启意见反馈（小桥医助小程序）
export const IS_FEEDBACL = PLATFORM !== 'ali';

// https://lbs.amap.com/console/show/picker
export const ADDRESS = {
  longitude: 106.504711,
  latitude: 29.619515,
  name: HOSPITAL_NAME,
  address: '两江幸福广场D区对面',
};
export const WEB_ADDRESS = `https://mapapi.qq.com/web/mapComponents/locationMarker/v/index.html?marker=coord:${ADDRESS.latitude},${ADDRESS.longitude};title:${HOSPITAL_NAME};addr:${ADDRESS.address}&key=TKUBZ-D24AF-GJ4JY-JDVM2-IBYKK-KEBCU&referer=myapp&ch=uri-api&ADTAG=uri-api.myapp`;

export const IDTYPES = [
  { dictValue: '身份证', sortNo: 1, dictKey: '1' },
  { dictValue: '港澳证件', sortNo: 2, dictKey: '2' },
  { dictValue: '台湾证件', sortNo: 3, dictKey: '3' },
  { dictValue: '护照', sortNo: 4, dictKey: '4' },
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
