import React, { useState } from 'react';
import { IMAGE_DOMIN, IS_FEEDBACL } from '@/config/constant';
import { Form, ReInput } from '@kqinfo/ui';
import { View, Image, Text } from '@remax/one';

import useApi from '@/apis/feedback';
import useGetParams from '@/utils/useGetParams';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import globalState from '@/stores/global';
import styles from './index.less';

export default () => {
  const { initWxSDK } = globalState.useContainer();
  const { type = undefined } = useGetParams<{
    type: string;
    deptName: string;
    deptId: string;
    doctorName: string;
    doctorId: string;
  }>();
  const [form] = Form.useForm();
  const handleFormSubmit = async (values: any) => {
    // dosomething
  };
  const [patCardNo, setPatCardNo] = useState('');
  usePageEvent('onShow', () => {
    initWxSDK();
    setNavigationBar({
      title: '意见反馈',
    });
  });
  const items = [
    {
      label: '门诊号',
      value: 'xxxx',
    },
  ];
  return (
    <View className={styles.page}>
      <Image
        src={`${IMAGE_DOMIN}/feedback/IPDbanner.png`}
        className={styles.bg}
      />
      <Image src={`${IMAGE_DOMIN}/feedback/logo.png`} className={styles.logo} />
      <View className={styles.box}>
        <View className={styles.item}>
          <View className={styles.label}>
            <Text style={{ color: ' #BB3C59' }}>*</Text>
            {'门诊号'}
          </View>
          <ReInput value={'xxxx'} className={styles.input} />
        </View>
        <View className={styles.item}>
          <View className={styles.label}>
            <Text style={{ color: ' #BB3C59' }}>*</Text>
            {'患者姓名'}
          </View>
          <ReInput value={'xxxx'} className={styles.input} />
        </View>
      </View>
    </View>
  );
};

const Item = ({ label, value }: { label: string; value: string }) => {
  return (
    <View className={styles.item}>
      <View className={styles.label}>{'xxx'}</View>
      <ReInput value={'xxxx'} />
    </View>
  );
};
