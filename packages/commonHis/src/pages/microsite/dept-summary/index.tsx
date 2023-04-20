import React from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space, Menu, Icon } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { CopyRight, WhiteSpace } from '@/components';
import { CHILDREN_DEPTLIST } from '@/config/constant';
import regsiterState from '@/stores/register';
import globalState from '@/stores/global';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import reportCmPV from '@/alipaylog/reportCmPV';
import Search from '@/pages2/register/search-doctor/search';
import dayjs from 'dayjs';

export default () => {
  const { type = 'default', doctor } = useGetParams<{
    type: 'reserve' | 'day' | 'default';
    doctor: boolean;
  }>();
  const { setSearchQ } = globalState.useContainer();
  const { deptList, getDeptList } = regsiterState.useContainer();
  usePageEvent('onShow', async () => {
    setSearchQ('');
    reportCmPV({ title: '预约挂号' });
    if (deptList.length === 0) {
      getDeptList(type);
    }
    setNavigationBar({
      title: '科室介绍',
    });
  });
  return (
    <View>
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
          btnStyle={{ color: 'white' }}
        />
      </View>
      <WhiteSpace />
      {/* 二级科室 */}
      {CHILDREN_DEPTLIST ? (
        <Menu
          data={deptList.map(({ name, children, no }) => ({
            name,
            id: no,
            children: children.map(({ name, no, children }) => ({
              name,
              id: no,
              children: children.map(({ name, no }) => ({
                name,
                id: no,
              })),
            })),
          }))}
          childrenMenuMode="collapse"
          className={styles.menu}
          leftActiveCls={styles.leftActive}
          leftItemCls={styles.leftItem}
          rightItemCls={styles.rightItem}
          onChange={(id, children) => {
            if (children.length === 0) {
              if (!!doctor) {
                navigateTo({
                  url: `/pages/microsite/doctor-summary/index?deptId=${id}&scheduleDate=${dayjs()?.format(
                    'YYYY-MM-DD',
                  )}&type=${type}`,
                });
                return;
              }
              navigateTo({
                url: `/pages2/register/dept-summary/index?deptId=${id}`,
              });
            }
          }}
          onSelect={(dept) => {
            if (!!doctor) {
              navigateTo({
                url: `/pages/microsite/doctor-summary/index?deptId=${
                  dept.no
                }&scheduleDate=${dayjs().format('YYYY-MM-DD')}&type=${type}`,
              });
              return;
            }
            navigateTo({
              url: `/pages2/register/dept-summary/index?deptId=${dept.no}`,
            });
          }}
        />
      ) : (
        deptList?.length >= 1 &&
        deptList?.map((dept) => (
          <Space
            justify="space-between"
            alignItems="center"
            key={dept.no}
            className={styles.list}
            onTap={() => {
              if (!!doctor) {
                navigateTo({
                  url: `/pages/microsite/doctor-summary/index?deptId=${
                    dept.no
                  }&scheduleDate=${dayjs().format('YYYY-MM-DD')}&type=${type}`,
                });
                return;
              }
              navigateTo({
                url: `/pages2/register/dept-summary/index?deptId=${dept.no}`,
              });
            }}
          >
            <View>{dept.name}</View>
            <Icon name={'kq-right'} color={'#ccc'} size={34} />
          </Space>
        ))
      )}

      <WhiteSpace />

      <WhiteSpace />
      {process.env.REMAX_APP_PLATFORM === 'app' && (
        <>
          <WhiteSpace />
          <CopyRight dept />
        </>
      )}
    </View>
  );
};
