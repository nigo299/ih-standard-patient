import HisBase from './hisBase';

export default class His40009 extends HisBase {
  constructor() {
    super('40009');
    this.config = Object.assign(this.config, {
      showPrice: true,
      registerDoctorTagType: 'SOURCE_AND_PRICE',
      clinicPayBatchType: 'SINGLE',
    });
  }
}