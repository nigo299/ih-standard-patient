import { IMAGE_DOMIN } from '@/config/constant';

export const themeConfig: any = {
  CHS: {
    themeColor: '#2D5AFA', //主题色
    navColor: {
      bg1: '#35d191',
      bg2: '#1f83fb',
      bg3: '#6353fa',
    },
    imgs: {
      //图片
      yygh: `${IMAGE_DOMIN}/yukangjian/zh/yygh.png`,
      mzqd: `${IMAGE_DOMIN}/yukangjian/zh/mzqd.png`,
      mzjf: `${IMAGE_DOMIN}/yukangjian/zh/mzjf.png`,
      pdjd: `${IMAGE_DOMIN}/yukangjian/zh/pdjd.png`,
      bgcx: `${IMAGE_DOMIN}/yukangjian/zh/bgcx.png`,
      mzbl: `${IMAGE_DOMIN}/yukangjian/zh/mzbl.png`,
      qyfw: `${IMAGE_DOMIN}/yukangjian/zh/qyfw.png`,
      fycx: `${IMAGE_DOMIN}/yukangjian/zh/fycx.png`,
      zxts: `${IMAGE_DOMIN}/yukangjian/zh/zxts.png`,
      th: `${IMAGE_DOMIN}/yukangjian/zh/th.png`,
      banner: `${IMAGE_DOMIN}/yukangjian/zh/banner.png`,
      yndh: `${IMAGE_DOMIN}/yukangjian/zh/yndh.png`,
      gxcdb: `${IMAGE_DOMIN}/yukangjian/zh/gxcdb.png`,
      gxly: `${IMAGE_DOMIN}/yukangjian/zh/gxly.png`,
    },
  }, //综合
  TCM: {
    themeColor: '#B16C3D',
    navColor: {
      bg1: '#35d191',
      bg2: '#feb659',
      bg3: '#ff74a1',
    },
    imgs: {
      yygh: `${IMAGE_DOMIN}/yukangjian/zy/yygh.png`,
      mzqd: `${IMAGE_DOMIN}/yukangjian/zy/mzqd.png`,
      mzjf: `${IMAGE_DOMIN}/yukangjian/zy/mzjf.png`,
      pdjd: `${IMAGE_DOMIN}/yukangjian/zy/pdjd.png`,
      bgcx: `${IMAGE_DOMIN}/yukangjian/zy/bgcx.png`,
      mzbl: `${IMAGE_DOMIN}/yukangjian/zy/mzbl.png`,
      qyfw: `${IMAGE_DOMIN}/yukangjian/zy/qyfw.png`,
      fycx: `${IMAGE_DOMIN}/yukangjian/zy/fycx.png`,
      zxts: `${IMAGE_DOMIN}/yukangjian/zy/zxts.png`,
      th: `${IMAGE_DOMIN}/yukangjian/zy/th.png`,
      banner: `${IMAGE_DOMIN}/yukangjian/zy/banner.png`,
      yndh: `${IMAGE_DOMIN}/yukangjian/zy/yndh.png`,
      gxcdb: `${IMAGE_DOMIN}/yukangjian/zy/gxcdb.png`,
      gxly: `${IMAGE_DOMIN}/yukangjian/zy/gxly.png`,
    },
  }, //中医
  MAC: {
    themeColor: '#F24F86',
    navColor: {
      bg1: '#35d191',
      bg2: '#feb659',
      bg3: '#ff74a1',
    },
    imgs: {
      yygh: `${IMAGE_DOMIN}/yukangjian/fy/yygh.png`,
      mzqd: `${IMAGE_DOMIN}/yukangjian/fy/mzqd.png`,
      mzjf: `${IMAGE_DOMIN}/yukangjian/fy/mzjf.png`,
      pdjd: `${IMAGE_DOMIN}/yukangjian/fy/pdjd.png`,
      bgcx: `${IMAGE_DOMIN}/yukangjian/fy/bgcx.png`,
      mzbl: `${IMAGE_DOMIN}/yukangjian/fy/mzbl.png`,
      qyfw: `${IMAGE_DOMIN}/yukangjian/fy/qyfw.png`,
      fycx: `${IMAGE_DOMIN}/yukangjian/fy/fycx.png`,
      zxts: `${IMAGE_DOMIN}/yukangjian/fy/zxts.png`,
      th: `${IMAGE_DOMIN}/yukangjian/fy/th.png`,
      banner: `${IMAGE_DOMIN}/yukangjian/fy/banner.png`,
      yndh: `${IMAGE_DOMIN}/yukangjian/fy/yndh.png`,
      gxcdb: `${IMAGE_DOMIN}/yukangjian/fy/gxcdb.png`,
      gxly: `${IMAGE_DOMIN}/yukangjian/fy/gxly.png`,
    },
  }, //妇幼
};
export const HisTheme = {
  '2219': 'CHS',
  '40064': 'MAC',
  '40012': 'CHS',
  '40013': 'MAC',
  '40019': 'TCM',
  '40011': 'TCM',
};
export const registerRoute = '/pages2/register/department/index?type=default';
