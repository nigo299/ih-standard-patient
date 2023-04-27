import { useMemo } from 'react';
import { OrderDetailType } from '@/apis/register';

export default ({ orderDetail }: { orderDetail: OrderDetailType }) => {
  const extFields = useMemo(() => {
    try {
      return JSON.parse(orderDetail?.extFields || '{}');
    } catch {
      return {};
    }
  }, [orderDetail]);
  return extFields;
};
