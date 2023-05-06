import { useMemo } from 'react';
import { OrderDetailType } from '@/apis/register';

export default ({ orderDetail }: { orderDetail: OrderDetailType }) => {
  const extFields = useMemo(() => {
    try {
      return { agtOrdNum: orderDetail?.agtOrdNum || '' };
    } catch {
      return {};
    }
  }, [orderDetail]);
  return extFields;
};
