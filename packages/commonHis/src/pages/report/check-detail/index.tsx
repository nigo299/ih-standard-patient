import React, { useMemo, useState } from 'react';
import { View, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useApi from '@/apis/report';
import useCommonApi from '@/apis/common';
import useGetParams from '@/utils/useGetParams';
import { HOSPITAL_NAME, PLATFORM } from '@/config/constant';
import styles from './index.less';
import { ListItem } from '@/components';
import monitor from '@/alipaylog/monitor';
import AntFoestToast from '@/components/antFoestToast';
import { PatGender } from '@/config/dict';

export default () => {
  const { reportId, patientId, patCardNo } = useGetParams<{
    reportId: string;
    patientId: string;
    patCardNo: string;
  }>();
  const {
    request,
    data: { data: detailData },
  } = useApi.查询检查报告详情({
    initValue: {
      data: {},
    },
    params: {
      patientId,
      patCardNo,
      checkId: decodeURIComponent(reportId),
    },
    needInit: !!reportId,
  });
  const [show, setShow] = useState(false);
  const patientInfoList = useMemo(
    () => [
      {
        label: '就诊医院',
        text: HOSPITAL_NAME,
      },
      {
        label: '开单科室',
        text: detailData?.deptName,
      },
      {
        label: '开单医生',
        text: detailData?.doctorName,
      },
      {
        label: '报告单号',
        text: detailData?.checkId,
      },
      {
        label: '检查科室',
        text: detailData?.deptName,
      },
    ],
    [detailData],
  );

  const checkList = useMemo(
    () => [
      {
        label: '检查名称',
        text: detailData?.checkName,
      },
      // {
      //   label: '检查方法',
      //   text: detailData?.checkMethod,
      // },
      // {
      //   label: '检查部位',
      //   text: detailData?.checkPart,
      // },
      {
        label: '检查时间',
        text: detailData?.reportTime,
      },
    ],
    [detailData],
  );

  const detailList = useMemo(
    () => [
      {
        label: '检查所见',
        text: detailData?.checkSituation,
      },
      {
        label: '诊断意见',
        text: detailData?.option,
      },
      // {
      //   label: '检查结果',
      //   text: detailData?.advice,
      // },
      // {
      //   label: '备注',
      //   text: detailData?.remarks,
      // },
    ],
    [detailData],
  );
  usePageEvent('onShow', () => {
    request().then((res) => {
      if (res.code === 0) {
        monitor.api({
          api: '报告查询',
          success: true,
          c1: 'taSR_YL',
          time: 200,
        });
      } else {
        monitor.api({
          api: '报告查询',
          success: false,
          c1: 'taSR_YL',
          time: 200,
        });
      }
    });
    if (PLATFORM === 'ali') {
      useCommonApi.蚂蚁森林能量获取
        .request({
          scene: '2',
        })
        .then((res) => {
          if (res.data) {
            setShow(true);
            setTimeout(() => {
              setShow(false);
            }, 2000);
          }
        });
    }
    setNavigationBar({
      title: '检查报告详情',
    });
  });
  return (
    <View className={styles.page}>
      <AntFoestToast
        show={show}
        close={() => setShow(false)}
        number={2}
        type="search"
      />
      <View className={styles.wrap}>
        <View className={styles.user}>
          <Text>{detailData?.patientName}</Text>
          <Text>{`${PatGender[detailData?.patSex] || ''} | ${
            detailData?.patAge || '-'
          }岁`}</Text>
        </View>
        <View className={styles.list}>
          {patientInfoList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </View>
      </View>
      <View className={styles.wrap}>
        <View className={styles.list}>
          {checkList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </View>
      </View>
      <View className={styles.wrap}>
        <View className={styles.info}>
          {detailList.map((item) => (
            <View key={item.label}>
              <View className={styles.infoTitle}>
                <View className={styles.label}>{item.label}</View>
                <View className={styles.separator}>:</View>
              </View>
              <View className={styles.infoContent}>{item.text || '暂无'}</View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
