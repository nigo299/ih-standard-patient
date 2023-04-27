import useApi from '@/apis/register';

export default async ({
  orderId,
  cancelVal,
  cancelValStorage,
  payAuthNo,
  extFields,
}: {
  orderId: string;
  cancelVal: string;
  cancelValStorage: any;
  payAuthNo: any;
  extFields: any;
}) => {
  let params;
  if (!!extFields) {
    params = {
      orderId,
      cancelReason: cancelVal || cancelValStorage || '',
      payAuthNo: payAuthNo || '',
      extFields,
    };
  } else {
    params = {
      orderId,
      cancelReason: cancelVal || cancelValStorage || '',
      payAuthNo: payAuthNo || '',
    };
  }
  const { code, msg } = await useApi.取消锁号.request(params);
  return {
    code,
    msg,
  };
};
