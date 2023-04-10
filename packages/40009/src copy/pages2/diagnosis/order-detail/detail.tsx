import React, { useEffect, useMemo, useState } from 'react';
import {
  Space,
  FormItem,
  Form,
  useTitle,
  PartTitle,
  NoData,
  Rotate,
  Icon,
  Fold,
  Button,
} from '@kqinfo/ui';
import styles from './index.less';
import useApi from '@/apis/common';
import useCaseHisState from './useCaseHisState';
import usePreScptState from './usePreScptState';
import { navigateTo } from 'remax/one';
const recordTypes: any = {
  OPD: '门诊',
  IPD: '住院',
};
const checkStates: any = {
  '1': '未出报告',
  '2': '已出报告，未审核',
  '3': '已出报告，已审核',
};
const ExpandView = ({
  title = '',
  data,
  type,
  detailType,
}: {
  title: string;
  data: any | any[];
  type: string;
  detailType?: string;
}) => {
  const [show, setShow] = useState(false);
  const [, setPreScpt] = usePreScptState();
  const ItemBox = useMemo(() => {
    console.log('type', type, data);
    if (!data || data.length === 0) {
      return <NoData />;
    }
    if (['1'].includes(type)) {
      if (detailType === 'OPD') {
        return (data?.prescription || []).map(
          (
            item: {
              prescName: string; //处方/医嘱名称
              doctorName: string; //开单医生
              deptName: string; //开单科室
              createTime: string; //开单时间
              prescriptionType?: string;
              prescDetail: [
                //处方/医嘱详情
                {
                  drugType: string; //药品类型
                  drugName: string; //药品名称
                  drugSpec: string; //规格
                  drugNum: string; //数量
                  useMethod: string; //用法
                  dosage: string; //用量
                  dosageUnit: string; //用量单位
                  medicalType: string; //医保类型
                },
              ];
            },
            index: number,
          ) => {
            return (
              <Space
                className={styles.chdItem}
                key={index}
                alignItems={'center'}
                justify={'space-between'}
                size={20}
                onTap={() => {
                  setPreScpt({
                    paitentInfo: data?.paitentInfo,
                    prescription: [item],
                  });
                  navigateTo({
                    url: '/pages2/diagnosis/order-detail/prescription',
                  });
                }}
              >
                <Space flex={1} vertical size={20}>
                  <Space className={styles.chdItemHead} flexWrap={'wrap'}>
                    ℞{index + 1} {item.prescName || '-'}
                  </Space>
                </Space>
                <Space>
                  <Icon name={'kq-right'} size={34} />
                </Space>
              </Space>
            );
          },
        );
      } else {
        return (
          <>
            <Space
              className={styles.chdItem}
              alignItems={'center'}
              justify={'space-between'}
              size={20}
              onTap={() => {
                setPreScpt(data);
                console.log('data', data);
                navigateTo({
                  url: `/pages2/diagnosis/order-detail/beInHisDocAd?type=LONG`,
                });
              }}
            >
              <Space flex={1} vertical size={20}>
                <Space className={styles.chdItemHead} flexWrap={'wrap'}>
                  长期医嘱
                </Space>
              </Space>
              <Space>
                <Icon name={'kq-right'} size={34} />
              </Space>
            </Space>
            <Space
              className={styles.chdItem}
              alignItems={'center'}
              justify={'space-between'}
              size={20}
              onTap={() => {
                setPreScpt(data);
                navigateTo({
                  url: `/pages2/diagnosis/order-detail/beInHisDocAd?type=SHORT`,
                });
              }}
            >
              <Space flex={1} vertical size={20}>
                <Space className={styles.chdItemHead} flexWrap={'wrap'}>
                  短期医嘱
                </Space>
              </Space>
              <Space>
                <Icon name={'kq-right'} size={34} />
              </Space>
            </Space>
          </>
        );
      }
    }
    if (['2', '3'].includes(type)) {
      return (data || []).map(
        (item: {
          reportId: string; //报告ID
          reportType: string; //报告类型；reportType：1-检查报告；2-检验报告
          reportName: string; //报告名称
          reportStatus: string; //报告状态；reportStatus：未出报告-1；已出报告，未审核-2；已出报告，已审核-3
          reportTime: string; //报告时间
          examTime: string; //审核时间
          deptName: string; //送检科室名
          doctorName: string; //送检医生姓名
          exeDeptCode: string; //执行科室代码
          exeDeptName: string; //执行科室名
          reporter: string; //报告人
          auditor: string; //审核人
        }) => {
          return (
            <Space
              className={styles.chdItem}
              key={item.reportId}
              alignItems={'center'}
              justify={'space-between'}
              size={20}
            >
              <Space flex={1} vertical size={20}>
                <Space className={styles.chdItemHead} flexWrap={'wrap'}>
                  {item.reportName || '-'}
                </Space>
                <Space className={styles.chdItemDesc}>
                  {item.reportTime || '-'}
                </Space>
              </Space>
              <Space>
                <Space
                  className={styles.chdItemState}
                  size={20}
                  alignItems={'center'}
                >
                  {checkStates[item.reportStatus]}
                </Space>
                <Icon name={'kq-right'} size={34} />
              </Space>
            </Space>
          );
        },
      );
    }
    if (['4'].includes(type)) {
      return (data || []).map(
        (item: {
          operationId: string; //手术记录ID
          operationType: string; //手术类型
          operationName: string; //手术名称
          operationTime: string; //手术时间
          deptName: string; //执行科室
          doctorName: string; //执行医生
        }) => {
          return (
            <Space
              className={styles.chdItem}
              key={item.operationId}
              alignItems={'center'}
              justify={'space-between'}
              size={20}
            >
              <Space flex={1} vertical size={20}>
                <Space className={styles.chdItemHead} flexWrap={'wrap'}>
                  {item.operationName || '-'}
                </Space>
              </Space>
              <Space>{item.operationTime}</Space>
            </Space>
          );
        },
      );
    }
  }, [data, detailType, setPreScpt, type]);
  return (
    <>
      <PartTitle
        full
        className={styles.itemHead}
        action={
          <Space flex={1} onTap={() => setShow(!show)} justify={'flex-end'}>
            <Rotate run={show} angle={180}>
              <Icon name={'kq-down'} size={24} />
            </Rotate>
          </Space>
        }
      >
        {title}
      </PartTitle>
      <Fold folded={!show}>{ItemBox}</Fold>
    </>
  );
};
export default ({ visitId, type }: { visitId: string; type: string }) => {
  const [, setCaseHis] = useCaseHisState();
  const {
    data: { data: detaildata },
  } = useApi.门诊就诊记录详情({
    params: {
      recordId: visitId,
    },
    needInit: type === 'OPD',
  });
  const {
    data: { data: detaildata1 },
  } = useApi.住院就诊记录详情({
    params: {
      recordId: visitId,
    },
    needInit: type === 'IPD',
  });
  const detail: any = useMemo(() => {
    if (type === 'OPD') {
      return detaildata;
    }
    if (type === 'IPD') {
      return detaildata1;
    }
    return {};
  }, [detaildata, detaildata1, type]);
  const paitentInfo: Array<{
    title: string;
    content: React.ReactNode | string;
  }> = useMemo(() => {
    if (type === 'OPD') {
      return [
        {
          title: '就诊人',
          content: `${detail?.patName || '-'} | ${
            detail?.patSex === 'M' ? '男' : '女'
          } ｜ ${detail?.patAge}`,
        },
        { title: '就诊科室', content: detail?.essentialInfo?.deptName || '-' },
        {
          title: '就诊医生',
          content: detail?.essentialInfo?.doctorName || '-',
        },
        { title: '就诊号', content: detail?.essentialInfo?.patCardNo || '-' },
        { title: '就诊类型', content: recordTypes[detail?.recordType] },
        { title: '就诊时间', content: detail?.essentialInfo?.visitDate || '-' },
      ];
    }
    if (type === 'IPD') {
      return [
        {
          title: '就诊人',
          content: `${detail?.patName || '-'} | ${
            detail?.patSex === 'M' ? '男' : '女'
          } ｜ ${detail?.patAge}`,
        },
        {
          title: '住院号',
          content: detail?.essentialInfo?.admissionNum || '-',
        },
        {
          title: '病床号',
          content: detail?.essentialInfo?.bedNo || '-',
        },
        {
          title: '入院科别',
          content: detail?.essentialInfo?.inDeptName || '-',
        },
        {
          title: '出院科别',
          content: detail?.essentialInfo?.outDeptName || '-',
        },
        { title: '就诊类型', content: recordTypes[detail?.recordType] },
        { title: '入院时间', content: detail?.essentialInfo?.inTime || '-' },
        { title: '出院时间', content: detail?.essentialInfo?.outTime || '-' },
      ];
    }
    return [];
  }, [
    detail?.essentialInfo,
    detail?.patAge,
    detail?.patName,
    detail?.patSex,
    detail?.recordType,
    type,
  ]);
  useEffect(() => {
    setCaseHis(detail?.medicalRecord);
  }, [detail?.medicalRecord, setCaseHis]);

  useTitle('就诊详情');
  return (
    <Form labelStyle={{ color: '#333', fontWeight: 500 }}>
      <Space vertical className={styles.page} size={20}>
        <Space vertical className={styles.topbox} size={20}>
          <PartTitle full>就诊人信息</PartTitle>
          <Form readOnly itemStyle={{ padding: 10 }}>
            {(paitentInfo || []).map((item, index) => {
              return (
                <FormItem label={item.title} key={index}>
                  {item.content}
                </FormItem>
              );
            })}
            <Space justify="center">
              <Button
                type={'default'}
                size={'tiny'}
                onTap={() => {
                  navigateTo({
                    url: `/pages2/diagnosis/order-detail/receiptsDetail?type=${type}&&visitId=${visitId}`,
                  });
                }}
              >
                {type === 'OPD' ? '门诊费用清单' : '费用结算信息'}
              </Button>
            </Space>
          </Form>
        </Space>
        <Space vertical>
          {type === 'OPD' && (
            <PartTitle
              full
              className={styles.itemHead}
              action={
                <Space
                  flex={1}
                  onTap={() => {
                    navigateTo({
                      url: '/pages2/diagnosis/order-detail/caseHistory',
                    });
                  }}
                  justify={'flex-end'}
                >
                  <Icon name={'kq-right'} size={34} />
                </Space>
              }
            >
              门诊病历
            </PartTitle>
          )}
          <ExpandView
            title="医嘱用药"
            data={{
              paitentInfo: paitentInfo,
              prescription: detail?.prescription || [],
            }}
            type={'1'}
            detailType={type}
          />
          <ExpandView
            title="检验报告"
            data={(detail?.report || []).filter(
              (item: any) => item.reportType === '2',
            )}
            type={'2'}
          />
          <ExpandView
            title="检查报告"
            data={(detail?.report || []).filter(
              (item: any) => item.reportType === '1',
            )}
            type={'3'}
          />
          {type === 'OPD' && (
            <ExpandView
              title="手术"
              data={detail?.operation || []}
              type={'4'}
            />
          )}
        </Space>
      </Space>
    </Form>
  );
};
