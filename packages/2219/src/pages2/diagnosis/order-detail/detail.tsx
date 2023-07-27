import React, { useEffect, useMemo, useState } from 'react';
import {
  Space,
  FormItem,
  Form,
  useTitle,
  PartTitle,
  Icon,
  Button,
} from '@kqinfo/ui';
import styles from './index.less';
import useApi from '@/apis/common';
import useCaseHisState from './useCaseHisState';
import { navigateTo } from 'remax/one';
import { PatGender } from '@/config/dict';
import useGetParams from '@/utils/useGetParams';
const recordTypes: any = {
  OPD: '门诊',
  IPD: '住院',
};

export default ({ visitId, type }: { visitId: string; type: string }) => {
  const { patCardNo, patHisNo } = useGetParams<{
    patCardNo: string;
    patHisNo: string;
  }>();
  const [, setCaseHis] = useCaseHisState();
  const {
    data: { data: detaildata },
  } = useApi.门诊就诊记录详情({
    params: {
      recordId: visitId,
      patCardNo,
      patHisNo,
    },
    needInit: type === 'OPD',
  });
  const {
    data: { data: detaildata1 },
  } = useApi.住院就诊记录详情({
    params: {
      recordId: visitId,
      extFields: JSON.stringify({ patCardNo, patHisNo }),
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
            PatGender[detail?.patSex] || ''
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
            PatGender[detail?.patSex] || ''
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
  }, [detail, type]);
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
        </Space>
      </Space>
    </Form>
  );
};
