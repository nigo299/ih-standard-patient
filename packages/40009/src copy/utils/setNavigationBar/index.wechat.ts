import { setNavigationBarColor, setNavigationBarTitle } from 'remax/wechat';
import { NavigationBarOptions } from './index';
import { THEME_COLOR } from '@/config/constant';

export default (options: NavigationBarOptions) => {
  setNavigationBarTitle({
    title: options.title || '',
  });
  setNavigationBarColor({
    backgroundColor: options.backgroundColor || THEME_COLOR,
    frontColor: options.fontColor || '#ffffff',
  });
};
