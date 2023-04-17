import HisBase from './hisBase';

export default class His40009 extends HisBase {
  showPrice: boolean;
  isBatchPay: boolean;
  constructor() {
    super('40009');
    this.showPrice = true;
    this.isBatchPay = false;
  }
}
