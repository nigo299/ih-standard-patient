import React, { useState } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space, Menu, Icon, showToast } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { CopyRight, RegisterNotice, Step, WhiteSpace } from '@/components';
import {
  CHILDREN_DEPTLIST,
  IMAGE_DOMIN,
  STEP_ITEMS,
  IS_DEPT,
  PLATFORM,
} from '@/config/constant';
import regsiterState from '@/stores/register';
import globalState from '@/stores/global';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import reportCmPV from '@/alipaylog/reportCmPV';
import Search from '../search-doctor/search';
import useApi from '@/apis/common';
import { useHisConfig } from '@/hooks';
export default () => {
  const { config } = useHisConfig();
  const { type = 'default' } = useGetParams<{
    type: 'reserve' | 'day' | 'default';
  }>();
  const { setSearchQ } = globalState.useContainer();
  const { deptList, getDeptList } = regsiterState.useContainer();
  const [show, setShow] = useState(true);
  const {
    data: { data: infoData },
  } = useApi.注意事项内容查询({
    params: {
      noticeType: 'GHXZ',
      noticeMethod: 'WBK',
    },
    needInit: config.showChoseDeptDialog,
  });
  usePageEvent('onShow', async () => {
    if (infoData?.[0]?.noticeInfo) setShow(true);
    setSearchQ('');
    reportCmPV({ title: '预约挂号' });
    if (deptList.length === 0) {
      getDeptList(type);
    }
    setNavigationBar({
      title: '选择科室',
    });
  });
  return (
    <View>
      <Step step={STEP_ITEMS.findIndex((i) => i === '选择科室') + 1} />
      <View className={styles.header} />
      <Space justify="center">
        <Image
          className={styles.banner}
          src={`${IMAGE_DOMIN}/register/banner.png`}
          onTap={() => {
            if (!!IS_DEPT) {
              if (process.env.REMAX_APP_PLATFORM === 'app') {
                navigateTo({
                  url: '/pages/home/index',
                });
              } else if (PLATFORM === 'web') {
                window.location.href =
                  'https://miying.qq.com/guide-h5/home?appid=wxab8f6386222bc56a';
              } else {
                showToast({
                  icon: 'none',
                  title: '功能暂未开放!',
                });
              }
            } else {
              showToast({
                icon: 'none',
                title: '功能暂未开放!',
              });
            }
          }}
        />
      </Space>
      <Search
        onConfirm={(val) => {
          navigateTo({
            url: `/pages2/register/search-doctor/index?q=${val}&type=${type}`,
          });
        }}
        placeholder={'输入医生姓名、科室名称进行搜索'}
        showBtn
        style={{ flex: 0 }}
      />
      <WhiteSpace />
      {/* 二级科室 */}
      {CHILDREN_DEPTLIST ? (
        <Menu
          data={deptList.map(({ name, children, no }) => ({
            name,
            id: no,
            children: children.map(({ name, no }) => ({
              name,
              id: no,
            })),
          }))}
          className={styles.menu}
          leftActiveCls={styles.leftActive}
          leftItemCls={styles.leftItem}
          rightItemCls={styles.rightItem}
          onChange={(id, children) => {
            if (children.length === 0) {
              navigateTo({
                url: `/pages2/register/select-doctor/index?deptId=${id}&type=${type}`,
              });
            }
          }}
          onSelect={(dept) => {
            navigateTo({
              url: `/pages2/register/select-doctor/index?deptId=${dept.id}&type=${type}`,
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
            onTap={() =>
              navigateTo({
                url: `/pages2/register/select-doctor/index?deptId=${dept.no}&type=${type}`,
              })
            }
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
      <RegisterNotice
        show={show}
        close={() => {
          setShow(false);
        }}
        content={infoData?.[0]?.noticeInfo || ''}
        confirm={() => {
          setShow(false);
        }}
      />
    </View>
  );
};
