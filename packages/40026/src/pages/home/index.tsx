import React, { useEffect } from 'react';
import { View, Image, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import openLocation from '@/utils/openLocation';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, BackgroundImg, showToast } from '@kqinfo/ui';
import {
  IMAGE_DOMIN,
  HOSPITAL_NAME,
  PLATFORM,
  IS_FEEDBACL,
} from '@/config/constant';
import { CopyRight, TabBar } from '@/components';
import patientState from '@/stores/patient';
import useApi from 'commonHis/src/apis/common';
import styles from './index.less';
import globalState from '@/stores/global';
export default () => {
  const {
    defaultPatientInfo: { patientId },
  } = patientState.useContainer();
  const { initWxSDK } = globalState.useContainer();
  useEffect(() => {
    initWxSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  const homeMainNavConfig = [
    {
      title: '预约挂号',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          线上<Text style={{ color: '#FEB661' }}>快速预约</Text>挂号
        </View>
      ),
      url: '/pages2/register/department/index?type=default',
      image: `${IMAGE_DOMIN}/home/yygh.png`,
    },
    {
      title: '门诊缴费',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          手机缴费<Text style={{ color: '#FEB661' }}>不用等</Text>
        </View>
      ),
      url: `/pages2/usercenter/select-user/index?pageRoute=/pages2/payment/order-list/index`,
      image: `${IMAGE_DOMIN}/home/mzjf.png`,
    },
    {
      title: '报告查询',
      subTitle: () => (
        <View style={{ color: '#666' }}>
          报告结果<Text style={{ color: '#FEB661' }}>实时查询</Text>
        </View>
      ),
      url: `/pages/report/report-list/index?patientId=${patientId}`,
      image: `${IMAGE_DOMIN}/home/bgcx.png`,
    },
  ];

  const homeSubNavConfig = [
    {
      title: '当日挂号',
      subTitle: '到院患者当班挂号',
      url: '/pages2/register/department/index?type=current-day',
      image: `${IMAGE_DOMIN}/home/drgh.png`,
    },
    // {
    //   title: '核酸检测',
    //   subTitle: '在线预约核酸检测',
    //   url: '/pages2/nucleic/select-combo/index',
    //   image: `${IMAGE_DOMIN}/home/tjyy.png`,
    // },
    {
      title: '住院服务',
      subTitle: '住院患者贴心服务',
      url: `/pages2/usercenter/select-user/index?pageRoute=/pages2/inhosp/home/index`,
      image: `${IMAGE_DOMIN}/home/zyfw.png`,
    },
    {
      title: '智能导诊',
      subTitle: 'AI“医师”全天在线',
      // url: '/pages2/register',
      url: `/pages/webview/index?url=${encodeURIComponent(
        'https://ask.cqkqinfo.com/online/user/#/pages/index/index?hisId=40026',
      )}`,
      image: `${IMAGE_DOMIN}/home/zndz.png`,
      // 支付宝暂时不支持调整
      open: PLATFORM === 'ali',
    },
  ];

  const homeCardNavConfig =
    PLATFORM === 'web'
      ? [
          {
            title: '在线问诊',
            url: `/pages/webview/index?url=${encodeURIComponent(
              'https://zx.1451cn.com/pat/#/patients/region/hos-home?openId=odVEX1Qrhe_5f2DGXU05YwVYtPLg&loginid=&accesslevel=5&accessmode=6&hospitalName=%E9%87%8D%E5%BA%86%E9%BB%94%E6%B1%9F%E6%B0%91%E6%97%8F%E5%8C%BB%E9%99%A2',
            )}&title=在线问诊`,

            image: `${IMAGE_DOMIN}/home/yyzx.png`,
            new: false,
            open: true,
          },
          {
            title: '医院官网',
            url: '/pages/webview/index?url=http://www.qjmzyy.com/&title=医院官网',
            image: `${IMAGE_DOMIN}/home/yygw.png`,
            new: false,
            open: true,
          },
          {
            title: '物价查询',
            url: '/pages/webview/index?url=http://1451zsyy.1451cn.com/#/price-inquiry&title=物价查询',
            image: `${IMAGE_DOMIN}/home/wjcx.png`,
            new: false,
            open: true,
          },
          {
            title: '来院导航',
            url: '/pages2/register',
            image: `${IMAGE_DOMIN}/home/lydh.png`,
            new: false,
            onClick: () => openLocation(),
          },
          {
            title: '电子发票',
            url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/invoice/invoice-list/index',
            image: `${IMAGE_DOMIN}/home/lydh.png`,
            new: false,
          },
        ]
      : [
          {
            title: '在线问诊',
            url: `/pages/webview/index?url=${encodeURIComponent(
              'https://zx.1451cn.com/pat/#/patients/region/hos-home?openId=odVEX1Qrhe_5f2DGXU05YwVYtPLg&loginid=&accesslevel=5&accessmode=6&hospitalName=%E9%87%8D%E5%BA%86%E9%BB%94%E6%B1%9F%E6%B0%91%E6%97%8F%E5%8C%BB%E9%99%A2',
            )}&title=在线问诊`,

            image: `${IMAGE_DOMIN}/home/yyzx.png`,
            new: false,
            open: true,
          },
          {
            title: '医院官网',
            url: '/pages/webview/index?url=http://www.qjmzyy.com/&title=医院官网',
            image: `${IMAGE_DOMIN}/home/yygw.png`,
            new: false,
            open: true,
          },
          {
            title: '物价查询',
            url: '/pages/webview/index?url=http://1451zsyy.1451cn.com/#/price-inquiry&title=物价查询',
            image: `${IMAGE_DOMIN}/home/wjcx.png`,
            new: false,
            open: true,
          },
          {
            title: '来院导航',
            url: '/pages2/register',
            image: `${IMAGE_DOMIN}/home/lydh.png`,
            new: false,
            onClick: () => openLocation(),
          },
        ];
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: HOSPITAL_NAME,
    });
  });
  return (
    <View>
      <BackgroundImg
        img={`${IMAGE_DOMIN}/home/banner1.png`}
        className={styles.bannerImg}
      >
        {/* <Space
          className={styles.microsite}
          justify="center"
          alignItems="center"
          onTap={() =>
            navigateTo({
              url: '/pages/microsite/home/index',
            })
          }
        >
          医院信息
        </Space> */}
      </BackgroundImg>
      <Space vertical className={styles.content}>
        <Space justify="space-between" className={styles.nav}>
          {homeMainNavConfig.map((nav) => (
            <Space
              vertical
              justify="center"
              alignItems="center"
              key={nav.title}
              onTap={() =>
                navigateTo({
                  url: nav.url,
                })
              }
            >
              <Image
                src={nav.image}
                mode="aspectFill"
                className={styles.navImg}
              />
              <View className={styles.navTitle}>{nav.title}</View>
              {nav.subTitle()}
            </Space>
          ))}
        </Space>
        {/* <Space
          justify="space-between"
          flexWrap="wrap"
          className={styles.subNav}
        >
          {homeSubNavConfig.map((nav) => (
            <BackgroundImg
              key={nav.title}
              img={nav.image}
              className={styles.subNavImage}
              onTap={() => {
                if (nav?.open) {
                  showToast({
                    title: '功能暂未开放!',
                    icon: 'none',
                  });
                  return;
                }
                navigateTo({
                  url: nav.url,
                });
              }}
            >
              <Space vertical className={styles.subNavWrap}>
                <View className={styles.subNavTitle}>{nav.title}</View>
                <View className={styles.subNavSubTitle}>{nav.subTitle}</View>
              </Space>
            </BackgroundImg>
          ))}
        </Space> */}
        <Space
          justify="space-between"
          flexWrap="wrap"
          className={styles.newSubNav}
        >
          {
            <BackgroundImg
              key={homeSubNavConfig[0].title}
              // img={nav.image}
              className={styles.newSubNavImage}
              onTap={() => {
                if (homeSubNavConfig[0]?.open) {
                  showToast({
                    title: '功能暂未开放!',
                    icon: 'none',
                  });
                  return;
                }
                navigateTo({
                  url: homeSubNavConfig[0].url,
                });
              }}
            >
              <Space vertical className={styles.newSubNavWrap}>
                <View className={styles.subNavTitle}>
                  {homeSubNavConfig[0].title}
                </View>
                <View className={styles.subNavSubTitle}>
                  {homeSubNavConfig[0].subTitle}
                </View>
                <View className={styles.imgBox}>
                  <Image
                    src={`${IMAGE_DOMIN}/home/gh.png`}
                    className={styles.newImage}
                  />
                </View>
              </Space>
            </BackgroundImg>
          }
          {homeSubNavConfig
            .filter((_, i) => i !== 0)
            .map((nav) => (
              <BackgroundImg
                key={nav.title}
                img={nav.image}
                className={styles.subNavImage}
                onTap={() => {
                  if (nav?.open) {
                    showToast({
                      title: '功能暂未开放!',
                      icon: 'none',
                    });
                    return;
                  }
                  if (nav.title === '智能导诊') {
                    window.location.href =
                      'https://ask.cqkqinfo.com/online/user/#/pages/index/index?hisId=40026';
                  } else {
                    navigateTo({
                      url: nav.url,
                    });
                  }
                }}
              >
                <Space vertical className={styles.subNavWrap}>
                  <View className={styles.subNavTitle}>{nav.title}</View>
                  <View className={styles.subNavSubTitle}>{nav.subTitle}</View>
                </Space>
              </BackgroundImg>
            ))}
        </Space>
        <View style={{ position: 'relative' }}>
          <Image
            src={`${IMAGE_DOMIN}/home/banner2.png`}
            className={styles.banner2}
          />
          <wx-open-launch-weapp
            username="gh_a8c5ff51e201"
            path={`pages/chat/index?subhospitalId=${configList?.[0]?.subHospitalId}&hospitalId=${configList?.[0]?.hospitalId}`}
            // path={`pages/chat/index?subhospitalId=36&hospitalId=25`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <script type="text/wxtag-template">
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </script>
          </wx-open-launch-weapp>
        </View>

        <View className={styles.patTitle}>特色服务</View>
        <Space justify="space-between" className={styles.cardNav}>
          {homeCardNavConfig.map((item) => (
            <Space
              vertical
              key={item.title}
              justify="flex-end"
              className={styles.card}
              onTap={() => {
                if (item?.open) {
                  showToast({
                    title: '功能暂未开放!',
                    icon: 'none',
                  });
                  return;
                }
                if (item?.onClick) {
                  item.onClick();
                  return;
                }
                navigateTo({
                  url: item.url,
                });
              }}
            >
              {item.new && (
                <Image
                  src={`${IMAGE_DOMIN}/home/new.jpg`}
                  className={styles.newImg}
                />
              )}
              <Image src={item.image} className={styles.cardImg} />
              <View className={styles.cardTitle}>{item.title}</View>
            </Space>
          ))}
        </Space>
        <CopyRight
          clear
          hospitalId={configList?.[0]?.hospitalId}
          subHospitalId={configList?.[0]?.subHospitalId}
        />
      </Space>
      {PLATFORM === 'web' && <TabBar active="首页" />}
    </View>
  );
};
