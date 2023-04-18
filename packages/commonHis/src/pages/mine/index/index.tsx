import React, { useState } from 'react';
import { View, Text, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { mineMainNavConfig, mineNavListConfig } from '@/config';
import { HOSPITAL_NAME, IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import {
  Space,
  PartTitle,
  Icon,
  showToast,
  BackgroundImg,
  Swiper,
  QrCode,
  FormItem,
} from '@kqinfo/ui';
import { TabBar, PreviewImage, QrCodeModal } from '@/components';
import patientState from '@/stores/patient';
import globalState from '@/stores/global';
import styles from './index.less';
import classNames from 'classnames';
import { encryptPhone } from '@/utils';
import useApi from '@/apis/usercenter';
import { useEffectState } from 'parsec-hooks';
import hideTabBar from '@/utils/hideTabBar';
import showTabBar from '@/utils/showTabBar';
import { handleMineNavTap } from '@/pages/mine/index/utils';
export default () => {
  const { getPatientList, bindPatientList } = patientState.useContainer();
  const [selectPatient, setSelectPatient] = useEffectState(
    bindPatientList.filter((item) => item.isDefault === 1)[0],
  );
  const {
    data: { data: jkkInfo, msg: errorMsg },
  } = useApi.查询电子健康卡详情({
    initValue: {
      data: { qrCodeText: '', address: '' },
    },
    params: {
      patientId: selectPatient?.patientId,
    },
    needInit: !!selectPatient?.patientId,
  });
  const { user, getUserInfo } = globalState.useContainer();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  usePageEvent('onShow', () => {
    getUserInfo(true);
    getPatientList(true);
    setNavigationBar({
      title: '个人中心',
    });
  });
  return (
    <View
      className={classNames(styles.page, {
        [styles.page2]: bindPatientList.length === 0,
      })}
    >
      <Space
        alignItems="flex-end"
        className={styles.users}
        onTap={() =>
          navigateTo({
            url: '/pages/mine/user-info/index',
          })
        }
      >
        <View className={styles.userAvatar}>
          <PreviewImage
            url={user?.headImage || `${IMAGE_DOMIN}/mine/user.png`}
            className={styles.userImg}
          />
          <Space
            className={styles.userTag}
            justify="center"
            alignItems="center"
          >
            用户
          </Space>
        </View>
        <Space
          className={styles.userWrap}
          justify="space-between"
          alignItems="center"
          flex="auto"
        >
          <View className={styles.userMobile}>
            {encryptPhone(user?.mobile || '')}
          </View>
          <View className={styles.userText}>{`编辑个人资料>`}</View>
        </Space>
      </Space>
      <View className={styles.card1}>
        <Space justify="space-between" alignItems="center">
          <PartTitle>就诊人管理</PartTitle>
          <Space
            justify="center"
            alignItems="center"
            className={styles.cardText}
            onTap={() =>
              navigateTo({
                url: '/pages2/usercenter/user-list/index',
              })
            }
          >
            <View> 全部</View>
            <View className={styles.cardText2}>{'>'}</View>
          </Space>
        </Space>
        <Space alignItems="center">
          {bindPatientList.length === 0 ? (
            <Space
              justify="space-between"
              alignItems="center"
              className={styles.addWrap}
              onTap={() =>
                navigateTo({
                  url: '/pages2/usercenter/add-user/index',
                })
              }
            >
              <Space
                justify="center"
                alignItems="center"
                className={styles.addBtn}
              >
                +
              </Space>
              <Space vertical justify="center">
                <View className={styles.addText}>点击添加就诊人</View>
                <View className={styles.addText2}>最多可添加5人</View>
              </Space>
            </Space>
          ) : (
            <Space vertical alignItems="flex-start">
              <Space
                className={styles.patients}
                justify="flex-start"
                size={24}
                ignoreNum={5}
              >
                {bindPatientList.map((patient, index) => (
                  <Space key={index} vertical alignItems="center">
                    <Space
                      vertical
                      justify="space-between"
                      alignItems="center"
                      className={classNames(styles.patientWrap, {
                        [styles.patientWrapActive]:
                          patient?.patCardNo === selectPatient?.patCardNo,
                      })}
                    >
                      <Space
                        justify="center"
                        alignItems="center"
                        className={styles.patientRound}
                        onTap={() => {
                          if (patient.isDefault !== 1) {
                            useApi.设置默认就诊人.request({
                              patientId: patient.patientId,
                            });
                          }
                          setSelectPatient(patient);
                        }}
                      >
                        <Space
                          justify="center"
                          alignItems="center"
                          className={styles.patient}
                        >
                          {patient.patientName}
                        </Space>
                      </Space>
                      {patient?.patCardNo === selectPatient?.patCardNo && (
                        <View className={styles.defaultText}>默认就诊人</View>
                      )}
                    </Space>
                  </Space>
                ))}
                {bindPatientList.length < 5 && (
                  <Space
                    vertical
                    justify="space-between"
                    alignItems="center"
                    className={styles.patientWrap}
                  >
                    <Space
                      justify="center"
                      alignItems="center"
                      className={styles.patientRound}
                      onTap={() => {
                        navigateTo({
                          url: '/pages2/usercenter/add-user/index',
                        });
                      }}
                    >
                      <Space
                        justify="center"
                        alignItems="center"
                        className={styles.addRound}
                      >
                        +
                      </Space>
                    </Space>
                    <View className={styles.addRoundText}>
                      还可添加{` ${5 - bindPatientList.length} `}人
                    </View>
                  </Space>
                )}
              </Space>
              <Space className={styles.card3}>
                <Swiper
                  className={styles.swiper}
                  circular
                  indicatorDots={false}
                  nextMargin={'20px'}
                  items={[
                    {
                      node: (
                        <Space
                          className={styles.mediCard}
                          vertical
                          onTap={() => {
                            navigateTo({
                              url: `/pages2/usercenter/user-info/index?patientId=${selectPatient?.patientId}&tab=1`,
                            });
                          }}
                        >
                          <Space justify="space-between">
                            <Space alignItems="center">
                              <Image
                                src={`${IMAGE_DOMIN}/mine/logo.png`}
                                className={styles.logo}
                              />
                              <View className={styles.hospitalName}>
                                {HOSPITAL_NAME}
                              </View>
                            </Space>
                            <Space
                              justify="center"
                              alignItems="center"
                              className={styles.mediaTag}
                            >
                              电子就诊卡
                            </Space>
                          </Space>
                          <Space
                            justify="space-between"
                            alignItems="center"
                            flex="auto"
                            className={styles.mediaWrap}
                          >
                            <Space vertical size={24}>
                              <Space className={styles.mediItem}>
                                <FormItem label="就诊人" labelWidth={'4em'} />
                                {selectPatient?.patientName}
                              </Space>
                              <Space className={styles.mediItem}>
                                <FormItem label="就诊号" labelWidth={'4em'} />
                                {selectPatient?.patCardNo}
                              </Space>
                            </Space>
                            <Space
                              vertical
                              justify="center"
                              alignItems="center"
                              onTap={(e) => {
                                e.stopPropagation();
                                hideTabBar();
                                setShow(true);
                              }}
                            >
                              <Space
                                className={styles.mediaQrcode}
                                justify="center"
                                alignItems="center"
                              >
                                <QrCode
                                  content={selectPatient?.patCardNo || ''}
                                  className={styles.mediaQrcodeImg}
                                />
                              </Space>
                              <View className={styles.mediaQrcodeText}>
                                点击放大
                              </View>
                            </Space>
                          </Space>
                        </Space>
                      ),
                    },
                    {
                      node: (
                        <BackgroundImg
                          img={`${IMAGE_DOMIN}/mine/dzjkk.png`}
                          className={styles.healthCard}
                        >
                          <Space
                            justify="space-between"
                            alignItems="center"
                            flex="auto"
                            className={styles.healthWrap}
                            onTap={() => {
                              if (jkkInfo?.qrCodeText) {
                                navigateTo({
                                  url: `/pages2/usercenter/user-info/index?patientId=${selectPatient?.patientId}&tab=2`,
                                });
                              }
                            }}
                          >
                            <Space vertical size={24}>
                              <Space className={styles.mediItem}>
                                <FormItem label="就诊人" labelWidth={'4em'} />
                                {selectPatient?.patientName}
                              </Space>
                              <Space className={styles.mediItem}>
                                <FormItem label="就诊号" labelWidth={'4em'} />
                                {selectPatient?.patCardNo}
                              </Space>
                            </Space>
                            <Space
                              vertical
                              justify="center"
                              alignItems="center"
                              onTap={(e) => {
                                e.stopPropagation();
                                if (jkkInfo?.qrCodeText) {
                                  hideTabBar();
                                  setShow2(true);
                                }
                              }}
                            >
                              <Space
                                className={styles.mediaQrcode2}
                                justify="center"
                                alignItems="center"
                              >
                                <Image
                                  src={`data:image/jpeg;base64,${jkkInfo?.qrCodeText}`}
                                  className={styles.mediaQrcodeImg}
                                />
                              </Space>
                              <View className={styles.mediaQrcodeText}>
                                点击放大
                              </View>
                            </Space>
                          </Space>

                          {!jkkInfo?.qrCodeText && (
                            <Space
                              justify="center"
                              alignItems="center"
                              className={styles.healthPropmt}
                            >
                              {errorMsg || '电子健康卡领取失败!'}
                            </Space>
                          )}
                        </BackgroundImg>
                      ),
                    },
                  ]}
                />
              </Space>
            </Space>
          )}
        </Space>
      </View>
      <View className={styles.card2}>
        <PartTitle className={styles.partTitle}>我的订单</PartTitle>
        <Space
          justify="space-between"
          alignItems="center"
          className={styles.navs}
        >
          {mineMainNavConfig.map((nav) => (
            <Space
              key={nav.title}
              className={styles.box}
              vertical
              justify="center"
              alignItems="center"
              onTap={() => navigateTo({ url: nav.url })}
            >
              <Image src={nav.image} className={classNames(styles.boxImg)} />
              <Text className={styles.boxText}>{nav.title}</Text>
            </Space>
          ))}
        </Space>
      </View>
      <Space vertical className={styles.lists}>
        {mineNavListConfig.map((list) => (
          <Space
            key={list.title}
            className={styles.list}
            alignItems="center"
            justify="space-between"
            onTap={() => {
              if (list?.open) {
                showToast({
                  title: '功能暂未开放!',
                  icon: 'none',
                });
                return;
              }
              handleMineNavTap(list, {
                patientInfo: selectPatient,
              });
            }}
          >
            <Space alignItems="center">
              <Space
                justify="center"
                alignItems="center"
                className={styles.listLeft}
              >
                <Image
                  className={styles.listLeftImg}
                  src={list.image}
                  mode="widthFix"
                />
              </Space>
              <View>{list.title}</View>
            </Space>

            <Icon
              name="kq-right"
              color="#CBCCCB"
              className={styles.rightIcon}
            />
          </Space>
        ))}
      </Space>

      <QrCodeModal
        show={show}
        name={`${selectPatient?.patientName} | ${selectPatient?.patCardNo}`}
        content={selectPatient?.patCardNo || ''}
        close={() => {
          setShow(false);
          showTabBar();
        }}
      />

      <QrCodeModal
        show={show2}
        type="health"
        name={`${selectPatient?.patientName} | ${selectPatient?.patCardNo}`}
        content={jkkInfo?.healthCardId || ''}
        close={() => {
          setShow2(false);
          showTabBar();
        }}
      />
      {PLATFORM === 'web' && <TabBar active="我的" />}
    </View>
  );
};
