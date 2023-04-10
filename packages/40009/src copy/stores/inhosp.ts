import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { InhospPatientType } from '@/apis/inhosp';

export default createContainer(() => {
  const [inhospPatientInfo, setInhospPatientInfo] = useState<InhospPatientType>(
    {
      admissionNum: '',
      balance: 0,
      deptName: '',
      extFields: '',
      hisId: '',
      hisName: '',
      idNo: '',
      idType: 0,
      inDate: '',
      inhospitalRecordId: '',
      mobile: '',
      otherDesc: '',
      outDate: '',
      bedNo: '',
      consumeFee: 0,
      inhospitalNo: '',
      patCardNo: '',
      patCardType: 0,
      patientId: '',
      patientName: '',
      status: '',
      totalFee: 0,
      patientSex: 'M',
      patientAge: 0,
    },
  );
  return {
    inhospPatientInfo,
    setInhospPatientInfo,
  };
});
