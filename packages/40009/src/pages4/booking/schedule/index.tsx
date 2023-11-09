import React, { useCallback, useState } from 'react';
import { View, Image, Text, navigateTo } from 'remax/one';
import { WhiteSpace } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';
import { Button, Loading, Space, useTitle, Modal } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';
import dayjs from 'dayjs';
import useApi from '@/apis/mdt';
import styles from './index.less';
import TeamInfo from './components/TeamInfo';
import Calendar from './components/Calendar';
import TimeSec from './components/TimeSec';
export default () => {
  useTitle('选择时间');
  const { teamId } = useGetParams<{
    teamId: string;
  }>();

  const {
    data: { data: doctorDetail },
  } = useApi.根据id查询团队详情({
    params: {
      id: teamId,
    },
    needInit: !!teamId,
  });

  const { loading, data: originalData } = useApi.会诊按日历显示({
    initValue: {
      data: [],
    },
    params: {
      teamId: teamId,
      type: '1',
    },
    needInit: !!teamId,
  });
  const [visitDate, setVisitDate] = useState(
    dayjs().add(1, 'day').format('YYYY-MM-DD'),
  );
  const [sourceNumber, setSourceNumber] = useState('1');
  const [roomDetail, setRoomDetail] = useState({} as any);
  const { loading: dayDetailLoading, data: dayDetail } = useApi.排班详情({
    initValue: {
      data: [],
    },
    params: {
      teamId: teamId,
      type: '1',
      visitDate: visitDate,
    },
    needInit: !!teamId && !!visitDate,
  });
  const changeCanlendar = useCallback((v?: any) => {
    const day = dayjs(v);
    if (dayjs().isSame(day, 'date')) {
      Modal.show({
        title: '温馨提示',
        maskClosable: false,
        content: (
          <View>
            <View className={styles.content}>
              预约当日MDT门诊请联系客服或添加微信：13310226351（工作日8:00-
              17:30，周末及节假日8:00-12:30
            </View>
            <Button onTap={() => Modal.hide()} type="primary">
              知道了
            </Button>
          </View>
        ),
        footer: null,
      });
      return;
    }
    //用dayjs来判断当前时间是否在今天16:30之后
    const now = dayjs();
    const targetTime = dayjs().hour(16).minute(30).second(0);

    if (dayjs().add(1, 'day').isSame(day, 'date') && now.isAfter(targetTime)) {
      Modal.show({
        title: '温馨提示',
        maskClosable: false,
        content: (
          <View>
            <View className={styles.content}>
              MDT门诊需提前24小时预约，请预约24小时后的门诊！如有疑问，请联系客服或添加微信：13310226351（工作日8:00-17:30，周末及节假日8:00-12:30）
            </View>
            <Button onTap={() => Modal.hide()} type="primary">
              知道了
            </Button>
          </View>
        ),
        footer: null,
      });
      return;
    }
    setVisitDate(v);
    setSourceNumber('');
    setRoomDetail({});
  }, []);
  const SplitArray = useCallback((arr: any[]) => {
    const groupedArr = Object.values(
      arr.reduce((acc, item) => {
        if (!acc[item.timeDesc]) {
          acc[item.timeDesc] = [];
        }
        acc[item.timeDesc].push(item);
        return acc;
      }, {}),
    );
    console.log('groupedArr', groupedArr);
    return groupedArr;
  }, []);

  const next = useCallback(() => {
    if (!visitDate) {
      Modal.show({
        title: '温馨提示',
        maskClosable: false,
        content: (
          <View>
            <View className={styles.content}>请选择预约日期</View>
          </View>
        ),
        footer: (
          <View className={styles.footBtn} onTap={() => Modal.hide()}>
            知道了
          </View>
        ),
      });
      return;
    }
    if (!roomDetail?.relationId) {
      Modal.show({
        title: '温馨提示',
        maskClosable: false,
        content: (
          <View>
            <View className={styles.content}>请选择预约时段</View>
          </View>
        ),
        footer: (
          <View className={styles.footBtn} onTap={() => Modal.hide()}>
            知道了
          </View>
        ),
      });
      return;
    }
    const sourceInfo: any = (roomDetail?.scheduleList || []).find(
      (x: any) => x.id === sourceNumber,
    );
    const time = `${dayjs(sourceInfo?.visitDate).format('YYYY-MM-DD')}  ${dayjs(
      sourceInfo?.startTime,
    ).format('HH:mm')}-${dayjs(sourceInfo?.endTime).format('HH:mm')}`;
    navigateTo({
      url: `/pages4/booking/confirm/index?teamId=${encodeURIComponent(
        teamId,
      )}&roomName=${encodeURIComponent(
        roomDetail?.roomDetail.roomName,
      )}&roomId=${encodeURIComponent(roomDetail?.relationId)}&mdtFee=${
        doctorDetail.price || 0
      }&resourceId=${encodeURIComponent(
        sourceNumber,
      )}&hospitalName=${encodeURIComponent(
        doctorDetail?.hospitalName || '',
      )}&hospitalZone=${encodeURIComponent(
        roomDetail?.roomDetail?.districtName || '',
      )}&teamName=${encodeURIComponent(
        doctorDetail?.teamName || '',
      )}&Time=${encodeURIComponent(time)}&position=${encodeURIComponent(
        roomDetail?.roomDetail?.address,
      )}`,
    });
  }, [roomDetail, doctorDetail, sourceNumber, visitDate]);
  console.log('doctorDetail', doctorDetail);
  return (
    <View>
      <View className={styles.contentwarp}>
        {(loading || dayDetailLoading) && <Loading />}
        <Modal />
        <TeamInfo data={doctorDetail} />
        <WhiteSpace />
        <Calendar
          data={originalData?.data}
          value={visitDate}
          onChange={(v: any) => {
            changeCanlendar(v);
          }}
        />

        <WhiteSpace />
        {(dayDetail?.data || []).map((item) => {
          return (
            <View key={item.relationId} className={styles.roombox}>
              <Space className={styles.room} alignItems="center">
                {item.relationName}
              </Space>
              {(
                SplitArray(
                  item?.scheduleList.filter((x) => x.isPublish === 1),
                ) || []
              ).map((chdItem: any) => {
                return (
                  <TimeSec
                    key={chdItem.timeDesc}
                    value={sourceNumber}
                    data={chdItem}
                    onChange={(v: any) => {
                      setSourceNumber(v);
                      setRoomDetail(item);
                    }}
                  />
                );
              })}
            </View>
          );
        })}

        {dayDetail?.data?.length === 0 && (
          <Space
            justify="center"
            alignItems="center"
            vertical
            className={styles.noData}
          >
            <Image
              src={`${IMAGE_DOMIN}/register/zwpb.png`}
              className={styles.noDataImg}
              mode="aspectFit"
            />
            <Text>暂无排班</Text>
          </Space>
        )}
        <Button className={styles.btn} type="primary" onTap={next}>
          下一步
        </Button>
      </View>
    </View>
  );
};
