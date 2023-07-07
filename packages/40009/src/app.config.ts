const pages = [
  'pages/home/index', // 首页
  'pages/mine/index/index', // 个人中心
  'pages/mine/user-info/index', // 个人信息
  'pages/mine/bind-phone/index', // 个人中心
  'pages/mine/revise-phone/index', // 绑定手机
  'pages/collect/index', // 关注/收藏
  'pages/report/report-list/index', // 报告列表
  'pages/report/check-detail/index', // 检查报告详情
  'pages/report/inspect-detail/index', // 检验报告详情
  'pages/queue/index', // 排队进度
  // 'pages/film/index', // 电子胶片
  'pages/auth/getuserinfo/index', // 授权登陆页
  'pages/auth/agreement/index', // 用户授权协议
  'pages/auth/login/index', // 登录注册页
  'pages/microsite/home/index', // 微官网首页
  'pages/microsite/hospital-summary/index', // 医院介绍
  'pages/microsite/dept-summary/index', // 科室介绍
  'pages/microsite/dept-distribute/index', // 科室分布
  'pages/microsite/doctor-summary/index', // 医生介绍
  'pages/microsite/hospital-article/index', // 医院动态
  'pages/microsite/article-detail/index', // 文章详情
  'pages/medical/order-item/index', // 医保费用确认支付以及明细
  'pages/medical/order-detail/index', // 医保支付详情
  'pages/pay/index', // 收银台
  'pages/waiting/index', // 支付结果等待页
  'pages/webview/index', // 第三方业务链接
  'pages/maintain/index', // 系统维护
  'pages/sign/userList/index', // 取药签到选择就诊人
  'pages/sign/sign/index', // 取药签到
  'pages/sign/list/index', // 取药签到列表
];

const subPackages = [
  {
    root: 'pages2',
    pages: [
      'payment/order-list/index', // 门诊待缴费列表
      'payment/order-item/index', // 门诊待缴费详情
      'payment/paymented-list/index', // 门诊已缴费列表
      'payment/order-detail/index', // 门诊缴费订单详情
      'payment/scan/index', // 处方单扫码付
      'inhosp/home/index', // 住院服务首页
      'inhosp/deposit/index', // 住院服务押金预缴
      'inhosp/inventory/index', // 住院服务清单查询
      'inhosp/order-list/index', // 住院服务预缴列表
      'inhosp/order-detail/index', // 住院服务预缴详情
      'register/select-hospital/index', // 挂号选择院区
      'register/department/index', // 挂号选择科室
      'register/search-doctor/index', // 挂号搜索医生
      'register/select-doctor/index', // 挂号选择医生
      'register/choose-doctor/index', // 按医生挂号
      'register/select-time/index', // 挂号选择时间
      'register/dept-summary/index', // 挂号科室介绍
      'register/doctor-summary/index', // 挂号医生介绍
      'register/confirm/index', // 挂号锁号
      'register/order-list/index', // 挂号订单列表
      'register/order-detail/index', // 挂号订单详情
      'usercenter/add-user/index', // 添加就诊人
      'usercenter/user-list/index', // 就诊人列表
      'usercenter/select-user/index', // 选择就诊人
      'usercenter/user-info/index', // 就诊人详情
      'usercenter/revise-user/index', // 修改就诊人信息
      'usercenter/revise-user-phone/index', // 修改就诊人手机号
      'usercenter/revise-user-address/index', // 修改就诊人地址
      'usercenter/ocr-recognition/index', // OCR识别
      'usercenter/face-verify/index', // 人脸识别验证
      // 'signin/chooseType/index', // 签到选择类型页面
      // 'signin/search/index', // 签到查询就诊人页面
      // 'signin/list/index', // 签到列表页面
      // 'signin/detail/index', // 签到详情页面
      'feedback/feedback-list/index', // 意见反馈列表
      'feedback/feedback-detail/index', // 意见反馈详情
      'feedback/feedback-add/index', // 新增意见反馈
      'nucleic/select-combo/index', // 自助核酸检测选择套餐
      'nucleic/upload/index', // 网约出租车核酸上传图片
      'nucleic/confirm/index', // 自助核酸检测确认订单
      'debugger/index', //debug页面
      'clearstorage/index', //清除缓存页面
    ],
  },
  // 适老版页面
  {
    root: 'pages3',
    pages: [
      // 'home/index', // 首页
      // 'search/index', // 搜索
      // 'usercenter/user-manage/index', // 就诊人管理
      // 'usercenter/select-user/index', // 选择就诊人
      // 'usercenter/add-user/index', // 添加就诊人
      // 'usercenter/select-adduser/index', // 选择添加就诊人方式
      // 'usercenter/user-info/index', // 就诊人详情
      // 'usercenter/bind-user/index', // 绑定就诊人
      // 'usercenter/face-verify/index', // 人脸识别验证
      // 'usercenter/ocr-recognition/index', // OCR识别
      // 'payment/order-list/index', // 门诊待缴费列表
      // 'payment/order-item/index', // 门诊待缴费详情
      // 'payment/paymented-list/index', // 门诊已缴费列表
      // 'payment/order-detail/index', // 门诊缴费订单详情
      // 'report/report-list/index', // 报告列表
      // 'report/check-detail/index', // 检查报告详情
      // 'report/inspect-detail/index', // 检验报告详情
      // 'register/order-list/index', // 挂号订单列表
      // 'register/order-detail/index', // 挂号订单详情
      // 'inhosp/home/index', // 住院服务首页
      // 'inhosp/deposit/index', // 住院服务押金预缴
      // 'inhosp/inventory/index', // 住院服务清单查询
      // 'inhosp/order-list/index', // 住院服务预缴列表
      // 'inhosp/order-detail/index', // 住院服务预缴详情
      // 'register/select-hospital/index', // 挂号选择院区
      // 'register/department/index', // 挂号选择科室
      // 'register/select-doctor/index', // 挂号选择医生
      // 'register/select-time/index', // 挂号选择时间
      // 'register/confirm/index', // 挂号锁号
      // 'register/history-depts/index', // 历史科室记录
      // 'register/history-doctors/index', // 历史医生记录
      // 'queue/index', // 排队进度
    ],
  },
];

