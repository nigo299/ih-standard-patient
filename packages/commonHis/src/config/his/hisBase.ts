export default class BaseHis {
  /**0:展示余号与价格，1:展示原价与现价 */
  hisId?: string;
  config: StaticConfig;
  constructor(hisId?: string) {
    this.hisId = hisId;
    this.config = {
      defaultAddress: '重庆市-市辖区-沙坪坝区',
      defaultScrollBarText: '',
      registerDoctorTagType: 'SOURCE_AND_PRICE',
      clinicPayBatchType: 'BATCH',
      showMedicalModal: false,
    };
  }
}
type StaticConfig = {
  /** 建档的默认地址 */
  defaultAddress: string;
  /** 医生选择界面的滚动广播文字 */
  defaultScrollBarText: string;
  /** SOURCE_AND_PRICE:展示号源数量与价格，ORIGINAL_AND_CURRENT_PRICE:展示原价与现价 */
  registerDoctorTagType: 'SOURCE_AND_PRICE' | 'ORIGINAL_AND_CURRENT_PRICE';
  /** 控制门诊缴费是否支持合单支付: BATCH: 合单支付， SINGLE: 单笔支付，（order-list、order-detail对应不同的ui与逻辑） */
  clinicPayBatchType: 'SINGLE' | 'BATCH';
  /** 支付界面是否显示医保支付弹窗 */
  showMedicalModal: boolean;
};
