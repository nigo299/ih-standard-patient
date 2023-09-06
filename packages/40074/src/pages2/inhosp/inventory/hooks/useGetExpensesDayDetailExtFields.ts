import { InhospPatientType } from '@/apis/inhosp';
import dayjs from 'dayjs';
interface HooksProps {
  liveData?: InhospPatientType;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGetExpensesDayDetailExtFields = (_: HooksProps) => {
  return undefined;
};

export const defaultExpensesDayCheckDate = dayjs()
  .subtract(1, 'day')
  .format('YYYY-MM-DD');