import { AppConfig as WechatAppConfig } from 'remax/wechat';
import { AppConfig as AliAppConfig } from 'remax/ali';
import { THEME_COLOR } from './config/constant';

export const wechat: WechatAppConfig = {
  pages,
  subpackages: subPackages,
  window: {
    backgroundColor: '#fff',
    backgroundColorBottom: '#fff',
    navigationBarBackgroundColor: THEME_COLOR,
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '',
  },
  tabBar: {
    color: '#bebebe',
    selectedColor: THEME_COLOR,
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index',
        iconPath: './tabBar/home.png',
        selectedIconPath: './tabBar/home_active.png',
      },
      {
        text: '我的',
        pagePath: 'pages/mine/index/index',
        iconPath: './tabBar/mine.png',
        selectedIconPath: './tabBar/mine_active.png',
      },
    ],
  },
  plugins: {
    WechatSI: {
      version: '0.3.4',
      provider: 'wx069ba97219f66d99',
    },
  },
};

export const ali: AliAppConfig = {
  pages: [
    pages,
    subPackages[0].pages.map((item) => `${subPackages[0].root}/${item}`),
    // subPackages.map(
    //   (items) =>
    //     items.root !== 'pages3' &&
    //     items.pages.map((item) => `${items.root}/${item}`),
    // ),
  ].flat(2),
  // remax bug 支付宝小程序分包真机调试报错
  // subPackages,
  tabBar: {
    textColor: '#bebebe',
    selectedColor: THEME_COLOR,
    backgroundColor: '#fff',
    items: [
      {
        pagePath: 'pages/home/index',
        name: '首页',
        icon: './tabBar/home.png',
        activeIcon: './tabBar/home_active.png',
      },
      {
        pagePath: 'pages/mine/index/index',
        name: '我的',
        icon: './tabBar/mine.png',
        activeIcon: './tabBar/mine_active.png',
      },
    ],
  },
  window: {
    titleBarColor: THEME_COLOR,
  },
};

export const web = {
  pages,
  subpackages: subPackages,
  // tabBar: {
  //   backgroundColor: '#fff',
  //   textColor: '#bebebe',
  //   selectedColor: THEME_COLOR,
  //   items: [
  //     {
  //       title: '首页',
  //       url: 'pages/home/index',
  //       image: './tabBar/home.png',
  //       activeImage: './tabBar/home_active.png',
  //     },
  //     {
  //       title: '我的',
  //       url: 'pages/mine/index/index',
  //       image: './tabBar/mine.png',
  //       activeImage: './tabBar/mine_active.png',
  //     },
  //   ],
  // },
};
