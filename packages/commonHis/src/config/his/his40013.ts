import HisBase from './hisBase';

export default class His40011 extends HisBase {
  constructor() {
    super('40013');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-市辖区-大足区',
      clinicPayBatchType: 'SINGLE',
      isOldManRegFree: true,
    });
  }
}
