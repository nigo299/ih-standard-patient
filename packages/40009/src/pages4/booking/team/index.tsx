import React, { useState, useCallback } from 'react';
import { View, Image, navigateTo, redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Button,
  ColorText,
  NoData,
  showToast,
  Space,
  Calendar,
  Loading,
  Exceed,
  Search,
  List,
} from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { Mask } from '@/components';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useEffectState } from 'parsec-hooks';
import useApi from '@/apis/common';
import styles from './index.less';
import patientState from '@/stores/patient';
import useGetParams from '@/utils/useGetParams';

import ListItem from './components/listItem';

interface NucleType {
  deptId: string;
  doctorId: string;
  endTime: string;
  leftNum: string;
  nucleicDate: string;
  nucleicName: string;
  regFee: string;
  resourceId: string;
  sortNo: string;
  startTime: string;
  timeFlag: string;
  totalNum: string;
}
export default () => {
  const { type } = useGetParams<{ type: string }>();
  const { getPatientList, defaultPatientInfo } = patientState.useContainer();
  const [show, setShow] = useState(false);
  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  const {
    request,
    loading,
    data: { data },
  } = useApi.透传字段({
    params: {
      transformCode: 'KQ00021',
      time: selectDate,
      type,
    },
    needInit: false,
  });
  const [resourceId, setResourceId] = useEffectState(
    data?.data?.items?.[0]?.resourceId || '',
  );
  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '多学科门诊',
    });
  });
  return (
    <View className={styles.page}>
      {loading && <Loading type={'top'} />}
      <View>
        <View className={styles.search_box}>
          <Search
            placeholder={'搜索团队，医生，疾病'}
            showBtn
            onConfirm={console.log}
          />
        </View>
        <View className={styles.content}>
          <List
            // ref={listRef}
            defaultLimit={100}
            getList={useCallback(() => {
              return Promise.resolve({
                pageNum: 1,
                pageSize: 10,
                total: 1000,
                list: new Array(1000).fill('').map((v, i) => i),
              });
            }, [])}
            renderItem={(item) => <ListItem></ListItem>}
          />
        </View>
      </View>
    </View>
  );
};
