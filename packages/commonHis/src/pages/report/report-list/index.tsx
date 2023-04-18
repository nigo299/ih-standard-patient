import React, { useState, useMemo } from 'react';
import { View, Image, redirectTo, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Exceed, Tab, Loading } from '@kqinfo/ui';
import { IMAGE_DOMIN, THEME_COLOR, THEME_COLOR2 } from '@/config/constant';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/report';
import styles from './index.less';
import reportCmPV from '@/alipaylog/reportCmPV';
import ReportTab from '@/pages/report/report-list/components/report-tab';

export default () => {
  const { patientId } = useGetParams<{ patientId: string }>();
  const {
    loading,
    data: {
      data: { reportList, patientName, patCardNo },
    },
  } = useApi.查询报告列表({
    initValue: {
      data: {
        patCardNo: '',
        patientName: '',
        reportList: [],
      },
    },
    params: {
      patientId,
    },
    needInit: !!patientId,
  });
  const [tabIndex, setTabIndex] = useState<number | string>(1);
  const getStatus = (item: any) => {
    const { reportStatus } = item;
    return {
      text: reportStatus === '3' ? '已出结果' : '未出结果',
      color: reportStatus === '3' ? THEME_COLOR : THEME_COLOR2,
    };
  };

  /** 检查报告 */
  const examData = useMemo(() => {
    if (reportList) {
      return reportList?.filter((item) => String(item.reportType) === '1');
    }
    return [];
  }, [reportList]);

  /** 检验报告 */
  const testData = useMemo(() => {
    if (reportList) {
      return reportList?.filter((item) => String(item.reportType) === '2');
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

  usePageEvent('onShow', (query) => {
    reportCmPV({ title: '检查检验报告查询', query });
    setNavigationBar({
      title: '报告查询',
    });
    if (!patientId) {
      redirectTo({
        url: '/pages2/usercenter/select-user/index?pageRoute=/pages/report/report-list/index',
      });
    }
  });
  return (
    <View>
      {loading && <Loading type={'top'} />}
      <View className={styles.user}>
        <View className={styles.name}>{`就诊人：${patientName}`}</View>
        <View
          className={styles.toggle}
          onTap={() => {
            redirectTo({
              url: '/pages2/usercenter/select-user/index?pageRoute=/pages/report/report-list/index',
            });
          }}
        >
          切换就诊人
        </View>
      </View>
      <ReportTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        patCardNo={patCardNo}
      />

      <View className={styles.body}>
        <View className={styles.card}>
          <View className={styles.lists}>
            {showList.map((item, index) => (
              <View
                className={styles.item}
                key={index}
                onTap={() => {
                  if (item.reportStatus !== '3') {
                    return;
                  }
                  if (tabIndex === 1) {
                    navigateTo({
                      url: `/pages/report/inspect-detail/index?reportId=${encodeURIComponent(
                        item.reportId,
                      )}&patientId=${patientId}&patCardNo=${patCardNo}`,
                    });
                  }
                  if (tabIndex === 2) {
                    navigateTo({
                      url: `/pages/report/check-detail/index?reportId=${encodeURIComponent(
                        item.reportId,
                      )}&patientId=${patientId}&patCardNo=${patCardNo}`,
                    });
                  }
                }}
              >
                <View className={styles.left}>
                  <Exceed clamp={1} className={styles.reportName}>
                    {item.reportName}
                  </Exceed>
                  <View className={styles.reportDate}>{item.reportTime}</View>
                </View>
                <View className={styles.right}>
                  <View
                    className={styles.status}
                    style={{ color: getStatus(item).color }}
                  >
                    {getStatus(item).text}
                  </View>
                  {item.reportStatus === '3' && (
                    <Image
                      src={`${IMAGE_DOMIN}/report/right.png`}
                      className={styles.arrow}
                    />
                  )}
                </View>
              </View>
            ))}
            {showList.length === 0 && (
              <View className={styles.notext}>暂无数据</View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
