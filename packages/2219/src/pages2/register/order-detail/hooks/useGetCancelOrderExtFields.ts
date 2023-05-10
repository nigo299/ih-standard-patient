import { useMemo } from 'react';
import { OrderDetailType } from '@/apis/register';

export default ({ orderDetail }: { orderDetail: OrderDetailType }) => {
  const extFields = useMemo(() => {
    return { agtOrdNum: orderDetail?.agtOrdNum || '' };
  }, [orderDetail]);
  return extFields;
};
