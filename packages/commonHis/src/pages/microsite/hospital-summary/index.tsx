import React from 'react';
import { View, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { IMAGE_DOMIN, HOSPITAL_TEL, HOSPITAL_NAME } from '@/config/constant';
import {
  Space,
  Shadow,
  PartTitle,
  RichText,
  ActionSheet,
  setClipboardData,
  showToast,
} from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import useApi from '@/apis/microsite';
import styles from './index.less';
import callPhone from '@/utils/callPhone';
import { PreviewImage } from '@/components';
import reportCmPV from '@/alipaylog/reportCmPV';

export default () => {
  const {
    data: { data: hospitalInfo },
  } = useApi.获取医院信息({
    initValue: {
      data: {
        hospitalName: HOSPITAL_NAME,
        hospitalAddress: '[]',
        hospitalIntroduction: '',
        hospitalLevel: '',
        hisTopImg: '',
        contactNumber: HOSPITAL_TEL,
      },
    },
    needInit: true,
  });
  const callFun = (phoneNumber: string) => {
    ActionSheet.show({
      items: [
        { label: '呼叫', value: '呼叫' },
        { label: '复制', value: '复制' },
      ],
    }).then(({ label, value }) => {
      if (label === '呼叫' && value === '呼叫') {
        callPhone(phoneNumber);
      }
      if (label === '复制' && value === '复制') {
        setClipboardData({ data: phoneNumber }).then(() =>
          showToast({ title: '复制成功' }),
        );
      }
    });
  };
  usePageEvent('onShow', () => {
    reportCmPV({ title: '医院介绍' });
    setNavigationBar({
      title: '医院介绍',
    });
  });

  return (
    <View className={styles.page}>
      <View className={styles.top} />
      <View className={styles.card}>
        <Shadow card>
          <Space alignItems="center" className={styles.cardWrap}>
            <PreviewImage
              url={`${IMAGE_DOMIN}/auth/logo.png`}
              className={styles.logo}
            />
            <Text className={styles.cardTitle}>
              {hospitalInfo?.hospitalName}
            </Text>
            <Space className={styles.tag} justify="center" alignItems="center">
              {hospitalInfo?.hospitalLevel || '暂无'}
            </Space>
          </Space>
        </Shadow>
      </View>
      <View className={styles.content}>
        <PartTitle className={styles.partTitle} bold>
          联系电话
        </PartTitle>
        <ActionSheet />
        <View
          onTap={() => {
            const telphones = hospitalInfo?.contactNumber.split(';') || [];
            if (telphones.length > 1) {
              ActionSheet.show({
                items: telphones.map((item) => {
                  return { label: item, value: item };
                }),
              }).then(({ value }) => {
                callFun(value as string);
              });
            } else {
              callFun(telphones[0]);
            }
          }}
        >
          <TextWrap text={hospitalInfo?.contactNumber || '暂无'} />
        </View>
        <PartTitle className={styles.partTitle} bold>
          地址信息
        </PartTitle>
        {hospitalInfo?.hospitalAddress &&
        hospitalInfo?.hospitalAddress !== '[]' ? (
          (JSON.parse(hospitalInfo?.hospitalAddress) || []).map(
            (
              item: {
                desc: string;
                detail: string;
                area: string[];
              },
              i: number,
            ): JSX.Element => {
              return (
                <View key={i} className={styles.textWrap3}>
                  【{item.desc}】
                  <Text className={styles.textWrap33}>{item.detail}</Text>
                </View>
              );
            },
          )
        ) : (
          <TextWrap text={'暂无'} />
        )}
        <PartTitle className={styles.partTitle} bold>
          医院介绍
        </PartTitle>
        <RichText
          nodes={
            hospitalInfo?.hospitalIntroduction === '<p></p>' ||
            !hospitalInfo?.hospitalIntroduction
              ? '暂无'
              : hospitalInfo?.hospitalIntroduction
          }
          className={styles.textWrap2}
        />
      </View>
    </View>
  );
};

const TextWrap = ({ text }: { text: string }) => (
  <View className={styles.textWrap}>{text}</View>
);
