import HisBase from './hisBase';

export default class His40011 extends HisBase {
  constructor() {
    super('40011');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-县-彭水苗族土家族自治县',
      clinicPayBatchType: 'JOINT',
    });
  }
}
