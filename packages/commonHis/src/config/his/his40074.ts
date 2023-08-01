import HisBase from './hisBase';

export default class His40074 extends HisBase {
  constructor() {
    super('40074');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-县-石柱土家族自治县',
      clinicPayBatchType: 'SINGLE',
      patCardNoValue: 'patHisNo',
    });
  }
}
