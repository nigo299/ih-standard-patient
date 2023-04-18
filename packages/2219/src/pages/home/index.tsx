import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, Image, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import openLocation from '@/utils/openLocation';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Space,
  BackgroundImg,
  showToast,
  Icon,
  RichText,
  navigateToMiniProgram,
  PartTitle,
} from '@kqinfo/ui';
import {
  IMAGE_DOMIN,
  HOSPITAL_NAME,
  PLATFORM,
  IS_FEEDBACL,
  isDev,
} from '@/config/constant';
import {
  CopyRight,
  TabBar,
  RegisterNotice,
  WxOpenLaunchWeapp,
} from '@/components';
import patientState from '@/stores/patient';
import regsiterState from '@/stores/register';
import globalState from '@/stores/global';
import classNames from 'classnames';
import { useDownCount, useEffectState } from 'parsec-hooks';
import hideTabBar from '@/utils/hideTabBar';
import setPageStyle from '@/utils/setPageStyle';
import { useLockFn } from 'ahooks';
import Banner from '@/pages/home/banner';
import showTabBar from '@/utils/showTabBar';
import styles from './index.less';
// import useApi from '@/apis/microsite';
import useApi from '@/apis/common';
import Dialog from '@/components/dialog';
import storage from '@/utils/storage';
import dayjs from 'dayjs';

export interface NavType {
  title: string;
  subTitle?: React.ReactNode | string;
  url: string;
  image?: string;
  open?: boolean;
  new?: boolean;
  /** true 表示不需要绑定患者也可以进入 */
  patientId?: boolean;
  onClick?: () => void;
}

