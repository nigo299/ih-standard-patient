import React, { useMemo, useState } from 'react';
import {
  Space,
  FormItem,
  Form,
  useTitle,
  PartTitle,
  Table,
  Price,
  Radio,
} from '@kqinfo/ui';
import styles from './index.less';
import useApi from '@/apis/common';
import useGetParams from '@/utils/useGetParams';
import { PatGender } from '@/config/dict';
const acountTypes: any = {
  YB: '医保',
  ZF: '自费',
};
const FeeTypes: any = {
  DRUG: '药品',
  EXAM: '检验检查',
  TREAT: '治疗',
  OTHER: '其他',
};
export default () => {
  const { visitId, type } = useGetParams<{
    visitId: string;
    type: string;
  }>();
  const [feeType, setFeeType] = useState('ALL' as any);
  const {
    data: { data: detail1 },
    loading: loading1,
  } = useApi.住院结算详情({
    params: {
      recordId: visitId,
      feeType: feeType === 'ALL' ? '' : feeType,
    },
    needInit: type === 'IPD' && !!visitId,
  });
  const {
    data: { data: detail2 },
    loading: loading2,
  } = useApi.门诊结算详情({
    params: {
      recordId: visitId,
      feeType: feeType === 'ALL' ? '' : feeType,
    },
    needInit: type === 'OPD' && !!visitId,
  });

  const detail: any = useMemo(() => {
    if (type === 'OPD') {
      return detail1;
    }
    if (type === 'IPD') {
      return detail2;
    }
    return {};
  }, [detail1, detail2, type]);

  const paitentInfo: Array<{
    title: string;
    content: React.ReactNode | string;
  }> = useMemo(() => {
    if (type === 'OPD') {
      return [
        {
          title: '就诊人',
          content: `${detail?.patName || '-'} | ${
            PatGender[detail?.patSex] || ''
          } ｜ ${detail?.patAge}`,
        },
        { title: '就诊号', content: detail?.essentialInfo?.patCardNo || '-' },
        { title: '就诊科室', content: detail?.essentialInfo?.deptName || '-' },
        {
          title: '就诊医生',
          content: detail?.essentialInfo?.doctorName || '-',
        },
        { title: '就诊时间', content: detail?.essentialInfo?.visitDate || '-' },
        {
          title: '结算类别',
          content: acountTypes[detail?.settlementInfo?.balanceType],
        },
      ];
    }
    if (type === 'IPD') {
      return [
        {
          title: '就诊人',
          content: `${detail?.patName || '-'} | ${
            PatGender[detail?.patSex] || ''
          } ｜ ${detail?.patAge}`,
        },
        {
          title: '住院号',
          content: detail?.essentialInfo?.admissionNum || '-',
        },
        {
          title: '科室',
          content: detail?.essentialInfo?.inDeptName || '-',
        },
        {
          title: '在院天数',
          content: detail?.essentialInfo?.inTime || '-',
        },
        { title: '住院时间', content: detail?.essentialInfo?.inTime || '-' },
        { title: '结算时间', content: detail?.essentialInfo?.outTime || '-' },
        {
          title: '结算类别',
          content: acountTypes[detail?.settlementInfo?.balanceType],
        },
      ];
    }
    return [];
  }, [
    detail?.essentialInfo,
    detail?.patAge,
    detail?.patName,
    detail?.patSex,
    detail?.settlementInfo,
    type,
  ]);
  console.log('paitentInfo', paitentInfo);
  const AccountInfo: Array<{
    title: string;
    content: React.ReactNode | string;
  }> = useMemo(() => {
    return [
      {
        title: '费用总计',
        content: <Price price={+detail?.settlementInfo?.totalFee || 0} />,
      },
      {
        title: '医保支付金额',
        content: <Price price={+detail?.settlementInfo?.insuranceFee || 0} />,
      },
      {
        title: '自费支付金额',
        content: <Price price={+detail?.settlementInfo?.selfFee || 0} />,
      },
      {
        title: '其他',
        content: <Price price={+detail?.settlementInfo?.otherFee || 0} />,
      },
    ];
  }, [
    detail?.settlementInfo?.insuranceFee,
    detail?.settlementInfo?.otherFee,
    detail?.settlementInfo?.selfFee,
    detail?.settlementInfo?.totalFee,
  ]);

  useTitle(type === 'OPD' ? '门诊结算详情' : '住院结算详情');
  return (
    <Form labelStyle={{ color: '#333', fontWeight: 500 }}>
      <Space vertical className={styles.page}>
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
          </Form>
          <PartTitle full>费用</PartTitle>
          <Form readOnly cell>
            {(AccountInfo || []).map((patient) => (
              <FormItem
                label={patient.title}
                key={patient.title}
                labelWidth="4em"
              >
                {patient.content}
              </FormItem>
            ))}
          </Form>

          <PartTitle full>费用清单</PartTitle>
          <Radio.Group value={feeType} onChange={(v) => setFeeType(v)}>
            {[
              { value: 'ALL', label: '全部' },
              { value: 'DRUG', label: '药品' },
              { value: 'EXAM', label: '检验检查' },
              { value: 'TREAT', label: '治疗' },
              { value: 'OTHER', label: '其他' },
            ].map((item: any) => (
              <Radio value={item.value} key={item.value} type="button">
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
          <Table
            loading={loading1 || loading2}
            dataSource={detail?.settlementInfo?.feeList}
            columns={[
              {
                title: '费别',
                dataIndex: 'feeType',
                render: (v) => (
                  <Space style={{ color: '#2780D9' }}>{FeeTypes[v]}</Space>
                ),
              },
              { title: '医保', dataIndex: 'medicalType' },
              { title: '费用名称', dataIndex: 'itemName' },
              {
                title: '单价*数量*合计',
                dataIndex: 'price',
                render: (_, r: any) => (
                  <Space
                    flexWrap="wrap"
                    style={{ color: '#2780D9' }}
                  >{`${r.price}*${r.num}=${r.total}`}</Space>
                ),
              },
            ]}
          />
        </Space>
      </Space>
    </Form>
  );
};
