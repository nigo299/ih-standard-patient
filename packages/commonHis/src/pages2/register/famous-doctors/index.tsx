/**
 * @file 名医门诊
 */
import React, { useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { NoData, Icon, Shadow, Space, ListItem } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import { RegisterNotice, WhiteSpace } from '@/components';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import globalState from '@/stores/global';
import useApi from '@/apis/register';
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
    let params: any = {
      doctorTag: 'FAMOUS',
    };
    if (searchQ) {
      params.doctorName = searchQ;
    }
    doctorRequest(params);
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
                recordData?.recordList.map((item) => (
                  <View key={item.deptId} className={styles.doctorItem}>
                    <ListItem
                      img={item.image || `${IMAGE_DOMIN}/register/doctor.png`}
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
