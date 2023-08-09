import React, { useState } from 'react';
import { IMAGE_DOMIN, IS_FEEDBACL } from '@/config/constant';
import { Form, ReInput, Button } from '@kqinfo/ui';
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
  const [bedNo, setBedNo] = useState('');
  const [patName, setPatName] = useState('');
  const [deptName, setDeptName] = useState('');
  usePageEvent('onShow', () => {
    initWxSDK();
    setNavigationBar({
      title: '意见反馈',
    });
  });
  const items = [
    {
      label: '患者姓名',
      value: patName,
      setValue: setPatName,
    },
    {
      label: '住院床号',
      value: bedNo,
      setValue: setBedNo,
    },
    {
      label: '住院科室',
      value: deptName,
      setValue: setDeptName,
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
        {items.map((item) => (
          <Item
            key={item.label}
            label={item.label}
            value={item.value}
            setValue={item.setValue}
          />
        ))}
      </View>
      <Button
        type="primary"
        className={styles.btn}
        onTap={() => {
          handleFormSubmit('xx');
        }}
      >
        下一步
      </Button>
    </View>
  );
};

const Item = ({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) => {
  return (
    <View className={styles.item}>
      <View className={styles.label}>
        <Text style={{ color: ' #BB3C59' }}>*</Text>
        {label}
      </View>
      <ReInput
        value={value}
        className={styles.input}
        onChange={(v) => {
          setValue(v as string);
        }}
      />
    </View>
  );
};
