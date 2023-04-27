import { InhospPatientType } from '@/apis/inhosp';

interface HooksProps {
  liveData?: InhospPatientType;
}

export default ({ liveData }: HooksProps) => {
  return liveData?.extFields;
};
