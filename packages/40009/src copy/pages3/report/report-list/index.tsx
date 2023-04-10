import React, { useState, useMemo, useCallback } from 'react';
import { View, navigateTo, redirectTo, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Button, Exceed } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';
import { NoDataOld, SwitchPatient } from '@/components';
import useApi, { ReportType } from '@/apis/report';
import patientState from '@/stores/patient';
import { IMAGE_DOMIN } from '@/config/constant';
import classNames from 'classnames';
import styles from './index.less';

export default () => {
  const {
    defaultPatientInfo: { patientName, patientId: defaPatientId },
  } = patientState.useContainer();
  const { patientId } = useGetParams<{ patientId: string }>();
  const [reportList, setReportList] = useState<ReportType[]>([]);
  const [tabIndex, setTabIndex] = useState<number | string>(1);
  /** 检查报告 */
  const examData = useMemo(() => {
    if (reportList) {
      return reportList.filter((item) => String(item.reportType) === '1');
    }
    return [];
  }, [reportList]);

  /** 检验报告 */
  const testData = useMemo(() => {
    if (reportList) {
      return reportList.filter((item) => String(item.reportType) === '2');
    }
    return [];
  }, [reportList]);

  const showList = useMemo(() => {
    if (tabIndex === 1) {
      return testData;
    }
    if (tabIndex === 2) {
      return examData;
    }
    return [];
  }, [testData, examData, tabIndex]);

  const getReportList = useCallback(async () => {
    const { data, code } = await useApi.查询报告列表.request({
      patientId: defaPatientId || patientId,
    });
    if (code === 0 && data?.reportList) {
      setReportList(data.reportList);
    }
  }, [defaPatientId, patientId]);
  usePageEvent('onShow', () => {
    if (reportList.length === 0) {
      getReportList();
    }
    setNavigationBar({
      title: '报告查询',
    });
    if (!defaPatientId && !patientId) {
      redirectTo({
        url: '/pages3/usercenter/select-user/index?pageRoute=/pages/report/report-list/index',
      });
    }
  });
  return (
    <View className={styles.page}>
      <SwitchPatient
        patientName={patientName}
        redirectUrl="/pages3/usercenter/select-user/index?pageRoute=/pages3/report/report-list/index"
      />
      <View className={styles.top} />
      {tabIndex === 1 ? (
        <View className={styles.tabWarp}>
          <Image
            src={`${IMAGE_DOMIN}/report/tab-left.png`}
            className={styles.tabImg}
          />
          <View className={classNames(styles.leftText, styles.tabTextActive)}>
            检验报告
          </View>
          <View
            className={classNames(styles.rightText, styles.tabText)}
            onTap={() => {
              setTabIndex(2);
            }}
          >
            检查报告
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
            onTap={() => setTabIndex(1)}
          >
            检验报告
          </View>
          <View className={classNames(styles.rightText, styles.tabTextActive)}>
            检查报告
          </View>
        </View>
      )}
      <View className={styles.content}>
        {showList.map((item, index) => (
          <Space
            className={styles.item}
            key={index}
            justify="space-between"
            alignItems="center"
            onTap={() => {
              if (item.reportStatus !== '3') {
                return;
              }
              if (tabIndex === 1) {
                navigateTo({
                  url: `/pages3/report/inspect-detail/index?reportId=${encodeURIComponent(
                    item.reportId,
                  )}`,
                });
              }
              if (tabIndex === 2) {
                navigateTo({
                  url: `/pages3/report/check-detail/index?reportId=${encodeURIComponent(
                    item.reportId,
                  )}`,
                });
              }
            }}
          >
            <Space vertical className={styles.left} size={20}>
              <Exceed className={styles.reportName}>{item.reportName}</Exceed>
              <View className={styles.reportDate}>{item.reportTime}</View>
            </Space>

            {item.reportStatus === '3' ? (
              <Button className={styles.beenBtn} type="primary" block={false}>
                <Space vertical alignItems="center" size={16}>
                  <View className={styles.beenText}>查看</View>
                  <View className={styles.beenText2}>已出结果</View>
                </Space>
              </Button>
            ) : (
              <Button className={styles.notBtn} block={false}>
                未出结果
              </Button>
            )}
          </Space>
        ))}
        {showList.length === 0 && <NoDataOld />}
      </View>
    </View>
  );
};
