import HisBase from './hisBase';

export default class His2219 extends HisBase {
  constructor() {
    super('2219');
    this.config = Object.assign(this.config, {
      defaultAddress: ['500000000000', '500100000000', '500103000000'],
      microSitesEntries: 'SHOW_MORE_VIEWS',
      clinicPayBatchType: 'SINGLE',
      showBillTime: false,
      regCalendarNumberOfDays: 8,
      showRegSourceTypes: false,
      enableFaceVerify: true,
      showCancelRegTips: true,
      recordMedicalCard: true,
      showChooseDeptDialog: true,
      registerDoctorTagType: 'SHOW_DOC_TAGS',
      showFullDoc: true,
      showFullSourceDay: true,
      registerCardChange: '2219_STYLE',
      showRegisterNoticeScrollText: false,
      isMergeIndex: true,
      isOldManRegFree: true,
    });
  }
}
