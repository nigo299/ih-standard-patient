import { makePhoneCall } from 'remax/wechat';

export default (phoneNumber: string) => {
  makePhoneCall({
    phoneNumber,
  });
};
