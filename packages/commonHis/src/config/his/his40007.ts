import HisBase from './hisBase';

export default class His40007 extends HisBase {
  constructor() {
    super('40007');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-市辖区-渝中区',
    });
  }
}
