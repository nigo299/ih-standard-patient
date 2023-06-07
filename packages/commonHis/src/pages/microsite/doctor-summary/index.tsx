import React, { useCallback, useMemo, useState } from 'react';
import { View, navigateTo, Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { WhiteSpace } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';
import {
  Shadow,
  Exceed,
  DropDownMenuItem,
  DropDownMenu,
  List,
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
  const [selectDept, setSelectDept] = useState(deptId || '');
  const { deptList, getDeptList } = regsiterState.useContainer();
  const [total, setTotal] = useState(0);

  const getDoctorList = useCallback(
    (page, limit) => {
      return useApi.查询科室医生列表
        .request({
          deptId: selectDept,
          pageNum: page,
          numPerPage: limit,
        })
        .then((data) => {
          setTotal(data.data?.totalCount || 0);
          return {
            list: data.data?.recordList || [],
            pageNum: data.data?.currentPage,
            pageSize: data?.data?.numPerPage,
            total: data?.data?.totalCount || 0,
          };
        });
    },
    [selectDept],
  );

  const options1 = useMemo(() => {
    return deptList?.flatMap((item) => {
      if (item.children?.length === 0) {
        return {
          text: item.name,
          value: item.no,
        };
      } else {
        return item.children.map((subItem) => {
          return {
            text: subItem.name,
            value: subItem.no,
          };
        });
      }
    });
  }, [deptList]);
  usePageEvent('onShow', () => {
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
            }}
            options={options1}
          />
        </DropDownMenu>
        <WhiteSpace />
        <View className={styles.docInfo}>
          为您共查找到
          <Text className={styles.docNum}>{total}</Text>
          位医生
        </View>
        <WhiteSpace />
        <List
          getList={getDoctorList}
          renderItem={(item) => (
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
          )}
        />
      </View>
    </View>
  );
};
