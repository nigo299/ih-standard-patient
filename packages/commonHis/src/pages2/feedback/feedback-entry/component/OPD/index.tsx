import React, { useState } from 'react';
import { IMAGE_DOMIN } from '@/config/constant';
import { ReInput, Button, showToast } from '@kqinfo/ui';
import { View, Image, Text } from '@remax/one';
import useApi from '@/apis/feedback';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import styles from './index.less';
import showModal from '@/utils/showModal';

export default ({ hisId, no }: { hisId: string; no: string }) => {
  const [loading, setLoading] = useState(false);
  const handleFormSubmit = async () => {
    if (!patCardNo) {
      showToast({
        title: '请输入门诊号',
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
    setLoading(true);
    const data = await useApi.查询患者门诊.request({
      hisId,
      number: patCardNo,
      patName,
    });
    if (data?.data) {
      const infoData = data?.data;
      const hasWritenData = await useApi.用户是否已经填写过问卷.request({
        publishKey: 'fd4eed4b24ae4935bfa39766dbdaff3d',
        userKey: infoData?.patName + infoData?.outpNo,
      });
      if (hasWritenData?.data) {
        showModal({
          title: '提示',
          content: '您已提交本次门诊的满意度调查，请勿重复提交',
        });
        setLoading(false);
        return;
      }
      const params = {
        name: infoData?.patName,
        outpNo: infoData?.outpNo,
        patAge: infoData?.patAge,
        doctor: infoData?.doctor,
        adtaTime: infoData?.adtaTime,
      };
      const paramsStr = encodeURIComponent(JSON.stringify(params));
      // 将字符串转换为 Uint8Array 格式
      const encoder = new TextEncoder();
      const dataStr = encoder.encode(paramsStr);

      // 使用 TextDecoder 进行 Base64 编码
      const base64Encoded = btoa(String.fromCharCode.apply(null, dataStr));
      setLoading(false);
      window.location.href = `https://ihs.cqkqinfo.com/patients/p2214-survey/#/?key=fd4eed4b24ae4935bfa39766dbdaff3d&personInfo=${base64Encoded}`;
    } else {
      showToast({
        title: '未查询到患者信息，请重新输入',
        icon: 'fail',
      });
    }
    setLoading(false);
  };
  const [patCardNo, setPatCardNo] = useState(no);
  const [patName, setPatName] = useState('');
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '意见反馈',
    });
  });
  const items = [
    {
      label: '门诊号',
      value: patCardNo,
      setValue: setPatCardNo,
    },
    {
      label: '患者姓名',
      value: patName,
      setValue: setPatName,
    },
  ];
  return (
    <View className={styles.page}>
      <Image
        src={`${IMAGE_DOMIN}/feedback/OPDbanner.png`}
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
        disabled={loading}
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
