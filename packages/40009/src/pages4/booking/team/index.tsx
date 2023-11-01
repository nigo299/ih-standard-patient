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
import useBookingApi from '../../apis/booking/team';

import Item from './components/listItem';

export default () => {
  const { type } = useGetParams<{ type: string }>();
  const {
    request,
    loading: teamLoading,
    data: { data = [] },
  } = useBookingApi.团队列表({
    params: {
      searchKey: '',
    },
    needInit: true,
  });
  console.log('teamData======>', data);

  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '多学科门诊',
    });
  });

  return (
    <View className={styles.page}>
      <View>
        <View className={styles.search_box}>
          <Search
            placeholder={'搜索团队，医生，疾病'}
            showBtn
            onConfirm={(val) => {
              request({ searchKey: val });
            }}
          />
        </View>
        <View className={styles.content}>
          {teamLoading && <Loading type={'top'} />}
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
            renderItem={(item) => <Item key={item}></Item>}
          />
        </View>
      </View>
    </View>
  );
};
