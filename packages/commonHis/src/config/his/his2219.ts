import HisBase from './hisBase';

export default class His2219 extends HisBase {
  constructor() {
    super('2219');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-市辖区-渝中区',
    });
  }
}