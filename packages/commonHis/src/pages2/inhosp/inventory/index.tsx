import React, { useMemo, useState } from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, BackgroundImg, Picker, Icon, Table } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import useApi from '@/apis/inhosp';
import dayjs from 'dayjs';
import styles from './index.less';
import reportCmPV from '@/alipaylog/reportCmPV';
import useGetParams from '@/utils/useGetParams';
import useGetExpensesDayDetail from '@/pages2/inhosp/inventory/hooks/useGetExpensesDayDetail';
import { PatGender } from '@/config/dict';

export default () => {
  const { patientId } = useGetParams<{ patientId: string }>();
  const {
    data: { data: liveData },
  } = useApi.查询住院信息({
    params: {
      patientId,
    },
    needInit: !!patientId,
  });
  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { dayLoading, inventoryDetail } = useGetExpensesDayDetail({
    liveData,
    patientId,
    selectDate,
  });
  const totalDatas = useMemo(() => {
    return [
      {
        itemName: '日支付金额',
        itemTotalFee: inventoryDetail?.totalFee || 0,
      },
    ];
  }, [inventoryDetail.totalFee]);
  usePageEvent('onShow', () => {
    reportCmPV({ title: '住院日清单查询' });
    setNavigationBar({
      title: '住院费用清单',
    });
  });

  return (
    <View className={styles.page}>
      <View className={styles.banner} />
      <Space className={styles.warp} vertical size={20}>
        <BackgroundImg
          img={`${IMAGE_DOMIN}/inhosp/bg.png`}
          className={styles.card}
        >
          <View className={styles.cardInner}>
            <Space alignItems="center" justify="space-between">
              <Space alignItems="center" className={styles.patName}>
                {liveData?.patientName}
                <View className={styles.patInfo}>
                  {PatGender[liveData?.patientSex] || ''}
                  {liveData?.patientAge}岁
                </View>
              </Space>
              <Space alignItems="center" className={styles.date}>
                <Picker
                  mode={'date'}
                  onChange={(v) => setSelectDate(String(v))}
                  start={liveData?.inDate.slice(0, 10)}
                  end={dayjs().format('YYYY-MM-DD')}
                >
                  {(v) => (
                    <Space alignItems="center">
                      {dayjs(v).format('YYYY 年 MM 月 DD 日')}{' '}
                      <Icon
                        name={'kq-down'}
                        color="#999999"
                        size={26}
                        style={{ marginLeft: 5 }}
                      />
                    </Space>
                  )}
                </Picker>
              </Space>
            </Space>
            <Space alignItems="center" justify="space-between">
              <View className={styles.desc}>
                住院号：{liveData?.admissionNum}
              </View>
              <View />
            </Space>
          </View>
        </BackgroundImg>
        <Table
          loading={dayLoading}
          dataSource={totalDatas}
          headerCls={styles.tbHead}
          className={styles.table}
          doubleColor={'#fff'}
          rowCls={styles.tbr}
          align={'between'}
          columns={[
            { title: '日花费汇总', dataIndex: 'itemName' },
            // {
            //   title: `${(Number(liveData?.totalFee || 0) / 100).toFixed(2)}元`,
            //   dataIndex: 'itemTotalFee',
            //   render: (v) => <View>{(+v / 100).toFixed(2)}元</View>,
            // },
            {
              title: '金额/元',
              dataIndex: 'itemTotalFee',
              render: (v) => <View>{(+v / 100).toFixed(2)}元</View>,
            },
          ]}
        />
        {inventoryDetail?.items && (
          <Table
            loading={dayLoading}
            dataSource={inventoryDetail.items}
            rowCls={styles.tbr}
            headerCls={styles.tbHead}
            doubleColor={'#FBFBFB'}
            align={'between'}
            rowStyle={{ color: '#333', fontWeight: 400 }}
            columns={[
              { title: '项目', dataIndex: 'itemName' },
              {
                title: '单价/元',
                dataIndex: 'itemPrice',
                render: (v) => <View>{(+v / 100).toFixed(2)}</View>,
              },
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
                title: '金额/元',
                dataIndex: 'itemTotalFee',
                render: (v) => <View>{(+v / 100).toFixed(2)}</View>,
              },
            ]}
          />
        )}
      </Space>
    </View>
  );
};
