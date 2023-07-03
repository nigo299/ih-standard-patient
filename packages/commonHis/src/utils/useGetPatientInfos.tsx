import patientState from '@/stores/patient';

const useGetPatientInfos = (patientId: string) => {
  const { bindPatientList } = patientState.useContainer();
  console.log('patientId', patientId);
  const patient = bindPatientList?.find(
    (item) => Number(item.patientId) === Number(patientId),
  );
  if (!patient) {
    return { patientName: undefined };
  }
  return patient;
};
export default useGetPatientInfos;
