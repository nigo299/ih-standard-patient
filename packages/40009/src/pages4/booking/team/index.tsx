import React, { useState, useCallback } from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Search, List } from '@kqinfo/ui';
import styles from './index.less';
import useBookingApi, { Team } from '@/apis/mdt';

import Item from './components/listItem';

export default () => {
  const [searchKey, setSearchKey] = useState('');

  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '多学科门诊',
    });
  });

  const getDoctorList = useCallback(() => {
    return useBookingApi.查询团队列表.request({ searchKey }).then((data) => {
      return {
        list: data.data || [],
        // pageNum: data.data?.currentPage,
        // pageSize: data?.data?.numPerPage,
        // total: data?.data?.totalCount || 0,
      };
    });
  }, [searchKey]);

  return (
    <View className={styles.page}>
      <View>
        <View className={styles.search_box}>
          <Search
            placeholder={'搜索团队，医生，疾病'}
            showBtn
            onConfirm={(val: string | undefined) => {
              setSearchKey(val!);
            }}
          />
        </View>
        <View className={styles.content}>
          {/* {teamLoading && <Loading type={'top'} />} */}
          <List
            // ref={listRef}
            defaultLimit={100}
            getList={getDoctorList}
            renderItem={(item: Team) => (
              <Item key={item.id} content={item}></Item>
            )}
          />
        </View>
      </View>
    </View>
  );
};
