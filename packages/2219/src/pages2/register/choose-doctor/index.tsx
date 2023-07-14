import React from 'react';
import { View, navigateTo, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import {
  IMAGE_DOMIN,
  HOSPITAL_NAME,
  specialDepts,
} from '../../../config/constant';
import { DeptInfo } from '@/pages2/register/components';
import { NoData, Shadow, Exceed } from '@kqinfo/ui';
import registerState from '@/stores/register';
import useApi from '@/apis/register';
import useGetParams from '@/utils/useGetParams';
import styles from '@/pages2/register/choose-doctor/index.less';

export default () => {
  const { deptDetail } = registerState.useContainer();
  const { deptId, scheduleDate, type } = useGetParams<{
    deptId: string;
    scheduleDate: string;
    type: 'reserve' | 'day';
  }>();
  const { data, request } = useApi.查询科室医生列表({
    initValue: {
      data: {
        recordList: [],
      },
    },
    params: {
      deptId: specialDepts.includes(deptId) ? deptId?.substring(0, 5) : deptId,
      pageNum: 1,
      numPerPage: 50,
    },
    needInit: false,
  });
  usePageEvent('onShow', () => {
    request();
    setNavigationBar({
      title: '选择医生',
    });
  });
  return (
    <View>
      <Step step={3} />
      <View className={styles.content}>
        <DeptInfo
          deptImg={deptDetail?.img || `${IMAGE_DOMIN}/register/dept.png`}
          hospitalName={HOSPITAL_NAME}
          deptName={deptDetail?.name || '本院区'}
          tag={deptDetail?.hisDistrict}
          summary={`简介: ${deptDetail?.summary || '暂无'}`}
          onDetailTap={() =>
            navigateTo({
              url: `/pages2/register/dept-summary/index?deptId=${deptId}`,
            })
          }
        />
        <WhiteSpace />
        {data?.data?.recordList?.length > 0 &&
          data.data.recordList?.map((item) => (
            <Shadow key={item.doctorId}>
              <View
                className={styles.item}
                onTap={() =>
                  // navigateTo({
                  //   url: `/pages2/register/select-time/index?deptId=${deptId}&doctorId=${item.doctorId}&scheduleDate=${scheduleDate}&type=${type}`,
                  // })
                  navigateTo({
                    url: `/pages2/register/select-time/index?deptId=${
                      specialDepts.includes(deptId)
                        ? deptId?.substring(0, 5)
                        : deptId
                    }&doctorId=${
                      item.doctorId
                    }&scheduleDate=${scheduleDate}&type=${type}`,
                  })
                }
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
                  {/*
                <View className={styles.registerFee}>
                  ¥{(item?.regFee / 100).toFixed(2)}
                </View> */}
                </View>
              </View>
            </Shadow>
          ))}

        <NoData />
      </View>
    </View>
  );
};
