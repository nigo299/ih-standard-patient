import { InhospPatientType } from '@/apis/inhosp';
import dayjs from 'dayjs';

interface HooksProps {
  liveData?: InhospPatientType;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGetExpensesDayDetailExtFields = (params: HooksProps) => {
  return params.liveData?.extFields;
};
export const defaultExpensesDayCheckDate = dayjs().format('YYYY-MM-DD');
