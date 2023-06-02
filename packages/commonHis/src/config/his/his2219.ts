import HisBase from './hisBase';

export default class His2219 extends HisBase {
  constructor() {
    super('2219');
    this.config = Object.assign(this.config, {
      defaultAddress: '重庆市-市辖区-渝中区',
      microSitesEntries: 'SHOW_MORE_VIEWS',
      clinicPayBatchType: 'SINGLE',
      hideBillTime: true,
      regCalendarNumberOfDays: 7,
      showRegSourceTypes: false,
      enableFaceVerify: true,
      showCancelRegTips: true,
      recordMedicalCard: true,
      showChooseDeptDialog: true,
      registerDoctorTagType: 'SHOW_DOC_TAGS',
      showFullDoc: true,
      showFullSourceDay: true,
      registerCardChange: '2219_STYLE',
    });
  }
}
