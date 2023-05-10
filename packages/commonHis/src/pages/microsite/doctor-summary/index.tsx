import React, { useMemo, useState } from 'react';
import { View, navigateTo, Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';

import {
  NoData,
  Shadow,
  Exceed,
  DropDownMenuItem,
  DropDownMenu,
} from '@kqinfo/ui';

import globalState from '@/stores/global';
import useApi from '@/apis/register';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';
import Search from '@/pages2/register/search-doctor/search';
import regsiterState from '@/stores/register';
export default () => {
  // const { deptDetail } = registerState.useContainer();
  const { setSearchQ } = globalState.useContainer();
  const { deptId, scheduleDate, type } = useGetParams<{
    deptId: string;
    scheduleDate: string;
    type: 'reserve' | 'day';
  }>();
  const { deptList, getDeptList } = regsiterState.useContainer();
  const { data, request } = useApi.查询科室医生列表({
    initValue: {
      data: {
        recordList: [],
      },
    },
    params: {
      deptId,
    },
    needInit: false,
  });
  const [selectDept, setSelectDept] = useState(deptId || '');
  const options1 = useMemo(() => {
    if (deptList?.length !== 0) {
      return deptList.map((item) => {
        return {
          text: item.name,
          value: item.no,
        };
      });
    }
  }, [deptList]);
  usePageEvent('onShow', () => {
    request({ deptId: selectDept || '' }).then((data) => {
      console.log(data);
    });
    if (deptList.length === 0) {
      getDeptList(type);
    } else {
      console.log(deptList, '213');
    }
    setNavigationBar({
      title: '选择医生',
    });
  });
  return (
    <View>
      {/* <Step step={3} /> */}
      <View className={styles.content}>
        <View className={styles.header}>
          <Search
            onConfirm={(val) => {
              if (val) {
                setSearchQ(val);
                navigateTo({
                  url: `/pages2/register/search-doctor/index?type=${type}`,
                });
              }
            }}
            placeholder={'输入科室名称进行搜索'}
            showBtn
            style={{ flex: 0 }}
            btnStyle={{ color: 'black' }}
          />
        </View>
        <WhiteSpace />
        <DropDownMenu
          showModal={false}
          style={{ backgroundColor: 'transparent', color: 'black' }}
        >
          <DropDownMenuItem
            value={selectDept}
            onChange={(v) => {
              setSelectDept(v);
              request({ deptId: v });
              console.log(v);
            }}
            options={options1}
          />
        </DropDownMenu>
        <WhiteSpace />
        <View className={styles.docInfo}>
          为您共查找到
          <Text className={styles.docNum}>
            {data?.data?.recordList?.length}
          </Text>
          位医生
        </View>
        <WhiteSpace />
        {data?.data?.recordList?.length > 0 &&
          data.data.recordList?.map((item) => (
            <Shadow key={item.doctorId}>
              <View
                className={styles.item}
                onTap={() => {
                  navigateTo({
                    url: `/pages2/register/doctor-summary/index?deptId=${item.deptId}&doctorId=${item.doctorId}&reg=true&scheduleDate=${scheduleDate}&type=${type}`,
                  });
                }}
              >
                <Image
                  className={styles.avatar}
                  src={
                    item.image && item.image !== 'null'
                      ? item.image
                      : `${IMAGE_DOMIN}/register/doctor.png`
                  }
                />
                <View className={styles.info}>
                  <View className={styles.name}>{item.name}</View>
                  <View className={styles.title}>{item.level}</View>
                  <Exceed clamp={1} className={styles.intro}>
                    {`简介: ${
                      item?.specialty && item?.specialty !== 'null'
                        ? item?.specialty
                        : '暂无'
                    }`}
                  </Exceed>
                </View>
              </View>
            </Shadow>
          ))}

        <NoData />
      </View>
    </View>
  );
};
