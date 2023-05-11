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
      microSitesEntries: 'OLD_VIEWS',
      hideBillTime: false,
      regCalendarNumberOfDays: 14,
      showRegSourceTypes: true,
      enableFaceVerify: false,
      showCancelRegTips: false,
      recordMedicalCard: false,
      showChooseDeptDialog: false,
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
  /** OLD_VIEWS:只展示医院介绍和科室分布，SHOW_MORE_VIEWS:展示更多的功能入口 */
  microSitesEntries: 'OLD_VIEWS' | 'SHOW_MORE_VIEWS';
  /** 是否隐藏门诊缴费单的开单时间（口腔医院无法获取开单时间故不进行展示）*/
  hideBillTime: boolean;
  /** 控制选择挂号时间时显示的天数*/
  regCalendarNumberOfDays: number;
  /** 控制选择挂号时间页面是否展示号别切换的tab*/
  showRegSourceTypes: boolean;
  /** 是否开启人脸识别*/
  enableFaceVerify: boolean;
  /** 是否展示取消挂号时的温馨提示*/
  showCancelRegTips: boolean;
  /** 建档是否选填医保卡号*/
  recordMedicalCard: boolean;
  /** 是否展示科室选择界面的挂号须知弹窗*/
  showChooseDeptDialog: boolean;
};
