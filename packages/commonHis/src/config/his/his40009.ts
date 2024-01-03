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
        '2024年1月1日至4月30日，60岁以上人群普通号免费，专家号、高级号5折；其余人群工作日普通号5折，周末普通号免费，专家号、高级号5折（限自费）。',
    });
  }
}
