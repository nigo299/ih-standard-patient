/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import { View, Image, Text, redirectTo, navigateBack } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, BackgroundImg, showToast } from '@kqinfo/ui';
import patientState from '@/stores/patient';
import { IMAGE_DOMIN } from '@/config/constant';
import classNames from 'classnames';

import useApi from '@/apis/common';
import { ListItem } from '@/components';
import styles from './index.less';
import { PatGender } from '@/config/dict';

interface QueryDataType {
  averageTime: string;
  currentNum: string;
  deptLocation: string;
  deptName: string;
  doctorName: string;
  expectTime: string;
  frontNum: string;
  serialNum: string;
}

export default () => {
  const {
    defaultPatientInfo: {
      patientName,
      patCardNo,
      patHisNo,
      patientSex,
      patientAge,
    },
  } = patientState.useContainer();
  console.log(patHisNo);

  const [activeTab, setActiveTab] = useState(1);
  // const { request } = useApi.透传字段({
  //   needInit: false,
  // });
  //data: queueData,
  const { request } = useApi.排队进度查询({
    needInit: false,
    params: {
      patCardNo: patCardNo,
      queueType: 'visitation',
    },
  });

  const defaultQueryData = {
    averageTime: '',
    currentNum: '',
    deptLocation: '',
    deptName: '',
    doctorName: '',
    expectTime: '',
    frontNum: '',
    serialNum: '',
  };
  const [queryData, setQueryData] = useState<QueryDataType>(defaultQueryData);

  const queryDataList = useMemo(
    () => [
      {
        label: '就诊科室',
        text: queryData?.deptName,
      },
      {
        label: '就诊位置',
        text: queryData?.deptLocation,
      },
      {
        label: '医生信息',
        text: queryData?.doctorName,
      },
      {
        label: '就诊时段',
        text: queryData?.expectTime,
      },
    ],
    [queryData],
  );

  const tabs = [
    {
      title: '候诊排队',
      type: 'visitation', //visitation-就诊队列；examine-检查队列；inspect-检验队列；medicine-取药队列
    },
    // {
    //   title: '取药排队',
    //   type: 'medicine',
    // },
    // {
    //   title: '检查排队',
    //   type: 'examine',
    // },
    // {
    //   title: '检验排队',
    //   type: 'inspect',
    // },
  ];

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '排队进度',
    });
    if (!patCardNo) {
      redirectTo({
        url: '/pages2/usercenter/select-user/index?pageRoute=/pages/queue/index',
      });
    } else {
      request({
        // transformCode: 'KQ00007',
        patCardNo,
        queueType: 'visitation',
        patHisNo,
      }).then((res) => {
        const data = res?.data?.recordList;
        if (data?.length > 0) {
          setQueryData(data[0]);
        } else {
          showToast({
            icon: 'none',
            title: `当前就诊人暂无检查排队记录, 请重新选择就诊人!`,
          });
          setQueryData(defaultQueryData);
        }
      });
    }
  });
  return (
    <View className={styles.page}>
      <Space
        justify="space-between"
        alignItems="center"
        className={styles.patient}
        onTap={() => {
          redirectTo({
            url: '/pages2/usercenter/select-user/index?pageRoute=/pages/queue/index',
          });
        }}
      >
        <Space alignItems="center" justify="center">
          <Image
            src={`${IMAGE_DOMIN}/queue/avatar.png`}
            mode="aspectFit"
            className={styles.avatar}
          />
          <Space vertical className={styles.patientText}>
            <View>
              <Text className={styles.bold}>{patientName}</Text>{' '}
              {`${PatGender[patientSex] || ''} | ${patientAge}`}
            </View>
            <View>{patHisNo}</View>
          </Space>
        </Space>
        <Image
          src={`${IMAGE_DOMIN}/queue/qh.png`}
          mode="aspectFit"
          className={styles.icon}
        />
      </Space>
      <BackgroundImg
        className={styles.content}
        img={`${IMAGE_DOMIN}/queue/card.png`}
      >
        <Space vertical className={styles.wrapper}>
          <Space className={styles.tabs}>
            <View
              className={classNames(styles.tabLine, {
                [styles.tabLine2]: activeTab === 2,
                [styles.tabLine3]: activeTab === 3,
                [styles.tabLine4]: activeTab === 4,
              })}
            />
            {tabs.map((tab, index) => (
              <View
                key={tab.title}
                className={classNames(styles.tabTitle, {
                  [styles.tabActive]: activeTab === index + 1,
                })}
                onTap={() => {
                  // if (index === 2) {
                  //   showToast({
                  //     icon: 'none',
                  //     title: '取药排队暂未开放!',
                  //   });
                  //   return;
                  // }
                  request({
                    // transformCode: 'KQ00007',
                    patCardNo,
                    patHisNo,
                    queueType: String(tab.type),
                  }).then((res) => {
                    const data = res?.data?.recordList;
                    if (data?.length > 0) {
                      setQueryData(data[0]);
                    } else {
                      showToast({
                        icon: 'none',
                        title: `当前就诊人暂无${tab.title}记录, 请重新选择就诊人!`,
                      });
                      setQueryData(defaultQueryData);
                    }
                  });
                  setActiveTab(index + 1);
                }}
              >
                {tab.title}
              </View>
            ))}
          </Space>
          <Space justify="space-between" className={styles.cards}>
            <BackgroundImg
              img={`${IMAGE_DOMIN}/queue/bg2.png`}
              className={styles.card}
            >
              <Space
                vertical
                alignItems="center"
                justify="center"
                className={styles.item}
              >
                <View>当前就诊序号</View>
                <View className={classNames(styles.itemBold, styles.sizeLarge)}>
                  {queryData?.currentNum || 0}
                </View>
                <View className={styles.itemBold}>正在就诊</View>
              </Space>
            </BackgroundImg>
            <BackgroundImg
              img={`${IMAGE_DOMIN}/queue/bg1.png`}
              className={styles.card}
            >
              <Space
                vertical
                alignItems="center"
                justify="center"
                className={styles.item}
              >
                <View>您的就诊序号</View>
                <View
                  className={classNames(styles.itemBold2, styles.sizeLarge)}
                >
                  {queryData?.serialNum || 0}
                </View>
                <View className={styles.itemBold2}>等待叫号</View>
              </Space>
            </BackgroundImg>
          </Space>
          {queryDataList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </Space>
      </BackgroundImg>
    </View>
  );
};
