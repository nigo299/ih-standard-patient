import React, { useMemo } from 'react';
import { View, Text, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { FormItem, Space, Exceed, PartTitle } from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import patientState from '@/stores/patient';
import useApi from '@/apis/report';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';

export default () => {
  const {
    defaultPatientInfo: { patientId },
  } = patientState.useContainer();
  const { reportId } = useGetParams<{ reportId: string }>();
  const {
    data: { data: detailData },
  } = useApi.查询检验报告详情({
    initValue: {
      data: {},
    },
    params: {
      patientId,
      inspectId: decodeURIComponent(reportId),
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
        text: detailData?.inspectId,
      },
      {
        label: '检验科室',
        text: detailData?.implementDeptName,
      },
    ],
    [detailData],
  );
  const examList = useMemo(
    () => [
      {
        label: '检验项目',
        text: detailData?.inspectName,
      },
      {
        label: '检验样本',
        text: detailData?.inspectSample,
      },
      {
        label: '开单时间',
        text: detailData?.reportTime,
      },
    ],
    [detailData],
  );
  const testList = useMemo(() => {
    return detailData?.items || [];
  }, [detailData]);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '检验报告详情',
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
          <View className={styles.headName}>
            {detailData?.patientName || '-'}
          </View>
          <View className={styles.headText}>
            <Text>{`性别:   ${detailData?.patSex === 'M' ? '男' : '女'}`}</Text>
            <Text className={styles.headText2}>{`年龄:   ${
              detailData?.patAge || ''
            }岁`}</Text>
          </View>
        </View>
      </Space>
      <View className={styles.content}>
        <View className={styles.wrap}>
          <CardItem itemList={patientInfoList} />
          <CardItem itemList={examList} />
        </View>
        <PartTitle full bold elderly className={styles.partTitle}>
          检验结果
        </PartTitle>
        <View className={styles.wrap}>
          <Space vertical className={styles.lists}>
            {testList.map((list, index) => (
              <Space
                key={index}
                justify="space-between"
                alignItems="center"
                className={styles.list}
              >
                <Space vertical size={20} flex="auto">
                  <Space justify="space-between">
                    <View className={styles.listName}>{list.itemName}</View>
                    <View className={styles.listRight}>
                      {list.result}
                      {list.itemUnit}
                      {list.abnormal && (
                        <Image
                          src={`${IMAGE_DOMIN}/report/${
                            list.abnormal !== '↓' ? 'up' : 'down'
                          }-old.png`}
                          className={styles.listImg}
                        />
                      )}
                    </View>
                  </Space>
                  <View className={styles.listText}>
                    参考值: {list.refRange}
                    {list.itemUnit}
                  </View>
                </Space>
              </Space>
            ))}
          </Space>
        </View>
      </View>
    </View>
  );
};

export const CardItem = ({
  itemList,
}: {
  itemList: {
    label: string;
    text: string;
  }[];
}) => (
  <View className={styles.card}>
    {itemList.map((item) => (
      <FormItem
        className={styles.item}
        label={item.label}
        key={item.label}
        colon
        labelWidth={'4em'}
      >
        <Exceed className={styles.text}>
          {item?.text === 'null' ? '暂无' : item?.text ? item.text : '暂无'}
        </Exceed>
      </FormItem>
    ))}
  </View>
);
