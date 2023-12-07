import React, { useState } from 'react';
import { View, Text, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import showTabBar from '@/utils/showTabBar';
import hideTabBar from '@/utils/hideTabBar';
import { mineMainNavConfig, mineNavListConfig } from '@/config';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import { Space, showToast } from '@kqinfo/ui';
import { QrCodeModal, TabBar } from '@/components';
import MediCard from './components/mediCardS';
import patientState from '@/stores/patient';
import classNames from 'classnames';
import styles from './index.less';

interface List {
  title: string;
  open?: boolean;
  onClick?: () => void;
  url: string;
  image: string;
}
export default () => {
  const { bindPatientList, defaultPatientInfo, getPatientList } =
    patientState.useContainer();
  const [show, setShow] = useState(false);
  usePageEvent('onShow', () => {
    getPatientList();
    setNavigationBar({
      title: '个人中心',
    });
  });
  return (
    <View className={styles.page}>
      <Image
        src={`${IMAGE_DOMIN}/mine/banner.png`}
        mode="aspectFit"
        className={styles.banner}
      />
      {defaultPatientInfo?.patientName ? (
        <Space justify="center" className={styles.mediCard}>
          <MediCard
            patientId={defaultPatientInfo?.patientId}
            patCardNo={defaultPatientInfo.patCardNo}
            patientName={defaultPatientInfo.patientName}
            onQrCodeTab={() => {
              hideTabBar();
              setShow(true);
            }}
          />
        </Space>
      ) : (
        <Space
          justify="flex-start"
          alignItems="center"
          className={styles.addCard}
          onTap={() => {
            navigateTo({
              url: '/pages2/usercenter/add-user/index',
            });
          }}
        >
          <Image
            src={`${IMAGE_DOMIN}/mine/add.png`}
            className={styles.addImg}
          />
          <Space
            vertical
            justify="center"
            style={{
              lineHeight: 1.5,
            }}
          >
            <View className={styles.addTitle}>添加就诊人</View>
            <View className={styles.addSubTitle}>
              您还可添加{5 - bindPatientList.length}人
            </View>
          </Space>
        </Space>
      )}

      <View
        className={classNames(styles.content, {
          [styles.conentPadding]: defaultPatientInfo.patientName,
        })}
      >
        <Space justify="space-between" alignItems="center">
          {mineMainNavConfig.map((nav) => (
            <Space
              key={nav.title}
              className={styles.box}
              vertical
              justify="center"
              alignItems="center"
              onTap={() => navigateTo({ url: nav.url })}
            >
              <Image src={nav.image} className={styles.boxImg} />
              <Text className={styles.boxText}>{nav.title}</Text>
            </Space>
          ))}
        </Space>
        <Space vertical>
          {mineNavListConfig.map((list: List) => (
            <Space
              key={list.title}
              className={styles.list}
              alignItems="center"
              onTap={() => {
                if (list?.open) {
                  showToast({
                    title: '功能暂未开放!',
                    icon: 'none',
                  });
                  return;
                }
                if (list?.onClick) {
                  list.onClick();
                  return;
                }
                navigateTo({ url: list.url });
              }}
            >
              <Image
                className={styles.listLeftImg}
                src={list.image}
                mode="widthFix"
              />
              <Space
                className={styles.listItem}
                justify="space-between"
                alignItems="center"
              >
                <View>{list.title}</View>
                <Image
                  className={styles.listRightImg}
                  src={`${IMAGE_DOMIN}/mine/right.png`}
                  mode="widthFix"
                />
              </Space>
            </Space>
          ))}
        </Space>
      </View>
      <QrCodeModal
        show={show}
        name={defaultPatientInfo.patientName}
        patCardNo={defaultPatientInfo.patCardNo}
        content={defaultPatientInfo.patCardNo}
        close={() => {
          showTabBar();
          setShow(false);
        }}
      />
      {PLATFORM === 'web' && <TabBar active="我的" />}
    </View>
  );
};
