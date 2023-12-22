import React, { useMemo, useState } from 'react';
import { View, Text, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Table } from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME, PLATFORM } from '@/config/constant';
import useApi from '@/apis/report';
import useCommonApi from '@/apis/common';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';
import { ListItem } from '@/components';
import monitor from '@/alipaylog/monitor';
import AntFoestToast from '@/components/antFoestToast';
import { PatGender } from '@/config/dict';
import { getPatientAge } from '@/utils';

export default () => {
  const { reportId, patientId, patCardNo } = useGetParams<{
    reportId: string;
    patientId: string;
    patCardNo: string;
  }>();
  const {
    request,
    data: { data: detailData },
  } = useApi.查询检验报告详情({
    initValue: {
      data: {},
    },
    params: {
      patientId,
      patCardNo,
      inspectId: decodeURIComponent(reportId),
    },
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
        text: detailData?.inspectId,
      },
      // {
      //   label: '检验科室',
      //   text: detailData?.implementDeptName,
      // },
    ],
    [detailData],
  );
  const examList = useMemo(
    () => [
      {
        label: '检验项目',
        text: detailData?.inspectName,
      },
      // {
      //   label: '检验样本',
      //   text: detailData?.inspectSample,
      // },
      {
        label: '开单时间',
        text: detailData?.inspectTime,
      },
    ],
    [detailData],
  );

  const testList = useMemo(() => {
    return detailData?.items || [];
  }, [detailData]);

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
      title: '检验报告详情',
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
          <Text>{`${PatGender[detailData?.patSex] || ''} | ${getPatientAge(
            detailData?.patAge,
          )}`}</Text>
        </View>
        <View className={styles.list}>
          {patientInfoList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </View>
      </View>
      <View className={styles.wrap}>
        <View className={styles.list}>
          {examList.map((item) => (
            <ListItem key={item.label} {...item} />
          ))}
        </View>
      </View>
      <Table
        doubleColor={'#f1f5f7'}
        dataSource={testList}
        columns={[
          { title: '项目名称', dataIndex: 'itemName' },
          {
            title: '结果',
            dataIndex: 'result',
            render: (v, item) => (
              <Space
                alignItems={'center'}
                justify="center"
                className={styles.content}
              >
                <View className={styles.color}>{v}</View>
                {(item?.abnormal === '1' || item?.abnormal === '2') && (
                  <Image
                    src={`${IMAGE_DOMIN}/report/${
                      item.abnormal === '1' ? 'up' : 'down'
                    }.png`}
                    className={styles.flag}
                  />
                )}
              </Space>
            ),
          },
          { title: '参考值', dataIndex: 'refRange' },
          { title: '单位', dataIndex: 'itemUnit' },
        ]}
      />
    </View>
  );
};
