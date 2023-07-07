import React, { useEffect, useMemo } from 'react';
import { Image, View } from 'remax/one';
import styles from './index.less';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { IMAGE_DOMIN } from '@/config/constant';
import { Space, Tip } from '@kqinfo/ui';
import useApi from '@/apis/common';
import signState from 'commonHis/src/stores/sign';
import useGetParams from '@/utils/useGetParams';
import dayjs from 'dayjs';

export default () => {
  const { name, age, sex } = useGetParams<{
    name: string;
    age: string;
    sex: string;
  }>();

  const { signInfo } = signState.useContainer();

  const { request: signReq } = useApi.透传字段({
    params: {
      ...signInfo,
      drugInfo: JSON.stringify(signInfo?.drugInfo || '[]'),
      transformCode: 'KQ00069',
    },
    initValue: {
      data: {
        recordList: [],
      },
    },
    needInit: false,
  });
  const { data: queueData, request: getQueueReq } = useApi.透传字段({
    params: {
      ...signInfo,
      transformCode: 'KQ00070',
      drugInfo: JSON.stringify(signInfo?.drugInfo || '[]'),
    },
    needInit: false,
  });
  useEffect(() => {
    if (Object.keys(signInfo).length > 0) {
      signReq().then((r) => {
        if (r?.data?.data?.recordList?.length > 0) {
          getQueueReq();
        }
      });
    }
  }, [getQueueReq, signInfo, signReq]);

  const listArr = useMemo(
    () => [
      { label: '就诊人', value: `${name} ${sex}|${age}` },
      {
        label: '就诊科室',
        value: queueData?.data?.data?.recordList?.[0]?.deptName,
      },
      {
        label: '主治医生',
        value: queueData?.data?.data?.recordList?.[0]?.doctorName,
      },
      { label: '签到时间', value: dayjs().format('YYYY-MM-DD HH-mm-ss') },
      {
        label: '签到位置',
        value: `${queueData?.data?.data?.recordList?.[0]?.takingPosition}${queueData?.data?.data?.recordList?.[0]?.takingWindow}`,
      },
    ],
    [age, name, queueData?.data?.data?.recordList, sex],
  );

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '取药签到',
    });
  });

  return (
    <View className={styles.pageSignSign}>
      <View className={styles.header} />
      <Image
        src={`${IMAGE_DOMIN}/sign/banner.png`}
        className={styles.signBanner}
      />
      <View className={styles.signContent}>
        <View className={styles.signSuccess}>签到成功</View>
        <View className={styles.serial}>
          <View className={styles.serialItem}>
            <View className={styles.serialTitle}>当前排队序号</View>
            <View className={styles.serialNumber}>
              {queueData?.data?.data?.recordList?.[0]?.currentNum}
            </View>
          </View>
          <View className={styles.serialItem}>
            <View className={styles.serialTitle}>您的排队序号</View>
            <View className={styles.serialNumber2}>
              {queueData?.data?.data?.recordList?.[0]?.serialNum}
            </View>
          </View>
        </View>
        <Space vertical>
          <Space className={styles.parTitle} alignItems={'center'} size={20}>
            <Space className={styles.line} />
            <Space className={styles.title}>本次签到记录</Space>
          </Space>
          <Space className={styles.listContainer} vertical size={25}>
            {listArr?.map((item, index) => (
              <Space alignItems={'center'} key={index}>
                <View className={styles.labelCls}>{item.label}</View>
                <View style={{ color: '#999999' }}>:</View>
                <View className={styles.valueCls}>{item.value}</View>
              </Space>
            ))}
          </Space>
        </Space>
      </View>
      <Tip
        titleCls={styles.titleCls}
        className={styles.tip}
        items={['1.签到后，请关注取药窗口显示屏的排队进度']}
      />
    </View>
  );
};
