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
        '重要通知：重庆松山医院智慧医院界面于4月26日升级改版，使用过程中如有任何疑问请联系客服（电话：19922878076）反馈，我们将及时处理您的需求，感谢您的支持！',
    });
  }
}
