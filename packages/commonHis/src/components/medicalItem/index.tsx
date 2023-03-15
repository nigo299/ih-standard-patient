import React, { useMemo } from 'react';
import { FormItem, Exceed, Space } from '@kqinfo/ui';
import classNames from 'classnames';
import Mask from '@/components/mask';
import { View, Image } from 'remax/one';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';
import { MedicalPayType } from '@/apis/register';

const medTypeData: Record<string, any> = {
  '11': '普通门诊',
  '12': '门诊挂号',
  '13': '急诊',
  '14': '门诊慢特病',
  '19': '意外伤害门诊',
  '21': '普通住院',
  '24': '急诊转住院',
  '41': '定点药店购药',
  '51': '生育门诊',
  '52': '生育住院',
  '53': '计划生育手术费',
};

export default ({
  show,
  close,
  medicalData,
}: {
  show: boolean;
  close: () => void;
  medicalData?: MedicalPayType;
}) => {
  const infoList = [
    {
      label: '门诊类别',
      text: medTypeData[medicalData?.medicalReq?.medType || '11'],
    },
    {
      label: '门诊科室',
      text: medicalData?.medicalReq?.deptName,
    },
    {
      label: '医生姓名',
      text: medicalData?.medicalReq?.drName,
    },
    {
      label: '处方时间',
      text: medicalData?.medicalReq?.begntime,
    },
    {
      label: '费用总额',
      text: Number(medicalData?.feeSumamt).toFixed(2),
      className: styles.primary,
    },
  ];

  const feedetailList = useMemo(() => {
    const list = JSON.parse(medicalData?.medicalReq?.feedetailList || '');
    if (Array.isArray(list)) {
      return list.map((item) => {
        return {
          label: `${item.medListName}*${Number(item.cnt).toFixed(0)}`,
          text: item.pric,
        };
      });
    }
    return [];
  }, [medicalData?.medicalReq?.feedetailList]);

  const diseinfoList = useMemo(() => {
    const list =
      medicalData?.medicalReq?.diseinfoList &&
      JSON.parse(medicalData?.medicalReq?.diseinfoList || '');
    if (Array.isArray(list)) {
      return [
        {
          label: '诊断名称',
          text: list[0].diagName,
        },
        {
          label: '诊断编号',
          text: list[0].diagCode,
        },
      ];
    }
    return [];
  }, [medicalData?.medicalReq?.diseinfoList]);
  return (
    <Mask direction="bottom" show={show} close={close}>
      <View className={styles.wrap}>
        <Space
          alignItems="center"
          justify="space-between"
          className={styles.title}
        >
          <View>处方明细</View>
          <Image
            src={`${IMAGE_DOMIN}/medical/close.png`}
            className={styles.closeImg}
            onTap={close}
          />
        </Space>
        <Space vertical className={styles.items}>
          <View className={styles.itemTitle}>就诊信息</View>
          <View className={styles.itemWrap}>
            {infoList.map((item) => (
              <ListItem
                key={item.label}
                label={item.label}
                text={item.text}
                className={item.className}
              />
            ))}
          </View>
        </Space>
        {diseinfoList.length > 0 && (
          <Space vertical className={styles.items}>
            <View className={styles.itemTitle}>诊断信息</View>
            <View className={styles.itemWrap}>
              {diseinfoList.map((item) => (
                <ListItem
                  key={item.label}
                  label={item.label}
                  text={item.text}
                />
              ))}
            </View>
          </Space>
        )}
        <Space vertical className={styles.items}>
          <View className={styles.itemTitle}>费用信息</View>
          <View className={styles.itemWrap}>
            {feedetailList.map((item) => (
              <ListItem key={item.label} label={item.label} text={item.text} />
            ))}
          </View>
        </Space>
      </View>
    </Mask>
  );
};

const ListItem = ({
  label,
  text,
  className,
}: {
  label: string;
  text?: string;
  className?: string;
}) => (
  <Space justify="space-between" alignItems="center" className={styles.list}>
    <FormItem
      label={label}
      className={styles.listTitle}
      labelCls={styles.listTitle}
      colon={false}
      labelWidth={'4em'}
    />
    <Exceed className={classNames(styles.listText, className)}>
      {text || '暂无'}
    </Exceed>
  </Space>
);
