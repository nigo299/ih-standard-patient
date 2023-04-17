export default class BaseHis {
  hisId?: string;
  /**0:展示余号与价格，1:展示原价与现价 */
  showPrice?: boolean;
  /**是否支持合单支付，(order-list/order-item)有不同的UI与逻辑 */
  isBatchPay?: boolean;
  constructor(hisId?: string) {
    this.hisId = hisId;
  }
}
