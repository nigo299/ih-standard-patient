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
        '重要通知：即日起-2023年12月31日（工作日下午及周末）门诊普通诊察费免费，专家诊察费5折优惠；60岁以上人群享受全天门诊普通诊察费免费，专家诊察费5折优惠。',
    });
  }
}
