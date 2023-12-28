import React, { useCallback, useState, useEffect } from 'react';
import { View, Image, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import openLocation from '@/utils/openLocation';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, BackgroundImg, showToast, Icon, RichText } from '@kqinfo/ui';
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
import styles from './index.less';
import classNames from 'classnames';
import { useDownCount, useEffectState } from 'parsec-hooks';
import hideTabBar from '@/utils/hideTabBar';
import setPageStyle from '@/utils/setPageStyle';
import { useLockFn } from 'ahooks';
import Banner from '@/pages/home/banner';
import showTabBar from '@/utils/showTabBar';
import globalState from '@/stores/global';
import navigateToAlipayPage from '@/utils/navigateToAlipayPage';
import Dialog from '@/components/dialog';
import useApi from 'commonHis/src/apis/common';
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
  const { setSearchQ } = globalState.useContainer();
  const { getDeptList } = regsiterState.useContainer();
  const [show, setShow] = useState(false);
  const [registerMode, setRegisterMode] = useState('');
  const [noticeInfo, setNoticeInfo] = useState<string>('');
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
    data: { data: infoData3 },
  } = useApi.注意事项内容查询({
    params: {
      noticeType: 'DRGHXZ',
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
          患者提前<Text style={{ color: '#FF9743' }}>预约号源</Text>
        </View>
      ),
      url: '/pages2/register/department/index?type=default',
      image: `${IMAGE_DOMIN}/home/yygh.png`,
      new: true,
    },
    {
      title: '门诊缴费',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          手机缴费<Text style={{ color: '#FF9743' }}>不用等</Text>
        </View>
      ),
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/payment/order-list/index',
      image: `${IMAGE_DOMIN}/home/mzjf.png`,
    },
    {
      title: '报告查询',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          报告结果<Text style={{ color: '#FF9743' }}>实时查询</Text>
        </View>
      ),
      url: `/pages/report/report-list/index`,
      image: `${IMAGE_DOMIN}/home/bgcx.png`,
      new: PLATFORM === 'ali' && true,
    },
  ];

  const homeSubNavConfig = [
    // {
    //   title: '当日挂号',
    //   subTitle: '到院患者当日挂号',
    //   url: '/pages2/register/department/index?type=day',
    //   image: `${IMAGE_DOMIN}/home/drgh.png`,
    // },
    {
      title: '来院导航',
      subTitle: '导航前往医院',
      url: '/pages2/register',
      image: `${IMAGE_DOMIN}/home/new_lydh.png`,
      onClick: () => openLocation(),
    },
    {
      title: '住院预缴',
      subTitle: '住院费用预缴',
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/inhosp/home/index',
      image: `${IMAGE_DOMIN}/home/zyfw.png`,
    },
  ];

  const homeCardNavConfig =
    PLATFORM === 'ali'
      ? [
          {
            title: '核酸检测',
            subTitle: '',
            url: '/pages2/nucleic/select-combo/index?type=1',
            image: `${IMAGE_DOMIN}/home/hsjc.png`,
          },
          {
            title: '微官网',
            subTitle: '医院信息门户',
            url: '/pages/microsite/home/index',
            image: `${IMAGE_DOMIN}/home/wgw.png`,
            patientId: true,
          },
          {
            title: '来院导航',
            subTitle: '导航来院不迷路',
            url: '/pages2/register',
            image: `${IMAGE_DOMIN}/home/lydh.png`,
            onClick: () => openLocation(),
          },
          {
            title: '就医指南',
            subTitle: '',
            url: '/pages/microsite/article-detail/index?id=643',
            image: `${IMAGE_DOMIN}/home/wgw.png`,
            patientId: true,
          },
          {
            title: '医保电子凭证',
            subTitle: '',
            onClick: () => {
              my.navigateToMiniProgram({
                appId: '2021001123625885',
              });
            },
            image: `${IMAGE_DOMIN}/home/ybdzpz2.png`,
          },
          {
            title: '停车缴费',
            subTitle: '',
            onClick: () => {
              my.ap.navigateToAlipayPage({
                path: 'https://cloud.keytop.cn/stcfront/Payment/Query?lotId=8528&chInfo=ch_share__chsub_CopyLink&fxzjshareChinfo=ch_share__chsub_CopyLink&apshareid=B2B29C72-92A7-4CDE-9713-B92110DF4A87&shareBizType=mrfxzw',
              });
            },
            image: `${IMAGE_DOMIN}/home/tcjf.png`,
          },
        ]
      : [
          {
            title: '微官网',
            subTitle: '',
            url: '/pages/microsite/home/index',
            image: `${IMAGE_DOMIN}/home/wgw.png`,
            patientId: true,
          },
          {
            title: '智能导诊',
            subTitle: '',
            url: '',
            image: `${IMAGE_DOMIN}/home/zndz.png`,
            open: true,
          },
          {
            title: '数字影像',
            subTitle: '',
            url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/imageCloud/index',
            image: `${IMAGE_DOMIN}/home/szyx.png`,
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
        if (infoData2?.[0]?.noticeInfo && nav.title === '预约挂号') {
          setNoticeInfo(infoData2?.[0]?.noticeInfo);
          setShow(true);
        } else if (infoData3?.[0]?.noticeInfo && nav.title === '当日挂号') {
          setNoticeInfo(infoData3?.[0]?.noticeInfo);
          setShow(true);
        } else {
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
        setRegisterMode(nav.url);
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
            navigateTo({
              url: nav.url,
            });
          }
        });
        return;
      }
      if (nav.url.includes('alipays://')) {
        navigateToAlipayPage({
          path: encodeURI(nav.url),
        });
        return;
      }
      navigateTo({
        url: nav.url,
      });
    },
    [getDeptList, getPatientList, infoData2, infoData3, patientId],
  );
  const handleNavClick = useLockFn(onNavClick);
  usePageEvent('onShow', async () => {
    showTabBar();
    setSearchQ('');
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
      <View>
        <BackgroundImg
          img={`${IMAGE_DOMIN}/home/banner.jpeg`}
          className={styles.bannerImg}
          isPreviewImage
        >
          <Space
            className={styles.microsite}
            justify="center"
            alignItems="center"
            onTap={(e) => {
              e.stopPropagation();
              navigateTo({
                url: '/pages/microsite/hospital-summary/index',
              });
            }}
          >
            医院信息
          </Space>
        </BackgroundImg>
      </View>

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
          <Text>输入医生姓名、科室名称进行搜索</Text>
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
          {homeSubNavConfig.map((nav, index) => (
            <BackgroundImg
              key={nav.title}
              img={nav.image}
              className={styles.subNavImage}
              onTap={() => handleNavClick(nav)}
            >
              <Space vertical className={styles.subNavWrap}>
                <View
                  className={classNames(styles.subNavTitle, {
                    [styles.subNavTitle1]: index === 1,
                  })}
                >
                  {nav.title}
                </View>
                <View className={styles.subNavSubTitle}>{nav.subTitle}</View>
              </Space>
            </BackgroundImg>
          ))}
        </Space>

        <Space
          // justify="space-between"
          size={10}
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
              {item.title === '电子发票' && (
                <WxOpenLaunchWeapp
                  username="gh_310a33219dae"
                  path="pages/index/index.html?agencyCode=b4d1d3101b6f4bd8b9e6ca9e58beeb47"
                />
              )}
              {/*{item.title === '核酸检测' && (*/}
              {/*  <Image*/}
              {/*    src={`${IMAGE_DOMIN}/home/wyc.png`}*/}
              {/*    className={styles.cardTag}*/}
              {/*  />*/}
              {/*)}*/}
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
      {PLATFORM === 'web' && <TabBar active="首页" />}
    </View>
  );
};
