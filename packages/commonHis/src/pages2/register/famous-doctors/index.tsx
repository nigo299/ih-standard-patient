/**
 * @file 名医门诊
 */
import React, { useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import {
  NoData,
  Icon,
  Shadow,
  Space,
  ListItem,
  Exceed,
  Image,
} from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import { RegisterNotice, WhiteSpace } from '@/components';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import globalState from '@/stores/global';
import useApi, { DeptDoctorType } from '@/apis/register';
import dayjs from 'dayjs';
import styles from './index.less';
import Search from './search';
import useApi2 from '@/apis/common';
import setPageStyle from '@/utils/setPageStyle';

export default () => {
  const { setSearchQ, searchQ } = globalState.useContainer();
  const { type } = useGetParams<{
    type: 'reserve' | 'day' | 'default';
  }>();
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
  console.log('recordData?.recordList======>', recordData?.recordList);
  const {
    data: { data: infoData2 },
  } = useApi2.注意事项内容查询({
    params: {
      noticeType: 'GHXZ',
      noticeMethod: 'WBK',
    },
  });
  const [jumpUrl, setJumpUrl] = useState('');
  const [show, setShow] = useState(false);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '名医列表',
    });
    const params: any = {
      doctorTag: 'FAMOUS',
      pageNum: 1,
      numPerPage: 500,
    };
    if (searchQ) {
      params.doctorName = searchQ;
    }
    doctorRequest(params);
  });

  function handleUnique(arr: DeptDoctorType[]): DeptDoctorType[] {
    const m = new Map();
    const newArr = arr.filter((v) => !m.has(v.id) && m.set(v.id, v));
    return newArr;
  }
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
            doctorRequest({
              doctorName: v,
              doctorTag: 'FAMOUS',
            });
          }
        }}
        isHotSearch
      />
      <View className={styles.content}>
        <Shadow
          card
          shadowRadius={5}
          style={{
            padding: 0,
            borderRadius: '10px',
          }}
        >
          <Space vertical className={styles.card}>
            <>
              {recordData?.recordList?.length >= 1 ? (
                handleUnique(recordData?.recordList).map((item) => (
                  <View key={item.deptId} className={styles.doctorItem}>
                    {/* <ListItem
                      img={item.image || `${IMAGE_DOMIN}/register/doctor.png`}
                      title={item?.name}
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
                      text={item?.deptName}
                      after={<Icon name={'kq-right'} color={'#666'} />}
                    /> */}
                    <Space vertical className={styles.newItem}>
                      <Space
                        justify="space-between"
                        alignItems="center"
                        onTap={() => {
                          navigateTo({
                            url: `/pages2/register/famous-doctors/chooseDept/index?doctorId=${item?.doctorId}`,
                          });
                        }}
                      >
                        <Space size={24}>
                          <Image
                            className={styles.avatarIcon}
                            src={
                              item.image || `${IMAGE_DOMIN}/register/doctor.png`
                            }
                          />
                          <Space vertical size={24}>
                            <View>{item?.name}</View>
                            <View className={styles.subTitle}>
                              {item?.deptName}
                            </View>
                          </Space>
                        </Space>
                        <Icon name={'kq-right'} color={'#666'} />
                      </Space>
                    </Space>
                    <Space className={styles.note}>
                      <Exceed>擅长：{item?.specialty}</Exceed>
                    </Space>
                  </View>
                ))
              ) : (
                <NoData />
              )}
            </>
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
