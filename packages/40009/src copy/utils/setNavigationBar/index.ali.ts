import { setNavigationBar } from 'remax/ali';
import { NavigationBarOptions } from './index';
import { THEME_COLOR } from '@/config/constant';

export default (options: NavigationBarOptions) =>
  setNavigationBar({
    title: options.title || '',
    backgroundColor: options.backgroundColor || THEME_COLOR,
  });
