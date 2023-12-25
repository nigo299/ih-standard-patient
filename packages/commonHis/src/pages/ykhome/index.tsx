import React, { useState } from 'react';
import { View, Image, Text, navigateTo } from 'remax/one';
import { useTitle, Space, Icon, QrCode, showToast } from '@kqinfo/ui';
import styles from './index.less';
import { themeConfig, HisTheme } from './config';
import { HIS_ID, IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import { QrCodeModal } from '@/components';
import patientState from '@/stores/patient';
export default () => {
  useTitle(HOSPITAL_NAME);
  const styleConfig = HisTheme[HIS_ID] || 'CHS';
  const nav = [
    {
      name: '预约挂号',
      src: themeConfig[styleConfig].imgs.yygh,
      bg: themeConfig[styleConfig].navColor.bg1,
      url: '/pages2/register/department/index?type=default',
    },
    {
      name: '门诊签到',
      src: themeConfig[styleConfig].imgs.mzqd,
      bg: themeConfig[styleConfig].navColor.bg2,
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/signin/list/index',
    },
    {
      name: '门诊缴费',
      src: themeConfig[styleConfig].imgs.mzjf,
      bg: themeConfig[styleConfig].navColor.bg3,
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/payment/order-list/index',
    },
  ];
  const funList = [
    {
      name: '排队进度',
      src: themeConfig[styleConfig].imgs.pdjd,
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages/queue/index',
    },
    {
      name: '报告查询',
      src: themeConfig[styleConfig].imgs.bgcx,
      url: '/pages2/usercenter/select-user/index?pageRoute=/pages/report/report-list/index',
    },
    {
      name: '门诊病历',
      src: themeConfig[styleConfig].imgs.mzbl,
      url: '/pages2/diagnosis/order-detail/caseHistory',
    },
    {
      name: '取药服务',
      src: themeConfig[styleConfig].imgs.qyfw,
      url: '',
    },
    {
      name: '费用查询',
      src: themeConfig[styleConfig].imgs.fycx,
      url: '/pages2/price-inquiry/type/index',
    },
    {
      name: '咨询投诉',
      src: themeConfig[styleConfig].imgs.zxts,
      url: '/pages2/feedback/feedback-list/index',
    },
    {
      name: '退号',
      src: themeConfig[styleConfig].imgs.th,
      url: '',
    },
    {
      name: '',
      src: '',
      url: '',
    },
  ];
  const funList1 = [
    {
      name: '院内导航',
      src: themeConfig[styleConfig].imgs.yndh,
      url: '',
      onTap: () =>
        (window.location.href =
          'https://his.ipalmap.com/pandora/cqbbkryy/index.html#/search'),
    },
    {
      name: '共享充电宝',
      src: themeConfig[styleConfig].imgs.gxcdb,
      url: '',
    },
    {
      name: '共享轮椅',
      src: themeConfig[styleConfig].imgs.gxly,
      url: '',
    },
    {
      name: '',
      src: '',
      url: '',
    },
  ];
  const { defaultPatientInfo } = patientState.useContainer();
  const [show, setShow] = useState(false);
  const [cardType, setCardType] = useState(true);
  return (
    <View className={styles.page}>
      <Space
        className={styles.top}
        alignItems="center"
        justify="center"
        style={{ backgroundColor: themeConfig[styleConfig].themeColor }}
      >
        - 就医服务一件事 -
      </Space>
      <View className={styles.warp}>
        <Space
          className={styles.card}
          size={20}
          onTap={() => {
            navigateTo({
              url: '/pages2/usercenter/select-user/index?pageRoute=/pages/ykhome/index',
            });
          }}
        >
          <Image
            src={`${IMAGE_DOMIN}/yukangjian/user.png`}
            className={styles.headIcon}
          />
          <Space flex={1} vertical size={24}>
            <View>{defaultPatientInfo?.patientName}</View>
            <View>{defaultPatientInfo?.patientFullIdNo}</View>
            <Space
              size={10}
              style={{ color: themeConfig[styleConfig].themeColor }}
            >
              切换就诊人{' '}
              <Icon
                name="kq-xiajiantou"
                size={24}
                color={themeConfig[styleConfig].themeColor}
              />
            </Space>
          </Space>
          <Space
            vertical
            size={20}
            className={styles.qrcode}
            justify="center"
            alignItems="center"
          >
            <QrCode
              onTap={(e) => {
                e.stopPropagation();
                setShow(true);
              }}
              content={
                cardType
                  ? defaultPatientInfo?.patCardNo
                  : defaultPatientInfo?.healthCardId
              }
              className={styles.qrcodeImg}
            />
            <View
              onTap={(e) => {
                e.stopPropagation();
                setCardType(!cardType);
              }}
            >
              切换{cardType ? '电子健康卡' : '就诊卡'}
            </View>
          </Space>
        </Space>
        <Space alignItems="center" justify="space-between">
          {nav.map((item, index) => (
            <Space
              key={index}
              className={styles.menu}
              style={{ backgroundColor: item.bg }}
              onTap={() => {
                if (item.url.length === 0) {
                  showToast({
                    icon: 'none',
                    title: '本功能暂未开放',
                  });
                } else {
                  navigateTo({
                    url: item.url,
                  });
                }
              }}
            >
              <Image src={item.src} className={styles.navIcon} />
              <Text className={styles.navTxt}>{item.name}</Text>
            </Space>
          ))}
        </Space>
        <View className={styles.space} />
        <Space className={styles.funlist}>
          {funList.map((item, index) => {
            if (item.name === '') {
              return <Space key={index} className={styles.fun} />;
            } else {
              return (
                <Space
                  key={index}
                  className={styles.fun}
                  onTap={() => {
                    if (item.url.length === 0) {
                      showToast({
                        icon: 'none',
                        title: '本功能暂未开放',
                      });
                    } else {
                      navigateTo({
                        url: item.url,
                      });
                    }
                  }}
                  vertical
                >
                  <Image src={item.src} className={styles.funIcon} />
                  <Text className={styles.funTxt}>{item.name}</Text>
                </Space>
              );
            }
          })}
        </Space>
        <Image
          src={themeConfig[styleConfig].imgs.banner}
          className={styles.banner}
          onTap={() => {
            showToast({
              icon: 'none',
              title: '本功能暂未开放',
            });
          }}
        />
        <Space className={styles.ParTitle}>
          <View
            className={styles.TitleLine}
            style={{ backgroundColor: themeConfig[styleConfig].themeColor }}
          />
          便民服务
        </Space>
        <Space className={styles.funlist}>
          {funList1.map((item, index) => {
            if (item.name === '') {
              return <Space key={index} className={styles.fun} />;
            } else {
              return (
                <Space
                  key={index}
                  className={styles.fun}
                  onTap={() => {
                    if (item.url.length === 0) {
                      if (item.onTap) {
                        item.onTap();
                        return;
                      }
                      showToast({
                        icon: 'none',
                        title: '本功能暂未开放',
                      });
                    } else {
                      navigateTo({
                        url: item.url,
                      });
                    }
                  }}
                  vertical
                >
                  <Image src={item.src} className={styles.funIcon} />
                  <Text className={styles.funTxt}>{item.name}</Text>
                </Space>
              );
            }
          })}
        </Space>
        <Space className={styles.footer}>-凯桥信息提供技术支持 V1.0.0-</Space>
      </View>
      <QrCodeModal
        show={show}
        name={`${defaultPatientInfo?.patientName} | ${
          cardType
            ? defaultPatientInfo?.patCardNo
            : defaultPatientInfo?.healthCardId
        }`}
        content={
          cardType
            ? defaultPatientInfo?.patCardNo
            : defaultPatientInfo?.healthCardId
        }
        close={() => setShow(false)}
      />
    </View>
  );
};
