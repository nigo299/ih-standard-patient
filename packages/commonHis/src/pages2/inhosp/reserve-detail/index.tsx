import React, { memo, useEffect, useState } from 'react';
import {
  View,
  // Text,
  navigateTo,
  // navigateBack,
  Image,
  // redirectTo,
} from 'remax/one';
import { usePageEvent } from 'remax/macro';
import request from '@/apis/utils/request';
import showModal from '@/utils/showModal';
// import { analyzeIDCard } from '@/utils';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace, Tip } from '@/components';
import useApi from '@/apis/inhosp';
import { Button, Form, FormItem, ReTextarea, Space } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';
const diseaseLevelMap: { [key: number]: string } = {
  0: '一般',
  1: '严重',
};
const idMap: { [key: number]: string } = {
  '1': '身份证',
  '2': '港澳居民来往内地通行证',
  '3': '台湾居民来往内独通行证',
  '4': '护照',
};
const isHighRisk: { [key: string]: string } = {
  NO: '无',
  YES: '',
};
const isOurHis: { [key: number]: string } = {
  //是否我院产检
  '0': '否',
  '1': '是',
};

import styles from './index.less';
import dayjs from 'dayjs';

// import { IMAGE_DOMIN } from '@/config/constant';

export default memo(() => {
  const { id } = useGetParams<{
    id: string;
  }>();
  const {
    data: { data },
  } = useApi.查询住院订单详情({
    initValue: {
      data: [],
    },
    params: { id: id },
    needInit: !!id,
  });
  const sTitleMap = {
    SUCCESS: '已确认',
    WAITE: '已提交',
    CANCEL: '已取消预约',
  };
  const sTextMap = {
    WAITE: '请保持电话沟通，并留意微信消息通知',
    SUCCESS: '您已确认入院，请按时间往住院登记处办理入院',
    CANCEL: '已取消预约，若有住院需要，您可以重新预约',
  };
  // const [btnVisible, setBtnVisible] = useState();
  const [isFlag, setIsFlag] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  useEffect(() => {
    if (data?.deptName?.includes('妇科')) {
      setIsFlag(true);
    }
    if (data?.status === 'CANCEL') {
      setIsCancel(true);
    }
  }, [data]);
  const [form] = Form.useForm();
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '住院预约详情',
    });
  });
  const cancelOrder = async () => {
    await request.put(`/api/intelligent/ihis/inpatient/reg/cancel`, {
      id: data?.id || '',
      cancelDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      cancelReason: '患者主动取消',
    });
    showModal({
      content: '取消成功，是否回到首页？',
    }).then(({ confirm }) => {
      if (confirm) {
        navigateTo({
          url: '/pages2/inhosp/reserve-list/index',
        });
      }
    });
  };
  return (
    <View className={styles.page}>
      <Space alignItems="center" className={styles.PatName}>
        {data?.status === 'WAITE' && (
          <Image
            className={styles.img}
            src={require(`./images/ytj.png`).default}
          />
        )}
        {data?.status === 'CANCEL' && (
          <Image
            className={styles.img}
            src={require(`./images/yqx.png`).default}
          />
        )}
        {data?.status === 'SUCCESS' && (
          <Image
            className={styles.img}
            src={require(`./images/yqr.png`).default}
          />
        )}

        <Space vertical className={styles.title}>
          <View style={{ fontSize: '16px', marginBottom: '.1rem' }}>
            {sTitleMap[data?.status] || ''}
          </View>
          <View style={{ fontSize: '12px' }}>
            {sTextMap[data?.status] || ''}
          </View>
        </Space>
      </Space>
      <Form form={form} readOnly>
        <WhiteSpace />
        <Form
          cell
          labelCls={styles.label}
          childrenCls={styles.children}
          labelWidth={'4em'}
          requiredMark={false}
        >
          <FormItem label={'就诊人'} name="patientType">
            {data?.patName || ''}
          </FormItem>
          <FormItem label={'病情分级'} name="patientType">
            {diseaseLevelMap[data?.diseaseLevel] || ''}
          </FormItem>
          <FormItem label={'入院科室'} name="patientType">
            {data.deptName || ''}
          </FormItem>
          <FormItem label={'预约入院日期'} name="patientType">
            {dayjs(data.regDate).format('YYYY-MM-DD') || ''}
          </FormItem>
        </Form>

        <WhiteSpace />
        <Form
          cell
          labelWidth={'4em'}
          labelCls={styles.label}
          childrenCls={styles.child}
        >
          <FormItem
            label={'户籍地址'}
            name="patientType"
            childrenCls={styles.child}
          >
            <View>{data?.residenceAddress || ''}</View>
          </FormItem>
          {isFlag ? (
            <>
              <FormItem label={'症状'} name="patientType">
                {data?.symptom || ''}
              </FormItem>
              <FormItem label={'检验检查结果'} name="patientType">
                {data?.examResult || ''}
              </FormItem>
            </>
          ) : (
            <>
              <FormItem label={'预产期'} name="patientType">
                {data.expectedDate || ''}
              </FormItem>
              <FormItem label={'是否我院产检'} name="patientType">
                {isOurHis[data?.examInOurHos] || ''}
              </FormItem>
              <FormItem label={'高危因素'} name="patientType">
                {isHighRisk[data?.isHighRisk] || ''}
              </FormItem>
              {data.isHighRisk == 'YES' && (
                <FormItem name={'highRisk'} childrenAlign="left" readOnly>
                  <ReTextarea
                    className={styles.ReTextarea}
                    placeholderClassName={styles.placeholder}
                    adjustPosition
                    type="text"
                    defaultValue={data?.highRisk}
                  />
                </FormItem>
              )}
            </>
          )}
          {isCancel && (
            <>
              <FormItem label={'取消日期'} name="patientType">
                {data?.cancelDate || ''}
              </FormItem>
              <FormItem label={'取消原因'} name="patientType">
                {data?.cancelReason || ''}
              </FormItem>
            </>
          )}
          <FormItem label={'紧急联系人'} name="patientType">
            {data?.emergencyContact || ''}
          </FormItem>
          <FormItem label={'与患者关系'} name="patientType">
            {data?.relation || ''}
          </FormItem>
          <FormItem label={'联系人证件类型'} name="patientType">
            {idMap[data?.documentType] || ''}
          </FormItem>
          <FormItem label={'联系人证件号'} name="patientType">
            {data?.certificateNo || ''}
          </FormItem>
          <FormItem label={'联系电话'} name="patientType">
            {data?.phone || ''}
          </FormItem>
        </Form>

        <WhiteSpace />

        <Tip
          className={styles.tip}
          items={[
            <View key={'add-tip'} className={styles.tipText}>
              请仔细核对相关信息，正确填写联系方式并保持畅通，无法接收信息则后果自负
            </View>,
          ]}
        />

        {data.status == 'WAITE' && (
          <Button
            type="primary"
            ghost
            onTap={() => {
              cancelOrder();
            }}
          >
            取消预约
          </Button>
        )}
      </Form>
    </View>
  );
});
