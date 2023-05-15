// import { WEB_ADDRESS, PLATFORM, ADDRESS } from '@/config/constant';
// import { openLocation } from 'remax/ali';

// export default () => {
//   if (PLATFORM === 'ali') {
//     openLocation(ADDRESS);
//   } else {
//     window.location.href = WEB_ADDRESS;
//   }
// };
import { WEB_ADDRESS } from '@/config/constant';

export default () => (window.location.href = WEB_ADDRESS);
