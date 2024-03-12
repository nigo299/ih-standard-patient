import HisBase from './hisBase';

export default class His40006 extends HisBase {
  constructor() {
    super('40006');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-市辖区-合川区',
      clinicPayBatchType: 'SINGLE',
    });
  }
}
