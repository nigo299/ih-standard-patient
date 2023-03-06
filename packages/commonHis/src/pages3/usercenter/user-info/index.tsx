import React, { useCallback, useState } from 'react';
import { View, Image, navigateBack } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Button, showToast } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { ListItem } from '@/components';
import patientState from '@/stores/patient';
import useApi from '@/apis/usercenter';
import { MediCardOld, HealthCardOld } from './compoents';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';
import classNames from 'classnames';

export default () => {
  const {
    bindPatientList,
    defaultPatientInfo,
    setDefaultPatientInfo,
    setBindPatientList,
    getPatientList,
  } = patientState.useContainer();
  const { patientId } = useGetParams<{ patientId: string }>();
  const [selectTab, setSelectTab] = useState<1 | 2>(1);
  const {
    data: { data: userInfo },
  } = useApi.查询就诊人详情({
    initValue: {
      data: { data: {} },
    },
    params: {
      patientId,
      idFullTransFlag: '1',
    },
    needInit: !!patientId,
  });
  const patientList = [
    {
      label: '姓名',
      text: userInfo?.parentName,
    },
    {
      label: '性别',
      text: userInfo?.patientSex === 'M' ? '男' : '女',
    },
    {
      label: '身份证号',
      text: userInfo?.idNo,
    },
    {
      label: '手机号',
      text: userInfo?.patientMobile,
    },
  ];
  const {
    request,
    data: { data: jkkInfo },
  } = useApi.查询电子健康卡详情({
    initValue: {
      data: { qrCodeText: '', address: '' },
    },
    params: {
      patientId,
    },
    needInit: false,
  });
  const unBindPatient = useCallback(async () => {
    const { code, msg } = await useApi.解绑就诊人.request({ patientId });
    if (code === 0) {
      if (
        bindPatientList.length === 1 &&
        bindPatientList[0].patientName === defaultPatientInfo.patientName
      ) {
        setDefaultPatientInfo({
          ...defaultPatientInfo,
          patientName: '',
          patCardNo: '',
          patientFullIdNo: '',
        });
        setBindPatientList([]);
      } else {
        getPatientList();
      }
      showToast({
        title: msg || '删除成功',
        icon: 'success',
      }).then(() => navigateBack());
    }
  }, [
    bindPatientList,
    defaultPatientInfo,
    getPatientList,
    patientId,
    setBindPatientList,
    setDefaultPatientInfo,
  ]);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '就诊人详情',
    });
  });

  return (
    <View className={styles.page}>
      <View className={styles.top} />
      {selectTab === 1 ? (
        <View className={styles.tabWarp}>
          <Image
            src={`${IMAGE_DOMIN}/report/tab-left.png`}
            className={styles.tabImg}
          />
          <View className={classNames(styles.leftText, styles.tabTextActive)}>
            电子就诊卡
          </View>
          <View
            className={classNames(styles.rightText, styles.tabText)}
            onTap={() => {
              request();
              setSelectTab(2);
            }}
          >
            电子健康卡
          </View>
        </View>
      ) : (
        <View className={styles.tabWarp}>
          <Image
            src={`${IMAGE_DOMIN}/report/tab-right.png`}
            className={styles.tabImg}
          />
          <View
            className={classNames(styles.leftText, styles.tabText)}
            onTap={() => setSelectTab(1)}
          >
            电子就诊卡
          </View>
          <View className={classNames(styles.rightText, styles.tabTextActive)}>
            电子健康卡
          </View>
        </View>
      )}
      <Space className={styles.content} vertical justify="center">
        {selectTab === 1 ? (
          <MediCardOld
            patCardNo={userInfo?.patCardNo}
            patientName={userInfo?.patientName}
          />
        ) : (
          <HealthCardOld
            patCardNo={userInfo?.patCardNo}
            patientName={userInfo?.patientName}
            qrCode={jkkInfo?.qrCodeText}
          />
        )}
        <Space justify="center" className={styles.tip}>
          就诊时出示二维码(点击二维码放大查看)
        </Space>
        <View className={styles.card}>
          {patientList.map((item) => (
            <ListItem key={item.label} {...item} elderly />
          ))}
        </View>

        <Button type="primary" ghost elderly onTap={unBindPatient}>
          删除就诊人
        </Button>
      </Space>
    </View>
  );
};
