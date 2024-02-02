/**
 * @file 名医门诊科室选择
 */
import React, { useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { NoData, Icon, Shadow, Space, ListItem } from '@kqinfo/ui';
import { usePageEvent } from 'remax/macro';
import useGetParams from '@/utils/useGetParams';
import { IMAGE_DOMIN } from '@/config/constant';
import useApi from '@/apis/register';
import dayjs from 'dayjs';
import styles from '../index.less';
import useApi2 from '@/apis/common';
import setPageStyle from '@/utils/setPageStyle';
import setNavigationBar from '@/utils/setNavigationBar';

export default () => {
  const { type, doctorId } = useGetParams<{
    type: 'reserve' | 'day' | 'default';
    doctorId: string;
  }>();
  const {
    data: { data: recordData }, // 解决未授权返回数据为空 导致解构报错
  } = useApi.查询科室医生列表({
    initValue: {
      data: {
        recordList: [],
      },
    },
    params: {
      doctorTag: 'FAMOUS',
      pageNum: 1,
      numPerPage: 500,
    },
    needInit: true,
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '名医科室',
    });
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
  return (
    <View className={styles.chooseDept}>
      <View className={styles.content}>
        <Space vertical className={styles.chooseDeptCard}>
          <>
            {recordData?.recordList?.length >= 1 ? (
              recordData?.recordList
                .filter((v) => String(v.doctorId) === doctorId)
                .map((item) => (
                  <View key={item.deptId} className={styles.doctorItem}>
                    <ListItem
                      img={item.image || `${IMAGE_DOMIN}/register/doctor.png`}
                      title={item?.deptName}
                      imgCls={styles.avatarIcon}
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
                      text={item?.name}
                      footer={item?.level}
                      after={<Icon name={'kq-right'} color={'#666'} />}
                    />
                  </View>
                ))
            ) : (
              <NoData />
            )}
          </>
        </Space>
        {/* </Shadow> */}
      </View>
    </View>
  );
};
