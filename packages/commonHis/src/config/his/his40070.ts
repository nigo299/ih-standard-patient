import HisBase from './hisBase';

export default class His40070 extends HisBase {
  constructor() {
    super('40070');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-市辖区-渝中区',
      clinicPayBatchType: 'SINGLE',
      RegisterNoticeText: '热烈庆祝重庆市渝中区妇幼保健院智慧医院上线了!',
    });
  }
}
