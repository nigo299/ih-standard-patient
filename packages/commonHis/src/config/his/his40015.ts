import HisBase from './hisBase';

export default class His40015 extends HisBase {
  constructor() {
    super('40015');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-市辖区-大渡口区',
      clinicPayBatchType: 'BATCH',
      isOldManRegFree: true,
    });
  }
}
