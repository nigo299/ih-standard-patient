import { IMAGE_DOMIN } from './constant';
import openLocation from '@/utils/openLocation';

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
];

export const mineNavListConfig = [
  {
    title: '报告及影像查询',
    url: '/pages/collect/index',
    image: `${IMAGE_DOMIN}/mine/gzsc.png`,
  },
  {
    title: '全院挂号记录',
    url: '/pages2/register/order-list/index',
    image: `${IMAGE_DOMIN}/mine/ghdd.png`,
  },
  {
    title: '附三院挂号记录',
    url: 'https://m.hsyuntai.com/med/hp/hospitals/100039/hos/user/personal',
    image: `${IMAGE_DOMIN}/mine/gzsc.png`,
  },
  {
    title: '大学城挂号记录',
    url: 'https://appsp.zcareze.com/appsp/h5/authorize?appid=wx5da34ab726d31047&authType=0&authMode=userinfo&address=page%3DhomePage%2Fcustom%2Frfyah65atp7i8kybfke23kxmh48nzaz8',
    image: `${IMAGE_DOMIN}/mine/gzsc.png`,
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
  {
    title: '调查问卷',
    url: '',
    image: `${IMAGE_DOMIN}/mine/yjfk.png`,
    open: false,
    onClick: () =>
      (window.location.href = 'https://wj.qq.com/s2/8938221/c4b1/'),
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
