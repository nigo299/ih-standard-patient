import HisBase from './hisBase';

export default class His40009 extends HisBase {
  constructor() {
    super('40009');
    this.config = Object.assign(this.config, {
      showPrice: true,
      registerDoctorTagType: 'ORIGINAL_AND_CURRENT_PRICE',
      clinicPayBatchType: 'SINGLE',
      showMedicalModal: true,
      showTodayRegisterSourceInReserve: true,
      showCalenderInTodayRegister: false,
      showSelectTypeInTodayRegister: false,
      registerNoticeText:
        '重要通知：重庆松山医院金秋惠民活动开始啦！2023.9.29-2023.10.6门诊挂号免费，门诊放射、超声检查8折（限自费）。',
    });
  }
}
