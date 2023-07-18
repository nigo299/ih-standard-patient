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
  PartTitle,
} from '@kqinfo/ui';
import {
  IMAGE_DOMIN,
  HOSPITAL_NAME,
  PLATFORM,
  IS_FEEDBACL,
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
          线上快速<Text style={{ color: '#bb5a47' }}>预约挂号</Text>
        </View>
      ),
      url: '/pages2/register/department/index?type=default',
      image: `${IMAGE_DOMIN}/home/yygh.png`,
      // open: process.env.REMAX_APP_PLATFORM === 'production' && true,
    },
    {
      title: '门诊缴费',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          手机<Text style={{ color: '#bb5a47' }}>缴费</Text>不用等
        </View>
      ),
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/payment/order-list/index',
      image: `${IMAGE_DOMIN}/home/mzjf.png`,
      // open: process.env.REMAX_APP_PLATFORM === 'production' && true,
    },
    {
      title: '报告查询',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          报告结果<Text style={{ color: '#bb5a47' }}>实时查询</Text>
        </View>
      ),
      url: `/pages/report/report-list/index?patientId=`,
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
      title: '当日挂号',
      // subTitle: '到院患者当日挂号',
      subTitle: <View style={{ color: '#666' }}>当班医生号源</View>,
      url: '/pages2/register/department/index?type=day',
      image: `${IMAGE_DOMIN}/home/drgh.png`,
    },
    {
      title: '住院服务',
      // subTitle: '住院患者贴心服务',
      subTitle: <Space>住院患者贴心服务</Space>,
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/inhosp/home/index',
      image: `${IMAGE_DOMIN}/home/zyfw.png`,
      // open: true,
    },
  ];
  const homeCardNavConfig =
    // PLATFORM === 'ali'
    //   ? [
    //       {
    //         title: '核酸检测',
    //         subTitle: '',
    //         url: '/pages2/nucleic/upload/index',
    //         image: `${IMAGE_DOMIN}/home/hsjc.png`,
    //       },
    //       {
    //         title: '微官网',
    //         subTitle: '医院信息门户',
    //         url: '/pages/microsite/home/index',
    //         image: `${IMAGE_DOMIN}/home/wgw.png`,
    //         patientId: true,
    //       },
    //       {
    //         title: '来院导航',
    //         subTitle: '导航来院不迷路',
    //         url: '/pages2/register',
    //         image: `${IMAGE_DOMIN}/home/lydh.png`,
    //         onClick: () => openLocation(),
    //       },
    //       {
    //         title: '就医指南',
    //         subTitle: '',
    //         open: true,
    //         url: '/pages/microsite/article-detail/index?id=643',
    //         image: `${IMAGE_DOMIN}/home/wgw.png`,
    //         patientId: true,
    //       },
    //     ]
    //   :
    [
      // {
      //   title: '排队进度',
      //   subTitle: '前面还有多少人',
      //   url: '/pages2/usercenter/select-user/index?pageRoute=/pages/queue/index',
      //   image: `${IMAGE_DOMIN}/home/pdjd.png`,
      //   open: true,
      // },
      {
        title: '微官网',
        subTitle: '医院信息门户',
        url: '/pages/microsite/home/index',
        image: `${IMAGE_DOMIN}/home/wgw.png`,
        patientId: true,
      },
      // {
      //   title: '核酸检测',
      //   subTitle: '快速核酸检测开单',
      //   url: '/pages2/nucleic/select-combo/index?type=1',
      //   image: `${IMAGE_DOMIN}/home/hsjc.png`,
      //   titleColor: '#2EBDC7',
      // },
      {
        title: '来院导航',
        subTitle: '导航来院不迷路',
        url: '/pages2/register',
        image: `${IMAGE_DOMIN}/home/lydh.png`,
        onClick: () => openLocation(),
      },
      {
        title: '健康宣教',
        subTitle: '',
        open: true,
        image: `${IMAGE_DOMIN}/home/jkxj.png`,
        url: '',
      },
      {
        title: '意见反馈',
        subTitle: '',
        open: true,
        image: `${IMAGE_DOMIN}/home/yjfk.png`,
        url: '',
      },
      // {
      //   title: '满意度调查',
      //   subTitle: '',
      //   url: '',
      //   image: `${IMAGE_DOMIN}/home/myddc.png`,
      //   onClick: () =>
      //     (window.location.href = 'https://wj.qq.com/s2/5190318/2a67/'),
      // },
      {
        title: '',
        subTitle: '',
        open: true,
        image: ``,
        url: '',
      },
    ];
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

  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  return (
    <View>
      <BackgroundImg
        img={`${IMAGE_DOMIN}/home/banner.png`}
        className={styles.bannerImg}
        isPreviewImage
      >
        {/* <Image
          src={`${IMAGE_DOMIN}/auth/logo.png`}
          mode="aspectFill"
          className={styles.logo}
        /> */}
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
          <Text>搜索科室</Text>
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
          {homeSubNavConfig.map((item, index: number) => (
            <Space
              key={index}
              className={styles.navRightConfig}
              vertical
              justify={'space-between'}
            >
              <Space
                vertical
                style={{ marginBottom: 0 }}
                className={styles.subNavWrap2}
                onTap={() => {
                  handleNavClick(item);
                }}
              >
                <Space
                  className={styles.subNavTitle}
                  alignItems="center"
                  justify="space-between"
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
                <Image className={styles.navConfigBk2} src={item.image} />
              </Space>
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
          justify="space-between"
          className={styles.cardNav}
          flexWrap="wrap"
        >
          {homeCardNavConfig.map((item: NavType) => (
            <Space
              vertical
              key={item.title}
              alignItems="center"
              className={styles.card}
              onTap={() => item.title && handleNavClick(item)}
            >
              <Image src={item.image} className={styles.cardImg} />
              <View className={styles.cardTitle}>{item.title}</View>
              {item.title === '电子票据' && (
                <WxOpenLaunchWeapp
                  username="gh_310a33219dae"
                  path="pages/index/index.html?agencyCode=b4d1d3101b6f4bd8b9e6ca9e58beeb47"
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
