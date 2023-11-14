import React from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Icon, ListItem, NoData } from '@kqinfo/ui';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import dayjs from 'dayjs';
import useApi from '@/apis/mine';
import styles from './index.less';

export default () => {
  const {
    request,
    data: { data },
  } = useApi.查询关注医生({
    initValue: {
      data: [],
    },
  });
  usePageEvent('onShow', () => {
    request();
    setNavigationBar({
      title: '我的关注',
    });
  });
  return (
    <View className={styles.page}>
      {data?.length >= 1 &&
        data.map(
          (item) =>
            item.hisDoctorName && (
              <ListItem
                key={item.deptId}
                img={item?.image || `${IMAGE_DOMIN}/register/doctor.png`}
                title={item.hisDoctorName}
                className={styles.item}
                subtitle=""
                onTap={() =>
                  navigateTo({
                    url: `/pages2/register/select-time/index?deptId=${
                      item.deptId
                    }&doctorId=${item.doctorId}&scheduleDate=${dayjs().format(
                      'YYYY-MM-DD',
                    )}`,
                  })
                }
                text={`${item.deptName} | ${item.level}`}
                footer={HOSPITAL_NAME}
                after={<Icon name={'kq-right'} color={'#666'} />}
              />
            ),
        )}
      <NoData />
    </View>
  );
};
