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
        '即日起至2023年12月31日，60岁以上人群普通门诊免挂号费，专家门诊5折优惠；其余人群下午及周末普通门诊免费，专家门诊5折优惠（以上活动限自费）。',
    });
  }
}