export default () => {
  console.log(isDev, 'isDev');
  console.log(process.env.REMAX_APP_PLATFORM, 'process.env.REMAX_APP_PLATFORM');
  const {
    defaultPatientInfo: { patientId },
    getPatientList,
  } = patientState.useContainer();
  const {
    setElderly,
    // getCardProdiles
  } = globalState.useContainer();
  const { getDeptList } = regsiterState.useContainer();
  const [show, setShow] = useState(false);
  const [registerMode, setRegisterMode] = useState('');
  const { clearCountdownTimer } = useDownCount();

  const {
    data: { data: configList },
  } = useApi.查询配置列表({
    params: {
      status: 1,
      whereShowCode: 'SY_DB',
      whereUse: 'GZH',
    },
    initValue: {
      data: { data: [] },
    },
    needInit: IS_FEEDBACL,
  });
  const {
    data: { data: infoData },
  } = useApi.注意事项内容查询({
    params: {
      noticeType: 'SYTS',
      noticeMethod: 'TC',
    },
  });
  const {
    data: { data: infoData2 },
  } = useApi.注意事项内容查询({
    params: {
      noticeType: 'GHXZ',
      noticeMethod: 'WBK',
    },
  });
  const {
    data: { data: configData },
  } = useApi.获取首页配置信息({});
  const [visible, setVisible] = useEffectState(!!infoData?.[0]?.noticeInfo);
  const homeMainNavConfig = [
    {
      title: '预约挂号',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          线上快速<Text style={{ color: '#F371A9' }}>预约挂号</Text>
        </View>
      ),
      url: '/pages2/register/department/index?type=default',
      image: `${IMAGE_DOMIN}/home/yygh.png`,
      new: true,
      // open: process.env.REMAX_APP_PLATFORM === 'production' && true,
    },
    {
      title: '门诊缴费',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          手机<Text style={{ color: '#F371A9' }}>缴费</Text>不用等
        </View>
      ),
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/payment/order-list/index',
      image: `${IMAGE_DOMIN}/home/mzjf.png`,
      new: true,
      // open: process.env.REMAX_APP_PLATFORM === 'production' && true,
    },
    {
      title: '报告查询',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          报告结果<Text style={{ color: '#F371A9' }}>实时查询</Text>
        </View>
      ),
      url: `/pages/report/report-list/index?patientId=${patientId}`,
      image: `${IMAGE_DOMIN}/home/bgcx.png`,
      new: PLATFORM === 'ali' && true,
    },
  ];

  const showDoctorRecords = useMemo(() => {
    // configType
    //   configType: "DOCTOR"
    // doctorRecordInfo: {showCount: 5}
    // doctorRecordInfoList: []
    if (configData) {
      const findData = configData.find((d) => d.configType === 'DOCTOR');
      const doctors = findData?.doctorRecordInfoList || [];
      // return new Array(10).fill(doctors[0]);
      return doctors;
    } else {
      return [];
    }
  }, [configData]);

  // const {
  //   data: { data: article },
  // } = useApi.获取文章列表({
  //   initValue: {
  //     data: {},
  //   },
  //   params: {
  //     pageNum: 1,
  //     numPerPage: 3,
  //     state: 'ONLINE',
  //   },
  //   needInit: true,
  // });

  // const healthList = useMemo(() => {
  //   return article.recordList?.filter((item) => item.typeName === '健康宣教');
  // }, [article.recordList]);

  const homeSubNavConfig = [
    {
      title: '住院服务',
      subTitle: '住院患者贴心服务',
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/inhosp/home/index',
      image: `${IMAGE_DOMIN}/home/zyfw.png`,
      titleColor: '#3990E9',
    },
    {
      title: '核酸检测',
      subTitle: '快速核酸检测开单',
      url: '/pages2/nucleic/select-combo/index?type=1',
      image: `${IMAGE_DOMIN}/home/hsjc.png`,
      titleColor: '#2EBDC7',
    },
  ];

  const homeCardNavConfig = useMemo(() => {
    const arr = [
      // {
      //   title: '就诊签到',
      //   subTitle: '',
      //   url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/signin/list/index',
      //   image: `${IMAGE_DOMIN}/home/yyqd.png`,
      //   patientId: true,
      // },
      {
        title: '排队进度',
        subTitle: '前面还有多少人',
        url: '/pages2/usercenter/select-user/index?pageRoute=/pages/queue/index',
        image: `${IMAGE_DOMIN}/home/pdjd.png`,
      },
      // {
      //   title: '微官网',
      //   subTitle: '医院信息门户',
      //   url: '/pages/microsite/home/index',
      //   image: `${IMAGE_DOMIN}/home/wgw.png`,
      //   patientId: true,
      // },
      // {
      //   title: '住院预约',
      //   subTitle: '医院信息门户',
      //   url: '/pages2/inhosp/reserve-list/index',
      //   image: `${IMAGE_DOMIN}/home/zyyy.png`,
      // },
      // {
      //   title: '来院导航',
      //   subTitle: '到院路线地图导航',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/lydh.png`,
      //   onClick: () => openLocation(),
      // },
      // {
      //   title: '智能导诊',
      //   subTitle: '导航来院不迷路',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/zndz.png`,
      //   onClick: () =>
      //     (window.location.href =
      //       'https://ask.cqkqinfo.com/online/user/#/pages/index/index?hisId=40064'),
      // },
      // {
      //   title: '物价查询',
      //   subTitle: '',
      //   url: '/pages2/price-inquiry/type/index',
      //   image: `${IMAGE_DOMIN}/home/price-search.png`,
      //   patientId: true,
      // },
      // {
      //   title: '医保电子凭证',
      //   subTitle: '线上医保电子凭证',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/ybjzpz.png`,
      //   onClick: () =>
      //     (window.location.href =
      //       'https://mp.weixin.qq.com/insurance/card/creditjump?cityid=999999&from=USzyLFkJki8kTGhO1CG-cQ.%3D#wechat_redirect'),
      //   open: PLATFORM !== 'web',
      // },
      // {
      //   title: '院内导航',
      //   subTitle: '',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/yndh.png`,
      //   patientId: true,
      // },
      // {
      //   title: '电子票据',
      //   subTitle: '',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/dzpj.png`,
      //   patientId: true,
      // },
      // {
      //   title: '入托体检报告',
      //   subTitle: '',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/rttjbg.png`,
      //   onClick: () =>
      //     (window.location.href =
      //       'http://eb.spbqfybjy.com:10000/weixin/#/studenexamine'),
      // },
      // {
      //   title: '教师体检报告',
      //   subTitle: '',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/jstjbg.png`,
      //   onClick: () =>
      //     (window.location.href =
      //       'http://eb.spbqfybjy.com:10001/weixin/#/workerexamine'),
      // },
      // {
      //   title: '两癌筛查预约',
      //   subTitle: '',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/lascyy.png`,
      //   onClick: () =>
      //     (window.location.href =
      //       'https://wx.scmttec.com/passport/wx/login.do?target=hospitalHome_index?depaCode=5001060009&uFrom=mzzy5001060009'),
      // },
      // {
      //   title: '疫苗预约',
      //   subTitle: '',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/ymyy.png`,
      //   onClick: () =>
      //     (window.location.href =
      //       'https://wx.scmttec.com/passport/wx/login.do?target=hospitalHome_index?depaCode=5001060009&uFrom=mzzy5001060009'),
      // },
      // {
      //   title: '孕产妇建档',
      //   subTitle: '',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/ycfjd.png`,
      //   onClick: () =>
      //     (window.location.href = 'https://www.cqyyt.com/yunbao/web?hpId=93'),
      // },
    ];
    const addArr = (
      configData?.find((item) => item.configType === 'EXPAND')?.expandInfo || []
    )?.map((item) => ({
      title: item.title,
      subTitle: '',
      url: '',
      image: item.imgUrl,
      onClick: () => {
        if (PLATFORM === 'web') {
          if (item.jumpType === 'H5') {
            window.location.href = item.jumpUrl;
          } else if (item.jumpType === 'MINI_APP') {
            navigateToMiniProgram({
              appId: item.appId,
              path: item.jumpUrl,
            });
          } else {
            window.location.href = item.jumpUrl;
          }
        } else if (PLATFORM === 'ali') {
          if (item.jumpType === 'MINI_APP') {
            navigateToMiniProgram({
              appId: item.appId,
              path: item.jumpUrl,
            });
          }
        }
      },
    }));
    return [...arr, ...addArr];
  }, [configData]);

  const onNavClick = useCallback(
    async (nav: NavType) => {
      if (nav?.open) {
        showToast({
          title: '功能开发中，敬请期待',
          icon: 'none',
        });
        return;
      }
      if (nav?.onClick) {
        nav.onClick();
        return;
      }
      if (
        nav.title === '预约挂号' ||
        nav.title === '当日挂号' ||
        nav.title === '核酸检测' ||
        nav.title === '体检商城' ||
        nav.title === '搜索医生' // 首页点击搜索
      ) {
        hideTabBar();
        setPageStyle({
          overflow: 'hidden',
        });
        if (infoData2?.[0]?.noticeInfo) setShow(true);
        else {
          setPageStyle({
            overflow: 'inherit',
          });
          if (
            nav.url.includes('reserve') &&
            nav.url.includes('register/department')
          ) {
            getDeptList('reserve');
          } else if (
            nav.url.includes('day') &&
            nav.url.includes('register/department')
          ) {
            getDeptList('day');
          } else if (
            nav.url.includes('health') &&
            nav.url.includes('register/department')
          ) {
            getDeptList('health');
          } else if (
            nav.url.includes('default') &&
            nav.url.includes('register/department')
          ) {
            getDeptList('default');
          } else {
            navigateTo({
              url: nav.url,
            });
          }
        }

        setRegisterMode(nav?.url);
        return;
      }
      if (!patientId && !nav.patientId) {
        getPatientList(false).then((patient) => {
          if (patient.length === 0) {
            showToast({
              title: '请先添加就诊人!',
              icon: 'none',
            }).then(() => {
              navigateTo({
                url: `/pages2/usercenter/add-user/index`,
              });
            });
          } else {
            if (nav.title === '报告查询') {
              navigateTo({
                url: `${nav.url}${
                  patient.filter((item) => item.isDefault === 1)[0].patientId
                }`,
              });
            } else {
              navigateTo({
                url: nav.url,
              });
            }
          }
        });
        return;
      }
      navigateTo({
        url: nav.url,
      });
    },
    [getDeptList, getPatientList, infoData2, patientId],
  );
  const handleNavClick = useLockFn(onNavClick);
  usePageEvent('onShow', async () => {
    if (
      storage.get('openid') === 'oDnT4wBB4yQ3dDw3AZth0217ZUfU' &&
      process.env.REMAX_APP_PLATFORM === 'production'
    ) {
      window.location.href =
        'https://tihs.cqkqinfo.com/patients/p40064-his/#/pages/home/index';
    }

    // getCardProdiles();
    showTabBar();
    setPageStyle({
      overflow: 'inherit',
    });
    setElderly(false);
    setNavigationBar({
      title: HOSPITAL_NAME,
    });
  });
  // useEffect(() => {
  //   hideTabBar();
  //   showModal({
  //     title: '提示',
  //     content: '是否进入适老模式',
  //   }).then(({ confirm }) => {
  //     if (confirm) {
  //       setElderly(true);
  //       if (PLATFORM === 'web') {
  //         redirectTo({ url: '/pages3/home/index' });
  //       } else {
  //         reLaunch({ url: '/pages3/home/index' });
  //       }
  //     }
  //     showTabBar();
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  return (
    <View>
      <BackgroundImg
        img={`${IMAGE_DOMIN}/home/banner1.jpg`}
        className={styles.bannerImg}
        isPreviewImage
      >
        <Space
          className={styles.microsite}
          justify="center"
          alignItems="center"
          onTap={(e) => {
            e.stopPropagation();
            // showToast({
            //   title: '功能暂未开放!',
            //   icon: 'none',
            // });
            // return;
            navigateTo({
              url: '/pages/microsite/hospital-summary/index',
            });
          }}
        >
          医院信息
        </Space>
      </BackgroundImg>
      <Space vertical className={styles.content}>
        <View
          className={styles.toSearch}
          onTap={() => {
            navigateTo({
              url: '/pages2/register/search-doctor/index?q=&type=default',
            });
          }}
        >
          <Icon
            name={'kq-search'}
            className={styles.searchIcon}
            color={'#CCCCCC'}
          />
          <Text>搜索医生</Text>
        </View>
        <Space justify="space-between" className={styles.nav}>
          {homeMainNavConfig.map((nav) => (
            <Space
              vertical
              justify="center"
              alignItems="center"
              key={nav.title}
              className={styles.navWrap}
              onTap={() => handleNavClick(nav)}
            >
              <Image
                src={nav.image}
                mode="aspectFill"
                className={styles.navImg}
              />
              {nav.new && (
                <Image
                  src={
                    PLATFORM === 'ali'
                      ? `${IMAGE_DOMIN}/home/lsnl.png`
                      : `${IMAGE_DOMIN}/home/hot.png`
                  }
                  mode="aspectFill"
                  className={classNames({
                    [styles.navNewImg]: PLATFORM === 'web',
                    [styles.navLsnlImg]: PLATFORM === 'ali',
                  })}
                />
              )}
              <View className={styles.navTitle}>{nav.title}</View>
              {nav.subTitle()}
            </Space>
          ))}
        </Space>
        <Space
          justify="space-between"
          flexWrap="wrap"
          className={styles.subNav}
        >
          {homeSubNavConfig.map((item, index) => (
            <Space
              key={index}
              vertical
              className={styles.subNavWrap2}
              onTap={() => handleNavClick(item as any)}
            >
              <Space
                className={styles.subNavTitle}
                alignItems="center"
                justify="space-between"
                style={{ color: item.titleColor }}
              >
                {item.title}
              </Space>
              <Space
                className={styles.subNavSubTitle}
                alignItems="center"
                justify="space-between"
              >
                {item.subTitle}
              </Space>
              <Image className={styles.subNavImg2} src={item.image} />
            </Space>
          ))}
        </Space>
        {showDoctorRecords.length ? (
          <PartTitle className={styles.doctorRecordTitle}>
            就诊过的医生
          </PartTitle>
        ) : (
          ''
        )}
        <Space
          className={styles.doctorRecordWrap}
          style={showDoctorRecords.length ? {} : { display: 'none' }}
        >
          {showDoctorRecords.map((item, index) => (
            <Space
              key={index}
              className={styles.doctorRecordItem}
              onTap={() => {
                navigateTo({
                  url: `/pages2/register/select-time/index?deptId=${
                    item.deptId
                  }&doctorId=${item.doctorId}&scheduleDate=${dayjs().format(
                    'YYYY-MM-DD',
                  )}&type=default`,
                });
              }}
            >
              <Image src={item.image} className={styles.doctorRecordImg} />
              <Space vertical>
                <View className={styles.doctorRecordName}>{item.name}</View>
                <View className={styles.doctorRecordJob}>{item.visitType}</View>
                <View className={styles.doctorRecordDept}>{item.deptName}</View>
              </Space>
            </Space>
          ))}
        </Space>

        <Space
          // justify="space-between"
          className={styles.cardNav}
          flexWrap="wrap"
          size={10}
        >
          {homeCardNavConfig.map((item: NavType) => (
            <Space
              vertical
              key={item.title}
              alignItems="center"
              className={styles.card}
              onTap={() => handleNavClick(item)}
            >
              <Image src={item.image} className={styles.cardImg} />
              <View className={styles.cardTitle}>{item.title}</View>

              {item.title === '院内导航' && (
                <WxOpenLaunchWeapp
                  username="gh_1828bcf09dc4"
                  path="pages/index/index?buildId=203276&type=9"
                />
              )}

              {item.title === '电子票据' && (
                <WxOpenLaunchWeapp
                  username="gh_310a33219dae"
                  path="pages/index/index?agencyCode=54a85264298e43dda83f9404d06ec3d3"
                />
              )}
            </Space>
          ))}
        </Space>
        <Banner
          CommonImg={
            configData?.find((item) => item.configType === 'BANNER')
              ?.bannerInfo || []
          }
        />
        <View className={styles.copyRight}>
          <CopyRight
            clear
            hospitalId={configList?.[0]?.hospitalId}
            subHospitalId={configList?.[0]?.subHospitalId}
          />
        </View>
      </Space>
      <RegisterNotice
        show={show}
        close={() => setShow(false)}
        content={infoData2?.[0]?.noticeInfo || ''}
        confirm={() => {
          if (
            registerMode.includes('reserve') &&
            registerMode.includes('register/department')
          ) {
            getDeptList('reserve');
          } else if (
            registerMode.includes('day') &&
            registerMode.includes('register/department')
          ) {
            getDeptList('day');
          } else if (
            registerMode.includes('health') &&
            registerMode.includes('register/department')
          ) {
            getDeptList('health');
          } else if (
            registerMode.includes('default') &&
            registerMode.includes('register/department')
          ) {
            getDeptList('default');
          } else {
            navigateTo({
              url: registerMode,
            });
          }
        }}
      />
      <Dialog
        hideFail
        show={visible}
        title={'重要提醒'}
        successText={'确定'}
        onSuccess={() => setVisible(false)}
      >
        <Space style={{ lineHeight: 1.2, padding: 20 }}>
          <RichText nodes={infoData?.[0]?.noticeInfo || ''} />
        </Space>
      </Dialog>
      {PLATFORM === 'web' && <TabBar active="首页" className={styles.tabBar} />}
    </View>
  );
};
