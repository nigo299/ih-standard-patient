import { IMAGE_DOMIN, PLATFORM } from './constant';
import openLocation from '@/utils/openLocation';
import storage from '@/utils/storage';
import { showToast } from '@kqinfo/ui';
export const tabBarConfig = [
  {
    title: '首页',
    url: '/pages/home/index',
    image: './tabBar/home.png',
    activeImage: './tabBar/home_active.png',
  },
  {
    title: '我的',
    url: '/pages/mine/index/index',
    image: './tabBar/mine.png',
    activeImage: './tabBar/mine_active.png',
  },
];

export const mineMainNavConfig = [
  {
    title: '挂号订单',
    url: '/pages2/register/order-list/index',
    image: `${IMAGE_DOMIN}/mine/ghdd.png`,
  },
  {
    title: '门诊缴费订单',
    url: '/pages2/payment/paymented-list/index',
    image: `${IMAGE_DOMIN}/mine/mzjfdd.png`,
  },
  {
    title: '住院预缴订单',
    url: '/pages2/inhosp/order-list/index',
    image: `${IMAGE_DOMIN}/mine/zyyjdd.png`,
  },
  {
    title: '体检预约订单',
    image: `${IMAGE_DOMIN}/mine/tjyydd.png`,
    onTap: () => {
      if (PLATFORM === 'web') {
        window.location.href = `${
          window.location.href.includes('tihs')
            ? 'https://healthapp.cqkqinfo.com/next-H5App-p40064/#/pages/order/index'
            : 'https://healthmall.cqkqinfo.com/H5App-p40064/#/pages/order/index'
        }?openId=${storage.get('openid')}`;
      } else {
        showToast({
          title: '功能开发中，敬请期待',
          icon: 'none',
        });
      }
    },
  },
];

export const mineNavListConfig = [
  {
    title: '就诊记录',
    url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/diagnosis/order-list/index',
    image: `${IMAGE_DOMIN}/mine/jzyj.png`,
  },
  {
    title: '关注/收藏',
    url: '/pages/collect/index',
    image: `${IMAGE_DOMIN}/mine/gzsc.png`,
  },
  {
    title: '意见反馈',
    url: '/pages2/feedback/feedback-list/index',
    image: `${IMAGE_DOMIN}/mine/yjfk.png`,
    open: false,
  },
];

export const inhospMoneys = [
  {
    key: '￥500.00',
    value: 500,
  },
  {
    key: '￥1000.00',
    value: 1000,
  },
  {
    key: '￥1500.00',
    value: 1500,
  },
  {
    key: '￥2000.00',
    value: 2000,
  },
];

export const micrositeMainNavConfig = [
  {
    title: '医院介绍',
    url: '/pages/microsite/hospital-summary/index',
    image: `${IMAGE_DOMIN}/microsite/yyjs.png`,
  },
  {
    title: '科室介绍',
    url: '/pages/microsite/dept-summary/index',
    image: `${IMAGE_DOMIN}/microsite/ksjs.png`,
  },
  {
    title: '医生介绍',
    url: '/pages/microsite/doctor-summary/index',
    image: `${IMAGE_DOMIN}/microsite/ysjs.png`,
  },
  {
    title: '楼群分布',
    url: '',
    image: `${IMAGE_DOMIN}/microsite/lqfb.png`,
  },
  {
    title: '科室分布',
    url: '',
    image: `${IMAGE_DOMIN}/microsite/ksfb.png`,
  },
  {
    title: '来院导航',
    url: '',
    image: `${IMAGE_DOMIN}/microsite/lydh.png`,
    onClick: () => openLocation(),
  },
  {
    title: '健康宣教',
    url: '',
    image: `${IMAGE_DOMIN}/microsite/jkxj.png`,
  },
  {
    title: '医院动态',
    url: '/pages/microsite/hospital-article/index',
    image: `${IMAGE_DOMIN}/microsite/yydt.png`,
  },
];
