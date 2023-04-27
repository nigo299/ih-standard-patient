import useApi, { InhospPatientType } from '@/apis/inhosp';

export default ({
  liveData,
  patientId,
  selectDate,
}: {
  liveData?: InhospPatientType;
  patientId: string;
  selectDate: string;
  extFields: any;
}) => {
  console.log(liveData, 'liveData');

  const {
    loading: dayLoading,
    data: { data: inventoryDetail },
  } = useApi.查询住院一日清单({
    initValue: {
      data: {
        items: [],
      },
    },
    params: {
      admissionNum: liveData?.admissionNum as string,
      patientId,
      beginDate: selectDate,
      endDate: selectDate,
      extFields: liveData?.extFields,
    },
    needInit: true,
  });
  return {
    dayLoading,
    inventoryDetail,
  };
};
