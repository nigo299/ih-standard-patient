import React, { useState, useEffect, useMemo } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space, Menu, Icon, showToast } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { CopyRight, Step, WhiteSpace, RegisterNotice } from '@/components';
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
import Search from '@/pages2/register/search-doctor/search';
import useApi from '@/apis/common';
import { useHisConfig } from '@/hooks';
import { DeptType } from 'commonHis/src/apis/register';
export default () => {
  const { config } = useHisConfig();
  const { type = 'default' } = useGetParams<{
    type: 'reserve' | 'day' | 'default';
  }>();
  const { setSearchQ } = globalState.useContainer();
  const { deptList, getDeptList } = regsiterState.useContainer();
  const [show, setShow] = useState(false);
  // 保存一级科室 no (夜间门诊定制需求)
  const [oneNo, setOneNo] = useState<string>();
  // 弹窗变量
  const [showPop, setShowPop] = useState<boolean>(false);
  const [showPopTitle, setShowPopTitle] = useState<string>('');
  const [dept, setDept] = useState<any>('');
  const [noticeContent, setnoticeContent] = useState<any>('');
  const deptListAdd: DeptType[] = useMemo(() => {
    if (deptList?.length) {
      const data = [
        {
          name: '名医门诊',
          id: -999,
          children: [{ name: '名医门诊', no: '-9999', children: [] }],
        },
        ...deptList,
      ];
      data?.splice(1, 0, {
        name: '多学科联合门诊（MDT）',
        no: 'first3',
        children: [
          {
            name: '多学科联合门诊（MDT）',
            no: 'MDT123',
            children: [],
          },
        ],
      });
      return data;
    }

    return [];
  }, [deptList]);
  const {
    data: { data: infoData },
  } = useApi.注意事项内容查询({
    params: {
      noticeType: 'GHXZ',
      noticeMethod: 'WBK',
    },
    needInit: config.showChooseDeptDialog,
  });
  // 夜间门诊
  const {
    data: { data: infoDataYJMZ },
  } = useApi.注意事项内容查询({
    params: {
      noticeType: 'YJMZTS',
      noticeMethod: 'WBK',
    },
  });
  // 便民门诊
  const {
    data: { data: infoDataBMMZT },
  } = useApi.注意事项内容查询({
    params: {
      noticeType: 'BMMZTS',
      noticeMethod: 'WBK',
    },
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
  useEffect(() => {
    if (config.showChooseDeptDialog && infoData?.[0]?.noticeInfo) setShow(true);
  }, [config.showChooseDeptDialog, infoData]);
  // 夜间门诊，便民门诊弹窗
  function onShowPop(type: any) {
    const PopObj: any = {
      YJMZ: {
        showPopTitle: infoDataYJMZ?.[0]?.noticeTypeName,
        noticeContent: infoDataYJMZ?.[0]?.noticeInfo,
      },
      BMMZ: {
        showPopTitle: infoDataBMMZT?.[0]?.noticeTypeName,
        noticeContent: infoDataBMMZT?.[0]?.noticeInfo,
      },
    };
    setShowPop(true);
    setShowPopTitle(PopObj[type].showPopTitle);
    setnoticeContent(PopObj[type].noticeContent);
  }
  function onConfirmBtn() {
    // console.log(
    //   'dept',
    //   `/pages2/register/select-doctor/index?deptId=${dept.id}&type=${type}`,
    // ); // 选择的科室
    // return;
    navigateTo({
      url: `/pages2/register/select-doctor/index?deptId=${dept.id}&type=${type}&oneDeptNo=${oneNo}`,
    });
    setShowPop(false);

    return;
  }
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
          data={(deptListAdd || []).map(({ name, children, id, pid }) => ({
            name,
            id: id,
            pid: pid,
            children: (children || []).map(({ name, children, no, pid }) => ({
              name,
              id: no,
              pid: pid,
              children: (children || []).map(({ name, no, pid }) => ({
                name,
                id: no,
                pid: pid,
              })),
            })),
          }))}
          childrenMenuMode="collapse"
          className={styles.menu}
          autoFlexChildren={true}
          leftActiveCls={styles.leftActive}
          leftItemCls={styles.leftItem}
          rightItemCls={styles.rightItem}
          rightActiveCls={styles.leftActive}
          onChange={(id, children) => {
            const no = deptList.find((v) => v.id === id)?.no;
            setOneNo(no);
            if (children.length === 0) {
              navigateTo({
                url: `/pages2/register/select-doctor/index?deptId=${id}&type=${type}&oneDeptNo=${no}`,
              });
            }
          }}
          onSelect={(dept: any) => {
            console.log('dept', dept); // 选择的科室
            setDept(dept);
            if (dept.id === '-9999') {
              navigateTo({
                url: `/pages2/register/famous-doctors/index`,
              });
              return;
            }
            const name = dept?.name as string;
            if (name?.includes('MDT')) {
              navigateTo({
                url: `/pages4/home/index`,
              });
              return;
            }
            if (dept.pid === 451) {
              onShowPop('YJMZ');
              return;
            }
            if (dept.pid === 563) {
              onShowPop('BMMZ');
              return;
            }

            navigateTo({
              url: `/pages2/register/select-doctor/index?deptId=${dept.id}&type=${type}&oneDeptNo=${oneNo}`,
            });
          }}
        />
      ) : (
        deptList?.length >= 1 &&
        (deptList || []).map((dept) => (
          <Space
            justify="space-between"
            alignItems="center"
            key={dept.no}
            className={styles.list}
            onTap={() =>
              navigateTo({
                url: `/pages2/register/select-doctor/index?deptId=${dept.id}&type=${type}&oneDeptNo=${oneNo}`,
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
        countdownNum={0}
        title={showPopTitle}
        show={showPop}
        close={() => setShowPop(false)}
        content={noticeContent}
        confirm={onConfirmBtn}
      />
    </View>
  );
};
