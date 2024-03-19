import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'remax/one';
import { Space, Fold, Button } from '@kqinfo/ui';
import styles from './index.less';
import Tabs from '../components/tabs';
import DateCalendar from '../components/dateCalendar';
// import Statistics from '../components/statistics';
import Ptitle from '../components/ptitle';
import DateSearch from '../components/dateSearch';
import DataGrid from '../components/dataGrid';
import Tables from '../components/tables';
import DataPane from '../components/dataPane';
import Apis from '../apis/index';
import dayjs from 'dayjs';
import { usePageEvent } from '@remax/macro';
import {
  showAverageCost,
  showOutpatient,
  showInDepartment,
} from '@/pages2/yzrb/index/utils';
// import { usePageEvent } from '@remax/framework-shared';
const dateTypeEnum = {
  day: '日',
  month: '月',
  quarter: '季',
  year: '年',
};

export default () => {
  const { data: outDepartmentInfo1, request: outDepartmentInfoRequest } =
    Apis.postApiDeansDailyOutpatientDepartmentInfo({
      needInit: false,
      initValue: {
        deptInfo: [],
      },
    });
  const { data: inDepartmentInfo1, request: inDepartmentInfoRequest } =
    Apis.postApiDeansDailyInpatientDepartmentInfo({
      needInit: false,
      initValue: {
        inHospitaData: [],
        outHospitaData: [],
      },
    });
  // const { data: othersDepartmentInfo1, request: othersDepartmentInfoRequest } =
  //   Apis.postApiDeansDailyOthersDepartmentInfo({
  //     needInit: false,
  //     initValue: {
  //       inHospitaData: [],
  //       outHospitaData: [],
  //     },
  //   });
  // const othersDepartmentInfo = useMemo(() => {
  //   if (othersDepartmentInfo1) {
  //     return othersDepartmentInfo1?.data?.data;
  //   }
  // }, [othersDepartmentInfo1]);
  const inDepartmentInfo = useMemo(() => {
    if (inDepartmentInfo1) {
      return inDepartmentInfo1?.data?.data;
    }
  }, [inDepartmentInfo1]);
  const outDepartmentInfo = useMemo(() => {
    if (outDepartmentInfo1) {
      return outDepartmentInfo1?.data?.data;
    }
  }, [outDepartmentInfo1]);
  const [selectDate, setSelectDate] = useState({
    outSelectDate: [] as any[],
    inSelectDate: [] as any[],
  });
  const [dataType, setDataType] = useState('1');
  const [dateType, setDateType] = useState({
    outSelectDate: 'day',
    inSelectDate: 'day',
  });

  const [switchDeptInfo, setSwitchDeptInfo] = useState<boolean>(true);
  const deptInfo = useMemo(() => {
    // if (switchDeptInfo) {
    //   const datas = outDepartmentInfo?.deptInfo;
    //   return [...datas]?.splice(0, 6);
    // }
    return outDepartmentInfo?.deptInfo;
  }, [outDepartmentInfo?.deptInfo]);
  const [switchOutPatientInfo, setSwitchOutPatientInfo] =
    useState<boolean>(true);
  const outHospitalData = useMemo(() => {
    // if (switchOutPatientInfo) {
    //   const datas = inDepartmentInfo?.outHospitalData;
    //   if (datas) {
    //     return [...datas]?.splice(0, 6);
    //   }
    // }
    return inDepartmentInfo?.outHospitalData;
  }, [inDepartmentInfo?.outHospitalData]);

  useEffect(() => {
    console.log('dateTypeChange1', selectDate);
    updateDateData(selectDate.outSelectDate, '1');
  }, [selectDate.outSelectDate]);
  useEffect(() => {
    console.log('dateTypeChange2', selectDate);
    updateDateData(selectDate.inSelectDate, '2');
  }, [selectDate.inSelectDate]);
  useEffect(() => {
    console.log('dateTypeChange2', selectDate);
    updateDateData(selectDate.inSelectDate, '3');
  }, [selectDate.inSelectDate]);
  // const [switchIncome, setSwitchIncome] = useState<boolean>(true);
  // const incomeCategoriesVoList = useMemo(() => {
  //   let dataSource = othersDepartmentInfo?.incomeCategoriesVoList ?? [];
  //   if (switchIncome) {
  //     dataSource = [...dataSource]?.splice(0, 6);
  //   }
  //   return [
  //     ...dataSource,
  //     {
  //       incomeType: '合计',
  //       amount: othersDepartmentInfo?.incomeCategoriesAmount,
  //     },
  //   ];
  // }, [
  //   othersDepartmentInfo?.incomeCategoriesAmount,
  //   othersDepartmentInfo?.incomeCategoriesVoList,
  //   switchIncome,
  // ]);
  // const [switchPharmacy] = useState<boolean>(true);
  // const pharmacyRevenueVoList = useMemo(() => {
  //   let dataSource = othersDepartmentInfo?.pharmacyRevenueVoList ?? [];
  //   if (switchPharmacy) {
  //     dataSource = [...dataSource]?.splice(0, 6);
  //   }
  //   return [
  //     ...dataSource,
  //     { drugType: '合计', amount: othersDepartmentInfo?.pharmacyRevenueAmount },
  //   ];
  // }, [
  //   othersDepartmentInfo?.pharmacyRevenueAmount,
  //   othersDepartmentInfo?.pharmacyRevenueVoList,
  //   switchPharmacy,
  // ]);
  // const [switchAuxiliary, setSwitchAuxiliary] = useState<boolean>(true);
  // const auxiliaryDepartmentExpensesVoList = useMemo(() => {
  //   let dataSource =
  //     othersDepartmentInfo?.auxiliaryDepartmentExpensesVoList ?? [];
  //   if (switchAuxiliary) {
  //     dataSource = [...dataSource]?.splice(0, 6);
  //   }
  //   return [
  //     ...dataSource,
  //     {
  //       physicalTherapyProject: '合计',
  //       amount: othersDepartmentInfo?.auxiliaryDepartmentExpensesAmount,
  //     },
  //   ];
  // }, [
  //   othersDepartmentInfo?.auxiliaryDepartmentExpensesAmount,
  //   othersDepartmentInfo?.auxiliaryDepartmentExpensesVoList,
  //   switchAuxiliary,
  // ]);
  // const [switchPhysicalTherapy, setSwitchPhysicalTherapy] =
  //   useState<boolean>(true);
  // const physicalTherapyIncomeVoList = useMemo(() => {
  //   let dataSource = othersDepartmentInfo?.physicalTherapyIncomeVoList ?? [];
  //   if (switchPhysicalTherapy) {
  //     dataSource = [...dataSource]?.splice(0, 6);
  //   }
  //   return [
  //     ...dataSource,
  //     {
  //       deptName: '合计',
  //       personNum: othersDepartmentInfo?.physicalTherapyIncomeNum,
  //       amount: othersDepartmentInfo?.physicalTherapyIncomeAmount,
  //     },
  //   ];
  // }, [
  //   othersDepartmentInfo?.physicalTherapyIncomeAmount,
  //   othersDepartmentInfo?.physicalTherapyIncomeNum,
  //   othersDepartmentInfo?.physicalTherapyIncomeVoList,
  //   switchPhysicalTherapy,
  // ]);
  // useEffect(() => {
  //   if (dataType === '3') {
  //     othersDepartmentInfoRequest({
  //       startDate: '',
  //       endDate: '2023-09-21 23:59:59',
  //       compareType: '2023-09-07 00:00:00',
  //     });
  //   }
  // }, [dataType, othersDepartmentInfoRequest]);
  const updateDateData = (selectDate: any[], type: string) => {
    const startDate = selectDate[0]
      ? dayjs(selectDate[0]).format('YYYY-MM-DD 00:00:00')
      : '';

    let endDate = selectDate[1] || selectDate[0];

    endDate = endDate ? dayjs(endDate).format('YYYY-MM-DD 23:59:59') : '';
    // if()
    if (type === '1') {
      outDepartmentInfoRequest({
        startDate,
        endDate,
        compareType: dateType.outSelectDate,
      });
    } else if (type === '3') {
      console.log('xxx');
      // othersDepartmentInfoRequest({
      //   startDate,
      //   endDate,
      //   compareType: dateType.inSelectDate,
      // });
    } else {
      inDepartmentInfoRequest({
        startDate,
        endDate,
        compareType: dateType.inSelectDate,
      });
    }
  };
  const dateTypeChange = (type: string, dates: any[]) => {
    console.log('dateTypeChange', dates);
    if (dataType === '1') {
      selectDate.outSelectDate = [...dates];
      dateType.outSelectDate = type;

      setDateType({ ...dateType });
      setSelectDate({ ...selectDate });
    } else if (dataType === '3') {
      selectDate.inSelectDate = [...dates];
      setSelectDate({ ...selectDate });
      dateType.inSelectDate = type;
      setDateType({ ...dateType });
    } else {
      selectDate.inSelectDate = [...dates];
      setSelectDate({ ...selectDate });
      dateType.inSelectDate = type;
      setDateType({ ...dateType });
    }
  };
  function compareHandle(val: string | undefined) {
    if (val) {
      const num = Number(val.split('%')[0]);
      if (num) {
        return num > 0 ? 1 : 2;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
  function showLastTimeType(v: any) {
    return dateTypeEnum[v as 'day' | 'month' | 'quarter' | 'year'] || '日';
  }
  usePageEvent('onShow', async () => {
    document.title = '院长日报';
  });
  return (
    <Space vertical size={'10px'} className={styles.pages}>
      <Space
        className={dataType !== '3' ? styles.topbox : styles.topbox1}
        vertical
        alignItems={'center'}
      >
        <Tabs active={dataType} onTap={(v) => setDataType(v)} />
        <DateCalendar
          isShow={dataType === '1'}
          value={selectDate.outSelectDate}
          params={{ amount: outDepartmentInfo?.amountOfSpecifiedDays || '' }}
          onchange={(val) => {
            if (val.length && !val[1]) {
              dateType.outSelectDate = 'day';
            } else {
              dateType.outSelectDate = '';
            }
            setDateType({ ...dateType });
            selectDate.outSelectDate = [...val];
            setSelectDate({ ...selectDate });
          }}
        />
        <DateCalendar
          isShow={dataType === '2'}
          params={{ amount: inDepartmentInfo?.amountOfSpecifiedDays || '' }}
          value={selectDate.inSelectDate}
          onchange={(val) => {
            if (val.length && !val[1]) {
              dateType.inSelectDate = 'day';
            } else {
              dateType.inSelectDate = '';
            }
            setDateType({ ...dateType });
            selectDate.inSelectDate = [...val];
            setSelectDate({ ...selectDate });
          }}
        />
      </Space>
      {/* {dataType !== '3' && (
        <Statistics
          datas={
            dataType === '1'
              ? [
                  {
                    title: '新增患者人数',
                    value: outDepartmentInfo?.newAddPatient,
                  },
                  { title: '建档绑卡总人数', value: outDepartmentInfo?.bindNum },
                ]
              : [
                  {
                    title: '新增住院人数',
                    value: inDepartmentInfo?.newAddPatient,
                  },
                  {
                    title: '在院人数',
                    value: inDepartmentInfo?.inHospitalPatient,
                  },
                  {
                    title: '出院人数',
                    value: inDepartmentInfo?.outHospitalPatient,
                  },
                ]
          }
        />
      )} */}
      <Ptitle
        title={'数据概览'}
        isHide={dataType !== '1'}
        extra={
          <DateSearch
            onChange={dateTypeChange}
            active={dateType.outSelectDate}
          />
        }
      />
      <Ptitle
        title={'数据概览'}
        isHide={dataType !== '2'}
        extra={
          <DateSearch
            onChange={dateTypeChange}
            active={dateType.inSelectDate}
          />
        }
      />
      {dataType !== '3' && (
        <DataGrid
          datas={
            dataType === '1'
              ? [
                  {
                    title: '门诊总金额',
                    value: Number(outDepartmentInfo?.totalAmount || ''),
                    extra:
                      dateType.outSelectDate && showOutpatient
                        ? {
                            tb: {
                              value: outDepartmentInfo?.amountYOY || '',
                              change: compareHandle(
                                outDepartmentInfo?.amountYOY as string,
                              ),
                            },
                            hb: {
                              value: outDepartmentInfo?.amountMOM || '',
                              change: compareHandle(
                                outDepartmentInfo?.amountMOM as string,
                              ),
                            },
                          }
                        : undefined,
                  },
                  {
                    title: '门诊总人数',
                    value: Number(outDepartmentInfo?.totalPatient || ''),
                    extra:
                      dateType.outSelectDate && showOutpatient
                        ? {
                            tb: {
                              value: outDepartmentInfo?.patientYOY || '',
                              change: compareHandle(
                                outDepartmentInfo?.patientYOY as string,
                              ),
                            },
                            hb: {
                              value: outDepartmentInfo?.patientMOM || '',
                              change: compareHandle(
                                outDepartmentInfo?.patientMOM as string,
                              ),
                            },
                          }
                        : undefined,
                  },
                  {
                    title: '均次就诊费用',
                    value: Number(outDepartmentInfo?.averageCost || ''),
                  },
                  {
                    title: '医生平均看诊人次',
                    value: Number(outDepartmentInfo?.visitsAverageNum || ''),
                  },
                ]
              : [
                  {
                    title: '住院总金额',
                    value: Number(inDepartmentInfo?.totalAmount || ''),
                    extra:
                      dateType.inSelectDate && showInDepartment
                        ? {
                            tb: {
                              value: inDepartmentInfo?.amountYOY || '',
                              change: compareHandle(
                                inDepartmentInfo?.amountYOY,
                              ),
                            },
                            hb: {
                              value: inDepartmentInfo?.amountMOM,
                              change: compareHandle(
                                inDepartmentInfo?.amountMOM,
                              ),
                            },
                          }
                        : undefined,
                  },
                  {
                    title: '住院总人数',
                    value: Number(inDepartmentInfo?.totalPatient || ''),
                    extra:
                      dateType.inSelectDate && showOutpatient
                        ? {
                            tb: {
                              value: inDepartmentInfo?.patientYOY,
                              change: compareHandle(
                                inDepartmentInfo?.patientYOY,
                              ),
                            },
                            hb: {
                              value: inDepartmentInfo?.patientMOM,
                              change: compareHandle(
                                inDepartmentInfo?.patientMOM,
                              ),
                            },
                          }
                        : undefined,
                  },
                  showAverageCost && {
                    title: '均次住院费用',
                    value: Number(inDepartmentInfo?.averageCost || ''),
                  },
                  // {
                  //   title: '病床使用率',
                  //   value: inDepartmentInfo?.bedUtilization || '',
                  // },
                ]
          }
        />
      )}
      {dataType === '1' && (
        <>
          <View
            onTap={() => {
              setSwitchDeptInfo(!switchDeptInfo);
            }}
          >
            <Ptitle title={'科室概览'} />
          </View>
          <Tables
            columns={[
              {
                title: '科室名称',
                dataIndex: 'deptName',
                render: (v, r) => (
                  <Space
                    vertical
                    justify={'center'}
                    alignItems={'center'}
                    // onTap={() => {
                    //   navigateTo({
                    //     url:
                    //       '/pages/detail/index?dataType=1&deptName=' +
                    //       r.deptName +
                    //       '&dates=' +
                    //       JSON.stringify(selectDate.outSelectDate),
                    //   });
                    // }}
                    size={10}
                  >
                    <Space className={styles.link}>{v}</Space>
                    {dateType.outSelectDate ? (
                      <Space className={styles.sy}>
                        上{showLastTimeType(dateType.outSelectDate)}
                        {r.lastMonthAmount}元
                      </Space>
                    ) : (
                      ''
                    )}
                  </Space>
                ),
              },
              {
                title: (
                  <Space vertical alignItems={'center'} justify="center">
                    <Text>科室收入</Text>
                    <Text>(元)</Text>
                  </Space>
                ),
                dataIndex: 'deptAmount',
              },
              { title: '就诊人次', dataIndex: 'visits' },
              {
                title: (
                  <Space vertical alignItems={'center'} justify="center">
                    <Text>均次费用</Text>
                    <Text>(元)</Text>
                  </Space>
                ),
                dataIndex: 'deptAverageCost',
                render: (v) => Number(v).toFixed(2),
              },
            ]}
            dataSource={deptInfo}
          />
        </>
      )}
      {dataType === '2' && (
        <>
          {/* <Ptitle title={'在院数据'} />
          <DataPane
            datas={[
              {
                lable: '住院总金额',
                value: Number(inDepartmentInfo?.totalAmount || ''),
              },
              {
                lable: '在院人数',
                value: Number(inDepartmentInfo?.totalPatient || ''),
              },
              {
                lable: '均次就诊费用',
                value: Number(inDepartmentInfo?.averageCost || ''),
              },
            ]}
          /> */}
          {/* <Tables
            columns={[
              {
                title: '科室名称',
                dataIndex: 'deptName',
                render: (v, r) => (
                  <Space
                    vertical
                    justify={'center'}
                    alignItems={'center'}
                    onTap={() => {
                      navigateTo({
                        url:
                          '/pages/detail/index?dataType=2&deptName=' +
                          r.deptName +
                          '&dates=' +
                          JSON.stringify(selectDate.inSelectDate),
                      });
                    }}
                    size={10}>
                    <Space className={styles.link}>{v}</Space>
                    {dateType.inSelectDate ? (
                      <Space className={styles.sy}>
                        上{showLastTimeType(dateType.inSelectDate)}
                        {r.lastMonthAmount}元
                      </Space>
                    ) : (
                      ''
                    )}
                  </Space>
                ),
              },
              {
                title: (
                  <Space vertical alignItems={'center'} justify='center'>
                    <Text>科室收入</Text>
                    <Text>(元)</Text>
                  </Space>
                ),
                dataIndex: 'deptAmount',
              },
              { title: '就诊人次', dataIndex: 'visits' },
              {
                title: (
                  <Space vertical alignItems={'center'} justify='center'>
                    <Text>均次费用</Text>
                    <Text>(元)</Text>
                  </Space>
                ),
                dataIndex: 'deptAverageCost',
                render: (v) => Number(v).toFixed(2),
              },
            ]}
            dataSource={inDepartmentInfo?.inHospitalData}
          /> */}
          <View
            onTap={() => {
              setSwitchOutPatientInfo(!switchOutPatientInfo);
            }}
          >
            <Ptitle title={'出院数据'} />
          </View>
          <DataPane
            datas={[
              {
                lable: '住院总金额',
                value: Number(inDepartmentInfo?.outHospitalAmount || ''),
              },
              {
                lable: '出院人数',
                value: Number(inDepartmentInfo?.outHospitalPatient || ''),
              },
              {
                lable: '均次就诊费用',
                value: Number(inDepartmentInfo?.outHospitalAverageCost || ''),
              },
            ]}
          />
          <Tables
            columns={[
              {
                title: '科室名称',
                dataIndex: 'deptName',
                render: (v, r) => (
                  <Space
                    vertical
                    justify={'center'}
                    alignItems={'center'}
                    // onTap={() => {
                    //   navigateTo({
                    //     url:
                    //       '/pages/detail/index?dataType=2&deptName=' +
                    //       r.deptName +
                    //       '&dates=' +
                    //       JSON.stringify(selectDate.inSelectDate),
                    //   });
                    // }}
                    size={10}
                  >
                    <Space className={styles.link}>{v}</Space>
                    {dateType.inSelectDate ? (
                      <Space className={styles.sy}>
                        上{showLastTimeType(dateType.inSelectDate)}
                        {r.lastMonthAmount}元
                      </Space>
                    ) : (
                      ''
                    )}
                  </Space>
                ),
              },
              {
                title: (
                  <Space vertical alignItems={'center'} justify="center">
                    <Text>科室收入</Text>
                    <Text>(元)</Text>
                  </Space>
                ),
                dataIndex: 'deptAmount',
              },
              {
                title: (
                  <Space vertical alignItems={'center'} justify="center">
                    <Text>在院人数</Text>
                  </Space>
                ),
                dataIndex: 'enterNum',
              },
              {
                title: (
                  <Space vertical alignItems={'center'} justify="center">
                    <Text>人次</Text>
                  </Space>
                ),
                dataIndex: 'visits',
              },
              // { title: '就诊人次', dataIndex: 'visits' },
              {
                title: (
                  <Space vertical alignItems={'center'} justify="center">
                    <Text>均次费用</Text>
                    <Text>(元)</Text>
                  </Space>
                ),
                dataIndex: 'deptAverageCost',
                render: (v) => Number(v).toFixed(2),
              },
            ]}
            dataSource={outHospitalData}
          />
        </>
      )}
      {/* {dataType === '3' && (
        <>
          <View>
            <View className={styles.dateSearch}>
              <DateSearch
                onChange={dateTypeChange}
                active={dateType.inSelectDate}
              />
            </View>
            <Ptitle title={'收入分类统计'} />
          </View>
          <Fold folded={switchIncome} className={styles.fold}>
            <Tables
              columns={[
                {
                  title: '类别',
                  dataIndex: 'incomeType',
                  render(value) {
                    if (value === '合计') {
                      return <Text style={{ color: '#f49020' }}>{value}</Text>;
                    }
                    return <Text style={{ color: '#1ea9f0' }}>{value}</Text>;
                  },
                },
                {
                  title: '收入分类',
                  dataIndex: 'incomeCategories',
                },
                {
                  title: '收入(元)',
                  dataIndex: 'amount',
                  render(value, row) {
                    if (row.incomeType === '合计') {
                      return <Text style={{ color: '#f49020' }}>{value}</Text>;
                    }
                    return <Text>{value}</Text>;
                  },
                },
                {
                  title: '占比',
                  dataIndex: 'proportion',
                },
              ]}
              dataSource={incomeCategoriesVoList}
            />
          </Fold>
          <Button
            className={styles.switchBtn}
            onTap={() => {
              setSwitchIncome(!switchIncome);
            }}
          >
            {switchIncome ? '展开' : '收起'}
          </Button>
        </>
      )}
      {dataType === '3' && (
        <>
          <View>
            <Ptitle title={'药房收入'} />
          </View>
          <Tables
            columns={[
              {
                title: '类别',
                dataIndex: 'drugType',
                render(value) {
                  if (value === '合计') {
                    return <Text style={{ color: '#f49020' }}>{value}</Text>;
                  }
                  return <Text style={{ color: '#1ea9f0' }}>{value}</Text>;
                },
              },
              {
                title: '收入(元)',
                dataIndex: 'amount',
                render(value, row) {
                  if (row.drugType === '合计') {
                    return <Text style={{ color: '#f49020' }}>{value}</Text>;
                  }
                  return <Text>{value}</Text>;
                },
              },
              { title: '占比', dataIndex: 'proportion' },
            ]}
            dataSource={pharmacyRevenueVoList}
          />
        </>
      )}
      {dataType === '3' && (
        <>
          <View>
            <Ptitle title={'辅助科室费用'} />
          </View>
          <Fold folded={switchAuxiliary} className={styles.fold}>
            <Tables
              columns={[
                {
                  title: '检查项目',
                  dataIndex: 'physicalTherapyProject',
                  render(value) {
                    if (value === '合计') {
                      return <Text style={{ color: '#f49020' }}>{value}</Text>;
                    }
                    return <Text style={{ color: '#1ea9f0' }}>{value}</Text>;
                  },
                },
                {
                  title: '科室',
                  dataIndex: 'deptName',
                },
                { title: '人次', dataIndex: 'personNum' },
                {
                  title: '收入(元)',
                  dataIndex: 'amount',
                  render(value, row) {
                    if (row.physicalTherapyProject === '合计') {
                      return <Text style={{ color: '#f49020' }}>{value}</Text>;
                    }
                    return <Text>{value}</Text>;
                  },
                },
              ]}
              dataSource={auxiliaryDepartmentExpensesVoList}
            />
          </Fold>
          <Button
            className={styles.switchBtn}
            onTap={() => {
              setSwitchAuxiliary(!switchAuxiliary);
            }}
          >
            {switchAuxiliary ? '展开' : '收起'}
          </Button>
        </>
      )}
      {dataType === '3' && (
        <>
          <View>
            <Ptitle title={'理疗收入'} />
          </View>
          <Fold folded={switchPhysicalTherapy} className={styles.fold}>
            <Tables
              columns={[
                {
                  title: '类别',
                  dataIndex: 'deptName',
                  render(value) {
                    if (value === '合计') {
                      return <Text style={{ color: '#f49020' }}>{value}</Text>;
                    }
                    return <Text style={{ color: '#1ea9f0' }}>{value}</Text>;
                  },
                },
                {
                  title: '人次',
                  dataIndex: 'personNum',
                  render(value, row) {
                    if (row.deptName === '合计') {
                      return <Text style={{ color: '#f49020' }}>{value}</Text>;
                    }
                    return <Text>{value}</Text>;
                  },
                },
                {
                  title: '收入(元)',
                  dataIndex: 'amount',
                  render(value, row) {
                    if (row.deptName === '合计') {
                      return <Text style={{ color: '#f49020' }}>{value}</Text>;
                    }
                    return <Text>{value}</Text>;
                  },
                },
              ]}
              dataSource={physicalTherapyIncomeVoList}
            />
          </Fold>
          <Button
            className={styles.switchBtn}
            onTap={() => {
              setSwitchPhysicalTherapy(!switchPhysicalTherapy);
            }}
          >
            {switchPhysicalTherapy ? '展开' : '收起'}
          </Button>
        </>
      )} */}
      {/* {dataType === '3' && (
        <>
          <Ptitle title={'病人区域分析'} />
          <Tables
            columns={[
              {
                title: '科室名称',
                dataIndex: 'deptName',
                render: (v, r) => (
                  <Space
                    vertical
                    justify={'center'}
                    alignItems={'center'}
                    onTap={() => {
                      navigateTo({
                        url:
                          '/pages/detail/index?dataType=1&deptName=' +
                          r.deptName +
                          '&dates=' +
                          JSON.stringify(selectDate.outSelectDate),
                      });
                    }}
                    size={10}>
                    <Space className={styles.link}>{v}</Space>
                    {dateType.outSelectDate ? (
                      <Space className={styles.sy}>
                        上{showLastTimeType(dateType.outSelectDate)}
                        {r.lastMonthAmount}元
                      </Space>
                    ) : (
                      ''
                    )}
                  </Space>
                ),
              },
              {
                title: (
                  <Space vertical alignItems={'center'} justify='center'>
                    <Text>科室收入</Text>
                    <Text>(元)</Text>
                  </Space>
                ),
                dataIndex: 'deptAmount',
              },
              { title: '就诊人次', dataIndex: 'visits' },
              {
                title: (
                  <Space vertical alignItems={'center'} justify='center'>
                    <Text>均次费用</Text>
                    <Text>(元)</Text>
                  </Space>
                ),
                dataIndex: 'deptAverageCost',
                render: (v) => Number(v).toFixed(2),
              },
            ]}
            dataSource={outDepartmentInfo?.deptInfo}
          />
        </>
      )} */}
    </Space>
  );
};
