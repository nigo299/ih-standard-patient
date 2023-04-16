export default class BaseHis {
  hisId?: string;
  showPrice?: boolean; //是否展示选择医生界面的挂号价格
  isBatchPay?: boolean; //是否支持合单支付，(order-list/order-item)有不同的UI与逻辑
  constructor(hisId?: string) {
    this.hisId = hisId;
  }
}
