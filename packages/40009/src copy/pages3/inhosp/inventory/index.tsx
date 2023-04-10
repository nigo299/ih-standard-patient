import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from '@remax/macro';
import React, { useState } from 'react';
import { View, Text } from 'remax/one';
import styles from './index.less';
import InhospHeader from '@/components/inhospHeader';
import inhospState from '@/stores/inhosp';
import { analyzeIDCard } from '@/utils';
import { Space, Button, Picker, Table } from '@kqinfo/ui';
import useApi from '@/apis/inhosp';
import dayjs from 'dayjs';

export default () => {
  const {
    inhospPatientInfo: { patientName, idNo },
  } = inhospState.useContainer();
  const { inhospPatientInfo: liveData } = inhospState.useContainer();
  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  const {
    loading: dayLoading,
    data: { data: inventoryDetail },
  } = useApi.查询住院一日清单({
    initValue: {
      data: {
        items: [],
      },
    },
    params: {
      admissionNum: liveData?.admissionNum,
      patientId: liveData.patientId,
      beginDate: selectDate,
    },
    needInit: true,
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '费用清单',
    });
  });
  return (
    <View className={styles.box}>
      <InhospHeader
        content={`住院号：${liveData?.admissionNum}`}
        title={`${patientName}｜${analyzeIDCard(idNo)?.analyzeAge}岁`}
      />
      <View className={styles.main}>
        <View className={styles.timeBox}>
          <Space justify={'space-between'} alignItems={'center'}>
            <Text className={styles.time}>{selectDate}</Text>
            <Picker
              mode={'date'}
              onChange={(v) => setSelectDate(String(v))}
              start={liveData.inDate.slice(0, 10)}
              end={dayjs().format('YYYY-MM-DD')}
            >
              {() => (
                <Button
                  block={false}
                  type={'primary'}
                  className={styles.timeBtn}
                  size={'small'}
                >
                  切换日期
                </Button>
              )}
            </Picker>
          </Space>
          <Space
            vertical
            size={46}
            alignItems={'center'}
            style={{ marginTop: 50 }}
          >
            <Text className={styles.mainPrice}>
              ¥{(Number(inventoryDetail?.totalFee || 0) / 100).toFixed(2)}
            </Text>
            <Text className={styles.mainTitle}>当日花费</Text>
          </Space>
        </View>
        <View style={{ marginTop: 20 }}>
          {inventoryDetail?.items && (
            <Table
              loading={dayLoading}
              dataSource={inventoryDetail.items}
              rowCls={styles.tbr}
              headerCls={styles.tbHead}
              align={'between'}
              doubleColor={'#fff'}
              rowStyle={{ color: '#666', fontWeight: 'bold' }}
              columns={[
                { title: '项目', dataIndex: 'itemName' },
                {
                  title: '数量/单位',
                  dataIndex: 'itemNumber',
                  render: (v, r) => (
                    <View>
                      {r.itemNumber}/{r.itemUnit}
                    </View>
                  ),
                },
                {
                  title: '单价/元',
                  dataIndex: 'itemPrice',
                  render: (v) => <View>{(+v / 100).toFixed(2)}</View>,
                },
                {
                  title: '金额/元',
                  dataIndex: 'itemTotalFee',
                  render: (v) => <View>{(+v / 100).toFixed(2)}</View>,
                },
              ]}
            />
          )}
        </View>
      </View>
    </View>
  );
};
