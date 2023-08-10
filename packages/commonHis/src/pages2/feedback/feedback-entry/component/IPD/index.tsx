import React, { useState } from 'react';
import { IMAGE_DOMIN, IS_FEEDBACL } from '@/config/constant';
import { Form, ReInput, Button, showToast } from '@kqinfo/ui';
import { View, Image, Text } from '@remax/one';
import useApi from '@/apis/feedback';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import styles from './index.less';
import qs from 'qs';

export default ({ hisId, dept, deptId }) => {
  const handleFormSubmit = async () => {
    if (!bedNo) {
      showToast({
        title: '请输入床号',
        icon: 'fail',
      });
      return;
    }
    if (!patName) {
      showToast({
        title: '请输入患者姓名',
        icon: 'fail',
      });
      return;
    }
    const data = await useApi.查询患者住院.request({
      hisId,
      number: bedNo,
      patName,
      dept: deptName,
      deptId,
    });
    if (data?.data) {
      const infoData = data?.data;
      const params = {
        name: infoData?.patName,
        inpDeptName: infoData?.inpDeptName,
        inpBedNo: infoData?.inpBedNo,
        doctor: infoData?.inpDoctor,
        adtaTime: infoData?.adtaTime,
        outTime: infoData?.outTime,
        inpPnurs: infoData?.inpPnurs,
      };
      const paramsStr = JSON.stringify(params);
      const base64Str = btoa(unescape(encodeURIComponent(paramsStr)));
      // window.location.href = `https://tihs.cqkqinfo.com/patients/p2214-survey/#/?key=6a26311d0ce94a4f916515ef280bc55e&personInfo=${base64Str}`;
      return;
    }
    showToast({
      title: '未查询到患者信息，请重新输入',
      icon: 'fail',
    });
  };
  const [bedNo, setBedNo] = useState('');
  const [patName, setPatName] = useState('');
  const [deptName, setDeptName] = useState(dept);
  usePageEvent('onShow', () => {
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
          handleFormSubmit();
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
