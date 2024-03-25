import React, { useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { CopyRight, Dialog, Step, WhiteSpace } from '@/components';
import {
  STEP_ITEMS,
  deptChildrenRanJiaBa,
  deptChildrenShangQingSi,
} from '../../../config/constant';
import regsiterState from '@/stores/register';
import globalState from '@/stores/global';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import reportCmPV from '@/alipaylog/reportCmPV';
import Search from '@/pages2/register/search-doctor/search';
// import useApi from '@/apis/common';
// import { useHisConfig } from '@/hooks';

export default () => {
  // const { config } = useHisConfig();
  const [folded, setFolded] = useState(false);
  const [subItem, setSubItem] = useState<
    {
      name: string;
      no: string;
    }[]
  >();
  const { type = 'default' } = useGetParams<{
    type: 'reserve' | 'day' | 'default';
  }>();
  const { setSearchQ } = globalState.useContainer();
  const { deptList, getDeptList } = regsiterState.useContainer();
  // const [show, setShow] = useState(false);
  // const {
  //   data: { data: infoData },
  // } = useApi.注意事项内容查询({
  //   params: {
  //     noticeType: 'GHXZ',
  //     noticeMethod: 'WBK',
  //   },
  //   needInit: config.showChooseDeptDialog,
  // });

  const realDeptList = deptList.map((dept) => {
    if (dept?.no === '30312') {
      return {
        ...dept,
        children: deptChildrenRanJiaBa,
      };
    } else if (dept?.no === '30303') {
      return {
        ...dept,
        children: deptChildrenShangQingSi,
      };
    }
    return dept;
  });
  usePageEvent('onShow', async () => {
    setSearchQ('');
    reportCmPV({ title: '预约挂号' });
    if (deptList.length === 0) {
      getDeptList(type);
    }
    setNavigationBar({
      title: '选择科室',
    });
  });
  // useEffect(() => {
  //   if (config.showChooseDeptDialog && infoData?.[0]?.noticeInfo) setShow(true);
  // }, [config.showChooseDeptDialog, infoData]);
  return (
    <View>
      <Step step={STEP_ITEMS.findIndex((i) => i === '选择科室') + 1} />
      <View className={styles.header} />
      {/* <Space justify="center">
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
                  'https://miying.qq.com/guide-h5/home?appid=wx759f40c196575cd6';
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
      </Space> */}
      <Search
        onConfirm={(val) => {
          navigateTo({
            url: `/pages2/register/search-doctor/index?q=${val}&type=${type}`,
          });
        }}
        placeholder={'输入医生姓名、科室名称进行搜索'}
        showBtn
        style={{ flex: 0, marginLeft: '20px' }}
      />
      <WhiteSpace />
      {/* 二级科室 */}

      <Space flexWrap="wrap" justify="space-between">
        {realDeptList?.length >= 1 &&
          realDeptList?.map((dept) => (
            <Space
              justify="space-between"
              alignItems="center"
              key={dept.no}
              className={styles.list}
              onTap={() => {
                if (dept?.children?.length) {
                  setFolded(true);
                  setSubItem(dept?.children as any);
                  return;
                }
                navigateTo({
                  url: `/pages2/register/select-doctor/index?deptId=${dept.no}&type=${type}`,
                });
              }}
            >
              <View>{dept.name}</View>
            </Space>
          ))}
      </Space>

      <Dialog
        hideFail
        show={folded}
        title={'选择二级科室'}
        successText={'关闭'}
        onSuccess={() => {
          setFolded(false);
        }}
      >
        <Space style={{ lineHeight: 1.2, padding: 20 }} vertical>
          {subItem?.map((item) => {
            return (
              <View
                className={styles.subDept}
                key={item?.no}
                onTap={() => {
                  setFolded(false);
                  navigateTo({
                    url: `/pages2/register/select-doctor/index?deptId=${item.no}&type=${type}`,
                  });
                }}
              >
                {item.name}
              </View>
            );
          })}
        </Space>
      </Dialog>

      <WhiteSpace />
      {process.env.REMAX_APP_PLATFORM === 'app' && (
        <>
          <WhiteSpace />
          <CopyRight dept />
        </>
      )}
      {/* <RegisterNotice
        show={show}
        close={() => {
          setShow(false);
        }}
        content={infoData?.[0]?.noticeInfo || ''}
        confirm={() => {
          setShow(false);
        }}
      /> */}
    </View>
  );
};
