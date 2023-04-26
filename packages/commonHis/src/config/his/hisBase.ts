import { HOSPITAL_NAME } from '@/config/constant';
export default class BaseHis {
  /**0:展示余号与价格，1:展示原价与现价 */
  hisId?: string;
  config: StaticConfig;
  constructor(hisId?: string) {
    this.hisId = hisId;
    this.config = {
      defaultAddress: '重庆市-市辖区-沙坪坝区',
      registerNoticeText: `热烈庆祝${HOSPITAL_NAME}开通啦！`,
      registerDoctorTagType: 'SOURCE_AND_PRICE',
      clinicPayBatchType: 'BATCH',
      showMedicalModal: false,
      showTodayRegisterSourceInReserve: false,
      showCalenderInTodayRegister: true,
      showSelectTypeInTodayRegister: true,
      showNucleicText: false,
    };
  }
}
type StaticConfig = {
  /** 建档的默认地址 */
  defaultAddress: string;
  /** 医生选择界面的滚动广播文字 */
  registerNoticeText: string;
  /** SOURCE_AND_PRICE:展示号源数量与价格，ORIGINAL_AND_CURRENT_PRICE:展示原价与现价 */
  registerDoctorTagType: 'SOURCE_AND_PRICE' | 'ORIGINAL_AND_CURRENT_PRICE';
  /** 控制门诊缴费是否支持合单支付: BATCH: 合单支付， SINGLE: 单笔支付，（order-list、order-detail对应不同的ui与逻辑） */
  clinicPayBatchType: 'SINGLE' | 'BATCH';
  /** 支付界面是否显示医保支付弹窗 */
  showMedicalModal: boolean;
  /** 预约挂号中是否显示当日号源 */
  showTodayRegisterSourceInReserve: boolean;
  /** 当日挂号是否显示日期组件*/
  showCalenderInTodayRegister: boolean;
  /** 当日挂号是否显示按日期挂号和按医生挂号组件*/
  showSelectTypeInTodayRegister: boolean;
  /** 核酸选择套餐界面是否展示提示文字*/
  showNucleicText: boolean;
};
