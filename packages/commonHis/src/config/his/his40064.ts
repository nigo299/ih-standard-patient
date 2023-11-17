import HisBase from './hisBase';

export default class His40064 extends HisBase {
  constructor() {
    super('40064');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-市辖区-沙坪坝区',
      isRegChangePhone: false,
    });
  }
}
