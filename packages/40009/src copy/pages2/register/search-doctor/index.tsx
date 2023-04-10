import React, { useState, useMemo } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { NoData, Icon, Shadow, Space, ListItem, Menu } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import { RegisterNotice, WhiteSpace } from '@/components';
import {
  IMAGE_DOMIN,
  HOSPITAL_NAME,
  CHILDREN_DEPTLIST,
  THEME_COLOR,
} from '@/config/constant';
import globalState from '@/stores/global';
import useApi from '@/apis/register';
import classNames from 'classnames';
import dayjs from 'dayjs';
import styles from './index.less';
import Search from './search';
import useApi2 from '@/apis/common';
import setPageStyle from '@/utils/setPageStyle';

const tabs = [
  { content: '科室', index: 1 },
  { content: '医生', index: 2 },
];

export default () => {
  const { setSearchQ, searchQ } = globalState.useContainer();
  const { type } = useGetParams<{
    type: 'reserve' | 'day' | 'default';
  }>();
  const {
    request: deptRequest,
    data: { data: deptList },
  } = useApi.查询科室列表({
    initValue: {
      data: [],
    },
    needInit: false,
  });
  const {
    request: doctorRequest,
    data: { data: recordData }, // 解决未授权返回数据为空 导致解构报错
  } = useApi.查询科室医生列表({
    initValue: {
      data: {
        recordList: [],
      },
    },
    needInit: false,
  });
  const {
    data: { data: infoData2 },
  } = useApi2.注意事项内容查询({
    params: {
      noticeType: 'GHXZ',
      noticeMethod: 'WBK',
    },
  });
  const newDeptList = useMemo(() => {
    if (deptList?.length) {
      if (deptList[0]?.pid === -1) {
        return deptList[0].children || [];
      } else {
        return deptList;
      }
    }
    return [];
  }, [deptList]);
  const [jumpUrl, setJumpUrl] = useState('');
  const [show, setShow] = useState(false);
  const [selectTab, setSelectTab] = useState(1);
  usePageEvent('onShow', () => {
    if (searchQ) {
      deptRequest({
        deptName: searchQ,
      });
      doctorRequest({
        doctorName: searchQ,
      });
    }
    setNavigationBar({
      title: '搜索',
    });
  });
  return (
    <View>
      <WhiteSpace />
      <Search
        placeholder={'输入医生姓名、科室名称进行搜索'}
        showBtn
        style={{ flex: 0 }}
        onConfirm={(v) => {
          if (v) {
            setSearchQ(v);
            deptRequest({
              deptName: v,
            });
            doctorRequest({
              doctorName: v,
            });
          }
        }}
        isHotSearch
      />
      <View className={styles.content}>
        <Shadow
          card
          style={{
            padding: 0,
            borderRadius: '20px',
          }}
        >
          <Space vertical className={styles.cards}>
            <View className={styles.tab}>
              {tabs.map(({ content, index }, i) => (
                <React.Fragment key={index}>
                  <View
                    className={classNames(styles.item, {
                      [styles.active]: selectTab === index,
                    })}
                    onTap={() => {
                      setSelectTab(index);
                    }}
                  >
                    {content}
                  </View>
                  {i !== tabs.length - 1 && tabs.length === 2 && (
                    <View
                      className={styles.slice}
                      style={{
                        background: selectTab
                          ? `linear-gradient(${
                              selectTab === 1 ? 248 : -248
                            }deg, #fff 50%, ${THEME_COLOR} 50%)`
                          : '#fff',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>

            <Space vertical className={styles.card}>
              {selectTab === 1 && (
                <>
                  {newDeptList?.length >= 1 ? (
                    CHILDREN_DEPTLIST ? (
                      <Menu
                        data={newDeptList.map(({ name, children, no }) => ({
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
                            const url = `/pages2/register/select-doctor/index?deptId=${id}&type=${type}`;
                            if (type === 'default') {
                              if (infoData2?.[0]?.noticeInfo) {
                                setShow(true);
                                setJumpUrl(url);
                              } else {
                                setPageStyle({
                                  overflow: 'inherit',
                                });
                                navigateTo({
                                  url: url,
                                });
                              }
                            } else {
                              navigateTo({
                                url,
                              });
                            }
                          }
                        }}
                        onSelect={(dept) => {
                          const url = `/pages2/register/select-doctor/index?deptId=${dept.id}&type=${type}`;
                          if (type === 'default') {
                            if (infoData2?.[0]?.noticeInfo) {
                              setShow(true);
                              setJumpUrl(url);
                            } else {
                              setPageStyle({
                                overflow: 'inherit',
                              });
                              navigateTo({
                                url: url,
                              });
                            }
                          } else {
                            navigateTo({
                              url,
                            });
                          }
                        }}
                      />
                    ) : (
                      deptList?.map((dept) => (
                        <Space
                          justify="space-between"
                          alignItems="center"
                          key={dept.no}
                          className={styles.list}
                          onTap={() => {
                            const url = `/pages2/register/select-doctor/index?deptId=${dept.no}&type=${type}`;
                            if (type === 'default') {
                              if (infoData2?.[0]?.noticeInfo) {
                                setShow(true);
                                setJumpUrl(url);
                              } else {
                                setPageStyle({
                                  overflow: 'inherit',
                                });
                                navigateTo({
                                  url: url,
                                });
                              }
                            } else {
                              navigateTo({
                                url,
                              });
                            }
                          }}
                        >
                          <View>{dept.name}</View>
                          <Icon name={'kq-right'} color={'#ccc'} size={34} />
                        </Space>
                      ))
                    )
                  ) : (
                    <NoData />
                  )}
                </>
              )}
              {selectTab === 2 && (
                <>
                  {recordData?.recordList?.length >= 1 ? (
                    recordData?.recordList.map((item) => (
                      <View key={item.deptId} className={styles.doctorItem}>
                        <ListItem
                          img={
                            item.image || `${IMAGE_DOMIN}/register/doctor.png`
                          }
                          title={item.name}
                          subtitle=""
                          onTap={() => {
                            const scheduleDate =
                              type === 'reserve'
                                ? dayjs().add(1, 'day').format('YYYY-MM-DD')
                                : dayjs().format('YYYY-MM-DD');
                            const url = `/pages2/register/select-time/index?deptId=${item.deptId}&doctorId=${item.doctorId}&scheduleDate=${scheduleDate}&type=${type}`;
                            if (type === 'default') {
                              if (infoData2?.[0]?.noticeInfo) {
                                setShow(true);
                                setJumpUrl(url);
                              } else {
                                setPageStyle({
                                  overflow: 'inherit',
                                });
                                navigateTo({
                                  url: url,
                                });
                              }
                            } else {
                              navigateTo({
                                url,
                              });
                            }
                          }}
                          text={`${item.deptName || '暂无'} | ${item.level}`}
                          footer={HOSPITAL_NAME}
                          after={<Icon name={'kq-right'} color={'#666'} />}
                        />
                      </View>
                    ))
                  ) : (
                    <NoData />
                  )}
                </>
              )}
            </Space>
          </Space>
        </Shadow>
      </View>
      <RegisterNotice
        show={show}
        close={() => setShow(false)}
        content={infoData2?.[0]?.noticeInfo || ''}
        confirm={() => {
          setShow(false);
          navigateTo({
            url: jumpUrl,
          });
        }}
      />
    </View>
  );
};
