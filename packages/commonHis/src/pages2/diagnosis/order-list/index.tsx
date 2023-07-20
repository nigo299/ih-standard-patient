import React, { useMemo, useState } from 'react';
import {
  Space,
  FormItem,
  Loading,
  Form,
  rpxToPx,
  useTitle,
  Button,
  NoData,
  Exceed,
  DropDownMenu,
  DropDownMenuItem,
  Calendar,
} from '@kqinfo/ui';
import styles from './index.less';
import { navigateTo } from 'remax/one';
import useApi from '@/apis/common';
import useGetParams from '@/utils/useGetParams';
import dayjs from 'dayjs';
import { PatGender } from '@/config/dict';
import { getPatientAge } from '@/utils';

export default () => {
  const { patHisNo } = useGetParams<{ patHisNo: string }>();
  const [rangeDate, setRangeDate] = useState([
    dayjs().subtract(30, 'd'),
    dayjs(),
  ] as any[]);
  const [recordType, setRecordType] = useState('OPD');
  const recordTypes: any = {
    OPD: '门诊',
    IPD: '住院',
  };
  const { data, loading } = useApi.就诊记录列表查询({
    params: {
      recordType,
      patCardNo: patHisNo,
      startDate: rangeDate[0]
        ? dayjs(rangeDate[0]).format('YYYY-MM-DD')
        : undefined,
      endDate: rangeDate[1]
        ? dayjs(rangeDate[1]).format('YYYY-MM-DD')
        : undefined,
    },
  });
  const resultData = useMemo(() => {
    return data?.data;
  }, [data]);
  // useUpdateEffect(() => {
  //   if (!resultData?.list) {
  //     showModal({
  //       title: '提示',
  //       content: '当前就诊人暂无就诊记录, 请重新选择就诊人!',
  //     }).then(() => {
  //       navigateBack();
  //     });
  //   }
  // }, [data]);
  useTitle('就诊记录');

  const options1 = useMemo(
    () => [
      {
        text: '门诊',
        value: 'OPD',
      },
      {
        text: '住院',
        value: 'IPD',
      },
    ],
    [],
  );
  return (
    <Form labelStyle={{ color: '#333', fontWeight: 500 }}>
      {loading && <Loading type="top" />}
      <Space vertical className={styles.page}>
        <Form
          itemStyle={{ color: '#fff', fontSize: rpxToPx(30) }}
          itemChildrenStyle={{ color: '#fff' }}
        >
          <Space className={styles.header} justify={'center'}>
            {resultData && (
              <Space className={styles.card} vertical size={30}>
                <Space justify={'space-between'}>
                  <Space className={styles.name}>{resultData?.patName}</Space>
                  <FormItem label={'就诊卡'}>{patHisNo}</FormItem>
                </Space>
                <Space justify={'space-between'}>
                  <FormItem label={'性别'}>
                    {PatGender[resultData?.patSex] || ''}
                  </FormItem>
                  <FormItem label={'年龄'} className={styles.itemText}>
                    {getPatientAge(resultData?.patAge)}
                  </FormItem>
                </Space>
                <FormItem label={'创建时间'}>{resultData?.createTime}</FormItem>
              </Space>
            )}
          </Space>
        </Form>
        <DropDownMenu showModal={false} className={styles.menu}>
          <DropDownMenuItem
            title={
              rangeDate[0]
                ? `${dayjs(rangeDate[0]).format('YYYY/MM/DD')}~${dayjs(
                    rangeDate[1],
                  ).format('YYYY/MM/DD')}`
                : '就诊时间'
            }
            className={styles.dropLeft}
            arrowsSize={18}
            maxHeight={'100vh'}
          >
            <Space vertical>
              <Space className={styles.calenderfoot}>
                <Space className={styles.footItem}>
                  {rangeDate[0]
                    ? `${dayjs(rangeDate[0]).format('YYYY/MM/DD')}~${dayjs(
                        rangeDate[1],
                      ).format('YYYY/MM/DD')}`
                    : '就诊时间'}
                </Space>
                <Space
                  className={styles.footItemActive}
                  onTap={() => {
                    setRangeDate([]);
                  }}
                >
                  清空
                </Space>
              </Space>
              <Calendar.Picker
                range={true}
                current={rangeDate}
                onChange={(v: any[]) => {
                  if (!v[1]) {
                    return;
                  }
                  setRangeDate(v);
                  console.log(v);
                }}
              />
            </Space>
          </DropDownMenuItem>
          <DropDownMenuItem
            title={'就诊类别'}
            options={options1}
            value={recordType}
            onChange={setRecordType}
            arrowsSize={18}
          />
        </DropDownMenu>
        <Space
          className={styles.content}
          flex={1}
          justify="center"
          alignItems={'stretch'}
        >
          {resultData?.recordList?.length ? (
            <>
              <Space className={styles.lineWrap}>
                <Space className={styles.line} />
              </Space>
              <Space vertical flex={1} alignItems={'stretch'}>
                {(resultData?.recordList || []).map(
                  (
                    item: {
                      recordId: string; //就诊记录ID
                      patHisId: string; //就诊人医院唯一ID
                      patCardNo: string; //就诊人就诊卡号
                      patName: string; //就诊人姓名
                      recordType: string; //就诊类别（OPD-门诊；IPD-住院）
                      visitDate: string; //就诊时间
                      deptCode: string; //科室编码
                      deptName: string; //科室名称
                      doctorCode: string; //医生编码
                      doctorName: string; //医生姓名
                    },
                    index: number,
                  ) => (
                    <Space className={styles.item} vertical key={index}>
                      <Space vertical size={30}>
                        <FormItem label={'就诊时间'}>{item.visitDate}</FormItem>
                        <FormItem label={'就诊科室'}>
                          <Exceed clamp={2} className={styles.doctorName}>
                            {item.deptName}
                          </Exceed>
                        </FormItem>
                        <FormItem label={'就诊医生'}>
                          <Exceed clamp={2} className={styles.doctorName}>
                            {item.doctorName}
                          </Exceed>
                        </FormItem>
                        <FormItem label={'就诊类型'}>
                          {recordTypes[item?.recordType]}
                        </FormItem>
                      </Space>
                      <Button
                        ghost
                        type="primary"
                        className={styles.lookBtn}
                        onTap={() => {
                          const {
                            recordId,
                            patName,
                            recordType,
                            visitDate,
                            deptName,
                            doctorName,
                          } = item;
                          const sex = resultData?.patSex;
                          const age = resultData?.patAge;
                          navigateTo({
                            url: `/pages2/diagnosis/order-detail/index?type=${recordType}&visitId=${recordId}&patHisNo=${patHisNo}&inDate=${visitDate}&deptName=${deptName}&doctorName=${doctorName}&sex=${sex}&age=${age}&patientName=${patName}`,
                          });
                        }}
                      >
                        查看详情
                      </Button>
                    </Space>
                  ),
                )}
              </Space>
            </>
          ) : (
            <NoData />
          )}
        </Space>
      </Space>
    </Form>
  );
};
