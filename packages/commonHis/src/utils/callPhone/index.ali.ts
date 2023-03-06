import { makePhoneCall } from 'remax/ali';

export default (phoneNumber: string) => {
  makePhoneCall({
    number: phoneNumber,
  });
};
