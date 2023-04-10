import { redirectTo } from 'remax/one';

export default () => {
  window.location.reload();
  redirectTo({
    url: '/pages/home/index',
  });
};
