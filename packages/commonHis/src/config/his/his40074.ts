import HisBase from './hisBase';

export default class His40074 extends HisBase {
  constructor() {
    super('40074');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-县-梁平区',
      clinicPayBatchType: 'SINGLE',
    });
  }
}
