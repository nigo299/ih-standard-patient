export default class BaseHis {
  /**0:展示余号与价格，1:展示原价与现价 */
  hisId?: string;
  /**
   *医院的个性化配置.
   * `showPrice` 0:展示号源数量与价格，1:展示原价与现价.
   * `isBatchPay` 控制门诊缴费是否支持合单支付，（order-list、order-detail对应不同的ui与逻辑）.
   */
  config?: {
    showPrice?: boolean;
    isBatchPay?: boolean;
  };
  constructor(hisId?: string) {
    this.hisId = hisId;
    this.config = {};
  }
}
