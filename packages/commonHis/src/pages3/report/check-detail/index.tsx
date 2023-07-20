import React, { useMemo } from 'react';
import { View, Text, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { PartTitle, Space, FormItem } from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import { CardItem } from '../inspect-detail';
import patientState from '@/stores/patient';
import useApi from '@/apis/report';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';
import { PatGender } from '@/config/dict';
import { getPatientAge } from '@/utils';

export default () => {
  const {
    defaultPatientInfo: { patientId },
  } = patientState.useContainer();
  const { reportId } = useGetParams<{ reportId: string }>();
  const {
    data: { data: detailData },
  } = useApi.查询检查报告详情({
    initValue: {
      data: {},
    },
    params: {
      patientId,
      checkId: decodeURIComponent(reportId),
    },
    needInit: !!reportId,
  });
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
      {
        label: '检查方法',
        text: detailData?.checkMethod,
      },
      {
        label: '检查部位',
        text: detailData?.checkPart,
      },
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
        text: detailData?.checkSituation || '暂无',
      },
      {
        label: '诊断意见',
        text: detailData?.option || '暂无',
      },
      {
        label: '建议',
        text: detailData?.advice || '暂无',
      },
      {
        label: '备注',
        text: detailData?.remarks || '暂无',
      },
    ],
    [detailData],
  );
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '检查报告详情',
    });
  });
  return (
    <View className={styles.page}>
      <Space className={styles.header}>
        <View className={styles.avatar}>
          <Image
            src={`${IMAGE_DOMIN}/usercenter/aldult-old.png`}
            className={styles.avatarImg}
            mode="aspectFit"
          />
        </View>
        <View>
          
          <View className={styles.headName}>
            {detailData?.patientName || '-'}
          </View>
          <View className={styles.headText}>
            <Text>{`性别:   ${PatGender[detailData?.patSex] || ''}`}</Text>
            <Text className={styles.headText2}>{`年龄:   ${getPatientAge(
              detailData?.patAge,
            )}`}</Text>
          </View>
        </View>
      </Space>
      <View className={styles.content}>
        <View className={styles.wrap}>
          <CardItem itemList={patientInfoList} />
          <CardItem itemList={checkList} />
        </View>

        {detailList.map((item, index) => (
          <React.Fragment key={index}>
            <PartTitle full bold elderly className={styles.partTitle}>
              <FormItem
                label={item.label}
                labelWidth="4em"
                className={styles.label}
                colon={false}
              />
            </PartTitle>
            <View className={styles.wrap}>
              <Space vertical className={styles.card}>
                {item.text}
              </Space>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};
