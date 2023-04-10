import React, { useCallback, useState } from 'react';
import { View, Image, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Space,
  Tile,
  PartTitle,
  QrCode,
  AffirmSheet,
  ColorText,
  showToast,
} from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import { QrCodeModalOld, TextAudio } from '@/components';
import patientState from '@/stores/patient';
import regsiterState from '@/stores/register';
import useApi from '@/apis/register';
import setPageStyle from '@/utils/setPageStyle';
import styles from './index.less';
import global from '@/stores/global';
import { reLaunchUrl } from '@/utils';
export interface NavType {
  title: string;
  audioText?: string;
  url: string;
  image: string;
  open?: boolean;
  onClick?: () => void;
}

export default () => {
  const {
    bindPatientList,
    getPatientList,
    defaultPatientInfo: { patientName, patCardNo, patientId },
  } = patientState.useContainer();
  const {
    data: { data: historyData },
  } = useApi.查询历史挂号记录({
    initValue: {
      data: {
        depts: [],
        doctors: [],
      },
    },
    params: {
      patCardNo,
      size: 5,
    },
    needInit: !!patCardNo && !!patientId,
  });
  const { setElderly } = global.useContainer();
  const { setDeptList, setHospitalList } = regsiterState.useContainer();
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const paymentNavConfig = [
    {
      title: '预约挂号',
      audioText: '预约挂号，通过手机提前挂号，安排就医计划，减少您的候诊时间',
      url: '',
      image: `${IMAGE_DOMIN}/home/yygh-old.png`,
    },
    {
      title: '门诊缴费',
      audioText: '门诊缴费，支持药品、检查、检验、治疗等项目在线自费支付',
      url: `/pages3/payment/order-list/index?patientId=${patientId}`,
      image: `${IMAGE_DOMIN}/home/mzjf-old.png`,
    },
    {
      title: '住院预缴',
      audioText: '住院预缴，通过提前预存住院金额，直接抵扣住院费用，方便快捷',
      url: `/pages3/inhosp/home/index?patientId=${patientId}`,
      image: `${IMAGE_DOMIN}/home/zyyj-old.png`,
    },
    {
      title: '排队进度',
      audioText: '排队进度，实时查询就诊人在本院的排队进度，及时推送排队消息',
      url: `/pages3/queue/index?patientId=${patientId}`,
      image: `${IMAGE_DOMIN}/home/pdjd-old.png`,
    },
  ];
  const searchNavConfig = [
    {
      title: '报告查询',
      audioText:
        '报告查询，您可以在此查询到您账号下就诊人在本院的各项检查检验等报告',
      url: `/pages3/report/report-list/index?patientId=${patientId}`,
      image: `${IMAGE_DOMIN}/home/bgcx-old.png`,
    },
    {
      title: '挂号记录',
      audioText: '挂号记录，您可以在此查询到您账号下就诊人在本院的所有挂号记录',
      url: '/pages3/register/order-list/index',
      image: `${IMAGE_DOMIN}/home/ghjl-old.png`,
    },
    {
      title: '缴费记录',
      audioText: '缴费记录，您可以在此查询到您账号下就诊人在本院的历史缴费记录',
      url: '/pages3/payment/paymented-list/index',
      image: `${IMAGE_DOMIN}/home/jfjl-old.png`,
    },
  ];
  const newSearchNavConfig =
    bindPatientList.length === 0 ||
    (historyData?.doctors?.length === 0 && historyData?.depts?.length === 0)
      ? [
          {
            title: '排队进度',
            audioText:
              '排队进度，实时查询就诊人在本院的排队进度，及时推送排队消息',
            url: `/pages3/queue/index?patientId=${patientId}`,
            image: `${IMAGE_DOMIN}/home/pdjd-old.png`,
          },
          ...searchNavConfig,
        ]
      : searchNavConfig;
  const handleNavClick = useCallback(
    async (nav: NavType) => {
      if (nav?.open) {
        showToast({
          title: '功能暂未开放!',
          icon: 'none',
        });
        return;
      }
      if (nav?.onClick) {
        nav.onClick();
        return;
      }
      if (nav.title === '预约挂号') {
        AffirmSheet.show({
          title: '挂号须知',
          cancelText: '取消',
          okText: '确定挂号',
          content: (
            <Space vertical size={70}>
              <span style={{ lineHeight: 1.2 }}>
                <ColorText color={'#D95E38'}>三天内有发热</ColorText>
                的患者，如未做新冠核酸检测，请先预约普通发热门诊就诊
              </span>
              <ColorText color={'#333333'}>每日号源更新时间：</ColorText>
              <Space vertical size={35}>
                <ColorText color={'#D95E38'}>预约号每天晚上19:00 </ColorText>
                <ColorText color={'#D95E38'}>当天号每天早上7:00 </ColorText>
              </Space>
            </Space>
          ),
        }).then(async () => {
          const { data, code } = await useApi.查询科室列表.request();
          if (code === 0 && data?.length === 1) {
            setDeptList(data[0].children);
            navigateTo({
              url: '/pages3/register/department/index',
            });
          }
          if (code === 0 && data.length > 1) {
            setHospitalList(data);
            setDeptList(data[0].children);
            navigateTo({
              url: '/pages3/register/select-hospital/index',
            });
          }
        });
        return;
      }
      navigateTo({
        url: nav.url,
      });
    },
    [setDeptList, setHospitalList],
  );
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: HOSPITAL_NAME,
      backgroundColor: '#AAD4FF',
    });
    if (!patientName && bindPatientList.length === 0) {
      getPatientList().then((patient) => {
        if (patient.length === 0) {
          setPageStyle({
            overflow: 'hidden',
          });
          setModal(true);
        }
      });
    }
  });
  return (
    <View className={styles.page}>
      <Space vertical className={styles.header}>
        <Space justify="space-between" alignItems="center">
          <Space
            alignItems="center"
            className={styles.search}
            onTap={() =>
              navigateTo({
                url: '/pages3/search/index',
              })
            }
          >
            <Image
              src={`${IMAGE_DOMIN}/home/search-old.png`}
              className={styles.searchImg}
              mode="aspectFit"
            />
            <Text>输入医生或者科室名字查询</Text>
          </Space>
          <Space
            className={styles.switch}
            vertical
            justify="center"
            alignItems="center"
            size={8}
            onTap={() => {
              setElderly(false);
              reLaunchUrl('/pages/home/index');
            }}
          >
            <Space alignItems="center" justify="center">
              <Image
                src={`${IMAGE_DOMIN}/home/switch-old.png`}
                className={styles.switchImg}
                mode="aspectFit"
              />
              <Text>切换</Text>
            </Space>
            <View>详情版</View>
          </Space>
        </Space>

        <Space className={styles.add} justify="center" alignItems="center">
          {bindPatientList.length === 0 ? (
            <Space
              className={styles.addBtn2}
              justify="center"
              alignItems="center"
              onTap={() =>
                navigateTo({
                  url: `/pages3/usercenter/user-manage/index?jumpPage=home`,
                })
              }
            >
              +添加就诊人
            </Space>
          ) : (
            <Space
              justify="space-between"
              flex="auto"
              onTap={() =>
                navigateTo({
                  url: `/pages3/usercenter/user-info/index?patientId=${patientId}`,
                })
              }
            >
              <View>
                <View className={styles.addName}>{patientName}</View>
                <View className={styles.addText}>就诊号：{patCardNo}</View>
                <Space
                  justify="center"
                  alignItems="center"
                  className={styles.addBtn}
                  onTap={(e) => {
                    e.stopPropagation();
                    navigateTo({
                      url: '/pages3/usercenter/select-user/index?pageRoute=/pages3/home/index&jumpPage=home',
                    });
                  }}
                >
                  点击切换就诊人
                </Space>
              </View>
              <View>
                <Space
                  className={styles.qrcode}
                  onTap={(e) => {
                    e.stopPropagation();
                    setPageStyle({
                      overflow: 'hidden',
                    });
                    setShow(true);
                  }}
                  justify="center"
                  alignItems="center"
                >
                  <QrCode content={patCardNo} className={styles.qrcodeImg} />
                </Space>
                <View className={styles.qrcodeText}>点击放大</View>
              </View>
            </Space>
          )}
        </Space>
      </Space>
      {bindPatientList.length === 0 ||
      (historyData?.depts?.length === 0 &&
        historyData?.doctors?.length === 0) ? (
        <>
          <PartTitle full bold elderly>
            门诊服务
          </PartTitle>
          <View className={styles.layout}>
            <Space size={20}>
              <Tile
                vertical
                size={'large'}
                image={`${IMAGE_DOMIN}/home/yygh-old.png`}
                title={'预约挂号'}
                tag={'热门推荐'}
                backgroundColor={'#5686e9'}
                onTap={() => handleNavClick(paymentNavConfig[0])}
                light
              />
              <Space vertical size={20}>
                <Tile
                  image={`${IMAGE_DOMIN}/home/mzjf-old.png`}
                  title={'门诊缴费'}
                  backgroundColor={'#EBAA57'}
                  onTap={() => handleNavClick(paymentNavConfig[1])}
                  light
                />
                <Tile
                  image={`${IMAGE_DOMIN}/home/zyyj-old.png`}
                  onTap={() => handleNavClick(paymentNavConfig[2])}
                  title={'住院预缴'}
                  backgroundColor={'#EA7C62'}
                  light
                />
              </Space>
            </Space>
          </View>
        </>
      ) : (
        <>
          <PartTitle full bold elderly>
            就诊历史
          </PartTitle>
          <View className={styles.layout}>
            <Space size={20}>
              <Tile
                image={`${IMAGE_DOMIN}/home/doctor-old.png`}
                title={`${historyData?.doctors[0]?.name}`}
                subtitle={historyData?.doctors[0]?.deptName || ' '}
                size={'large'}
                tag={'历史医生'}
                backgroundColor={'#5686E9'}
                vertical
                light
                onTap={() =>
                  navigateTo({
                    url: '/pages3/register/history-doctors/index',
                  })
                }
              />
              <Tile
                image={`${IMAGE_DOMIN}/home/dept-old.png`}
                title={historyData?.depts[0]?.name}
                subtitle={historyData.depts[0]?.parentDeptName || ' '}
                size={'large'}
                tag={'历史科室'}
                backgroundColor={'#00B8A9'}
                vertical
                light
                onTap={() =>
                  navigateTo({
                    url: '/pages3/register/history-depts/index',
                  })
                }
              />
            </Space>
          </View>
          <PartTitle full bold elderly>
            就诊服务
          </PartTitle>
          <Space vertical size={20} className={styles.layout}>
            {paymentNavConfig.map((item) => (
              <Space
                justify="space-between"
                key={item.title}
                alignItems={'center'}
                size={20}
              >
                <Tile
                  size={'small'}
                  image={item.image}
                  title={item.title}
                  onTap={() => handleNavClick(item)}
                />
                <TextAudio text={item.audioText} id={item.title} />
              </Space>
            ))}
          </Space>
        </>
      )}
      <PartTitle full bold elderly>
        查询记录
      </PartTitle>
      <Space vertical size={20} className={styles.layout}>
        {newSearchNavConfig.map((item) => (
          <Space
            justify="space-between"
            key={item.title}
            alignItems={'center'}
            size={20}
          >
            <Tile
              size={'small'}
              image={item.image}
              title={item.title}
              onTap={() => handleNavClick(item)}
            />
            <TextAudio text={item.audioText} id={item.title} />
          </Space>
        ))}
      </Space>
      <QrCodeModalOld
        show={show}
        name="电子就诊卡"
        content={patCardNo}
        close={() => {
          setPageStyle({
            overflow: 'inherit',
          });
          setShow(false);
        }}
      />
      <AffirmSheet elderly />
      {modal && (
        <Space
          className={styles.modal}
          vertical
          alignItems="center"
          onTap={() => {
            setPageStyle({
              overflow: 'inherit',
            });
            setModal(false);
          }}
        >
          <Space
            justify="center"
            alignItems="center"
            className={styles.modalBtn}
          >
            +添加就诊人
          </Space>
          <View className={styles.modalText}>点击空白处关闭</View>
        </Space>
      )}
    </View>
  );
};
