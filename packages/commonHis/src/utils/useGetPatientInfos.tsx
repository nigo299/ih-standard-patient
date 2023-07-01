import patientState from '@/stores/patient';
import globalState from '@/stores/global';
import { decrypt } from '@/utils';
const useGetPatientInfos = (patientId: string) => {
  const { bindPatientList, getPatientList } = patientState.useContainer();
  const { decryptPatName } = globalState.useContainer();
  console.log('patientId', patientId);
  const patient = bindPatientList?.find(
    (item) => Number(item.patientId) === Number(patientId),
  );
  let outputName;
  if (!patient) {
    // getPatientList();
    return { name: undefined };
  }
  if (Number(patient.patientId) === Number(patientId)) {
    if (!decryptPatName || decryptPatName === 'false') {
      outputName = patient?.patientName;
    }

    if (decryptPatName || decryptPatName === 'true') {
      outputName = decrypt(patient?.encryptPatientName);
    }
  }

  return { name: outputName };
};
export default useGetPatientInfos;
