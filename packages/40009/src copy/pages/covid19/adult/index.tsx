import React, { useState } from 'react';
import styles from './index.less';
import {
  PartTitle,
  Space,
  Radio,
  Fixed,
  Button,
  Loading,
  showToast,
} from '@kqinfo/ui';
import { useTitle } from 'parsec-hooks';
import dayjs from 'dayjs';
import api from '../api';
import { Text, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import patientState from '@/stores/patient';

export default () => {
  useTitle('核酸检测开单');
  const { bindPatientList, getPatientList } = patientState.useContainer();
  const [checkValue, setCheckValue] = useState<any>();
  const [selectId, setSelectId] = useState<string>();
  const [selectCardNo, setSelectCardNo] = useState<string>();
  const [time] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const {
    data: {
      data: { list: sourceList },
    },
    loading: sourceLoading,
  } = api.核酸套餐查询({
    initValue: { data: { data: { list: [] } } },
  });

  usePageEvent('onShow', () => {
    getPatientList();
  });

  return (
    <Space className={styles.container} vertical size={30}>
      {sourceLoading && <Loading />}
      <Space className={styles.header} justify={'center'}>
        检测日期：{time}
      </Space>
      <Space vertical size={30}>
        <PartTitle bold>检测项目</PartTitle>
        <Radio.Group
          direction="column"
          value={checkValue}
          onChange={(v) => setCheckValue(v)}
          disabled={false}
        >
          {(sourceList || []).map((item: any) => (
            <Radio
              value={item.itemID}
              key={item.itemID}
              className={styles.radioItem}
            >
              <Space vertical size={10}>
                <Space>{item.itemName}</Space>
                <Space>
                  单价：
                  <Text className={styles.price}>
                    {(Number(item.itemAmount || 0) / 100)?.toFixed(2)}
                  </Text>
                  元
                </Space>
              </Space>
            </Radio>
          ))}
        </Radio.Group>
      </Space>
      <Space vertical size={30}>
        <Space flex={1} justify={'space-between'} alignItems={'center'}>
          <PartTitle>检测人员</PartTitle>
        </Space>
        <Space alignItems={'center'} size={20} flexWrap={'wrap'}>
          {bindPatientList?.map((item) => (
            <Space
              justify={'center'}
              size={20}
              key={item.id}
              vertical
              onTap={() => {
                setSelectId(item.patientId);
                setSelectCardNo(item.patCardNo);
              }}
              className={selectId === item.id ? styles.active : styles.unSelect}
            >
              {item.patientName}
              <Text className={styles.radioText}>{item.patientId}</Text>
            </Space>
          ))}
          <Space
            vertical
            alignItems={'center'}
            justify={'center'}
            onTap={() => {
              setSelectId('');
              setSelectCardNo('');
            }}
            className={styles.unAdd}
          >
            + 添加就诊人
          </Space>
        </Space>
      </Space>
      <Fixed>
        <Space
          className={styles.footer}
          alignItems={'center'}
          justify={'space-between'}
        >
          <Space>
            已选择<Text style={{ color: '#FF0000' }}>{checkValue ? 1 : 0}</Text>
            个项目
          </Space>
          <Button
            className={styles.btn}
            type={'primary'}
            onTap={() => {
              if (!checkValue) {
                return showToast({ title: '请选择检测项目', icon: 'none' });
              }
              if (!selectId || !selectCardNo) {
                return showToast({ title: '请选择就诊人', icon: 'none' });
              }
              const selectedItem = sourceList?.find(
                (item) => item.itemID === checkValue,
              );
              navigateTo({
                url: `/pages/covid19/confirm/index?patientId=${selectId}&itemID=${checkValue}&itemName=${encodeURIComponent(
                  selectedItem?.itemName || '',
                )}&price=${selectedItem?.itemAmount}&name=${encodeURIComponent(
                  bindPatientList?.find((item) => item.patientId === selectId)
                    ?.patientName || '',
                )}&no=${selectCardNo}`,
              });
            }}
          >
            立即开单
          </Button>
        </Space>
      </Fixed>
    </Space>
  );
};
