import React, { useState, useMemo, useCallback } from 'react';
import { View, navigateTo, Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import { IMAGE_DOMIN, STEP_ITEMS } from '@/config/constant';
import { DoctorInfo, Calendar } from '@/pages2/register/components';
import { Space, showToast, Loading } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';
import Items from '@/pages2/register/select-time/items';
import dayjs from 'dayjs';
import { useEffectState } from 'parsec-hooks';
import useApi from '@/apis/register';
import registerState from '@/stores/register';
import { useUpdateEffect } from 'ahooks';
import styles from './index.less';
import { useHisConfig } from '@/hooks';

export default () => {
  const { config } = useHisConfig();
  const { setDoctorDetail } = registerState.useContainer();
  const {
    deptId,
    doctorId,
    scheduleDate = dayjs().format('YYYY-MM-DD'),
    doctorName,
    sourceType,
    title,
    level,
    type = 'default',
  } = useGetParams<{
    deptId: string;
    title: string;
    level: string;
    sourceType: string;
    doctorName: string;
    doctorId: string;
    scheduleDate: string;
    type: 'reserve' | 'day' | 'default';
  }>();

  /** 当前是否是门诊医生，门诊缴费医生不能关注 */
  const isClinicDoctor = sourceType === '1';

  const {
    request: doctorDetailRequest,
    data: { data: doctorDetail },
  } = useApi.查询医生详情({
    params: {
      doctorId,
      deptNo: deptId,
    },
    needInit: !!doctorId,
  });
  const {
    request,
    data: { data: favoriteStatus },
  } = useApi.查询是否关注医生({
    initValue: {
      data: false,
    },
    params: {
      doctorId,
      deptId,
    },
    needInit: !!doctorId && !!deptId && !isClinicDoctor,
  });
  const {
    request: doctorScheduleRequest,
    loading,
    data: { data: doctorScheduleList },
  } = useApi.查询医生排班日期({
    initValue: {
      data: [],
    },
    params: {
      deptId,
      doctorId,
    },
    needInit: !!deptId && !!doctorId,
  });
  const [scheduleId, setScheduleId] = useState<string>('');

  const [date, setDate] = useEffectState(
    useMemo(() => {
      // const routerDate = scheduleDate;
      // let newDate;
      // if (routerDate !== dayjs().format('YYYY-MM-DD')) {
      //   newDate = routerDate;
      // } else {
      //   newDate = doctorScheduleList?.find(
      //     ({ status }) => status === 1,
      //   )?.scheduleDate;
      // }
      return dayjs(scheduleDate);
    }, [scheduleDate]),
  );

  const {
    request: doctoreDateRequest,
    loading: loading2,
    data: { data: doctorScheduleDateDetail },
  } = useApi.查询医生排班号源({
    initValue: {
      data: { itemList: [] },
    },
    params: {
      scheduleDate: date.format('YYYY-MM-DD'),
      doctorId,
      deptId,
    },
    needInit: !!deptId && !!doctorId && !!date,
  });
  const renderDate = (day: dayjs.Dayjs) => {
    const canSelect =
      doctorScheduleList &&
      doctorScheduleList?.some(({ scheduleDate }) => day.isSame(scheduleDate));
    const isFull =
      doctorScheduleList &&
      doctorScheduleList?.some(
        ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 2,
      );

    let canSelectAndHasSource;

    if (type === 'reserve') {
      canSelectAndHasSource = doctorScheduleList?.some(
        ({ scheduleDate, status }) =>
          scheduleDate !== dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1,
      );
    } else if (type === 'day') {
      canSelectAndHasSource = doctorScheduleList?.some(
        ({ scheduleDate, status }) =>
          scheduleDate === dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1,
      );
    } else {
      canSelectAndHasSource = doctorScheduleList?.some(
        ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 1,
      );
    }
    const nowActive = day.isSame(date);
    if (canSelectAndHasSource) {
      return (
        <View
          className={styles.hasSource}
          style={{ color: nowActive ? '#f371a9' : '#333' }}
        >
          有号
        </View>
      );
    } else if (isFull) {
      return <View className={styles.noSource}>满诊</View>;
    } else if (canSelect) {
      return <View className={styles.noSource}>暂无</View>;
    } else {
      return <View />;
    }
  };
  const renderCanChoose = (day: dayjs.Dayjs) => {
    if (type === 'reserve') {
      return doctorScheduleList?.some(
        ({ scheduleDate, status }) =>
          scheduleDate !== dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1,
      );
    } else if (type === 'day') {
      return doctorScheduleList?.some(
        ({ scheduleDate, status }) =>
          scheduleDate === dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1,
      );
    } else {
      return doctorScheduleList?.some(
        ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 1,
      );
    }
  };

  const morningList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item: { visitPeriod: number }) => item.visitPeriod === 1,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);

  const afternoonList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item: { visitPeriod: number }) => item.visitPeriod === 2,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);
  const nightList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item: { visitPeriod: number }) => item.visitPeriod === 3,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);
  const dayList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item: { visitPeriod: number }) => item.visitPeriod === 4,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);
  const duringList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item: { visitPeriod: number }) => item.visitPeriod === 5,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);

  const middayList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item: { visitPeriod: number }) => item.visitPeriod === 6,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);

  const handleNext = useCallback(
    (scheduleId: string) => {
      const { visitBeginTime, visitEndTime, visitPeriod, extPropes } =
        doctorScheduleDateDetail?.itemList?.find(
          (item: { scheduleId: string }) => item.scheduleId === scheduleId,
        ) as any;

      if (visitBeginTime && visitEndTime && deptId)
        navigateTo({
          url: `/pages2/register/confirm/index?deptId=${deptId}&doctorId=${doctorId}&scheduleDate=${date?.format(
            'YYYY-MM-DD',
          )}&scheduleId=${scheduleId}&visitBeginTime=${visitBeginTime}&visitEndTime=${visitEndTime}&visitPeriod=${visitPeriod}&sourceType=${sourceType}&hisName=${
            doctorDetail?.hisDistrict
          }&level=${level}&title=${title}&doctorName=${doctorName}&regTypes=${extPropes?.sourceType?.slice(
            1,
          )}`,
        });
    },
    [
      date,
      deptId,
      doctorId,
      doctorName,
      doctorScheduleDateDetail?.itemList,
      level,
      sourceType,
      title,
    ],
  );

  const handleAttentionClick = useCallback(async () => {
    if (!favoriteStatus) {
      const { code } = await useApi.关注医生.request({
        deptId,
        doctorId,
      });
      if (code === 0) {
        showToast({
          title: '关注成功',
          icon: 'success',
        });
        request();
      }
    } else {
      const { code } = await useApi.取消关注医生.request({
        deptId,
        doctorId,
      });
      if (code === 0) {
        showToast({
          title: '取消关注成功',
          icon: 'success',
        });
        request();
      }
    }
  }, [deptId, doctorId, favoriteStatus, request]);

  useUpdateEffect(() => {
    if (doctorDetail?.hisDoctorName) {
      setDoctorDetail(doctorDetail);
    }
  }, [doctorDetail]);
  usePageEvent('onShow', () => {
    /** 优化分享页面跳转授权返回后不自动请求接口 */
    if (deptId && doctorId && date) {
      doctoreDateRequest();
      doctorDetailRequest();
      doctorScheduleRequest();
    }
    setNavigationBar({
      title: '选择时间',
    });
  });
  return (
    <View>
      <Step step={STEP_ITEMS.findIndex((i) => i === '选择时间') + 1} />
      <View className={styles.content}>
        <DoctorInfo
          doctorImg={
            doctorDetail?.image || `${IMAGE_DOMIN}/register/doctor.png`
          }
          hospitalName={doctorDetail?.hisName}
          doctorTitle={`${doctorDetail?.deptName || ''} | ${
            doctorDetail?.level || ''
          }`}
          doctorName={doctorDetail?.hisDoctorName || doctorName || '暂无'}
          tag={doctorDetail?.hisDistrict || '本院'}
          summary={`擅长: ${
            doctorDetail?.specialty && doctorDetail?.specialty !== 'null'
              ? doctorDetail?.specialty
              : '暂无'
          }`}
          onDetailTap={() =>
            navigateTo({
              url: `/pages2/register/doctor-summary/index?deptId=${deptId}&doctorId=${doctorId}`,
            })
          }
          showAttention={!isClinicDoctor}
          onAttentionTap={handleAttentionClick}
          isAttention={!!favoriteStatus}
          onShareTap={() => ({
            title: '选择医生',
            path: `/pages2/register/select-time/index?deptId=${deptId}&doctorId=${doctorId}&scheduleDate=${scheduleDate}`,
          })}
        />
        <WhiteSpace />
        <Calendar
          deptId={deptId}
          className={styles.calendar}
          renderDot={renderDate}
          renderDisable={(day: dayjs.Dayjs) => !renderCanChoose(day)}
          current={date}
          limit={config.regCalendarNumberOfDays}
          onChange={(
            day:
              | dayjs.Dayjs
              | [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined],
          ) => {
            if (!Array.isArray(day)) {
              setDate(day);
            }
            setScheduleId('');
          }}
          type={type}
        />

        <WhiteSpace />
        {(loading || loading2) && <Loading type="inline" />}
        {!loading &&
        !loading2 &&
        doctorScheduleList?.find(
          (item) => item?.scheduleDate === date?.format('YYYY-MM-DD'),
        )?.status === 1 ? (
          <>
            {morningList?.length > 0 && (
              <Items
                items={morningList}
                title="上午"
                onChange={handleNext}
                scheduleId={scheduleId}
              />
            )}
            {middayList.length > 0 && (
              <Items
                items={middayList}
                title="中午"
                onChange={handleNext}
                scheduleId={scheduleId}
              />
            )}
            {afternoonList?.length > 0 && (
              <Items
                items={afternoonList}
                title="下午"
                onChange={handleNext}
                scheduleId={scheduleId}
              />
            )}
            {nightList?.length > 0 && (
              <Items
                items={nightList}
                title="晚上"
                onChange={handleNext}
                scheduleId={scheduleId}
              />
            )}

            {dayList?.length > 0 && (
              <Items
                items={dayList}
                title="全天"
                onChange={handleNext}
                scheduleId={scheduleId}
              />
            )}

            {duringList?.length > 0 && (
              <Items
                items={duringList}
                title="白天"
                onChange={handleNext}
                scheduleId={scheduleId}
              />
            )}
          </>
        ) : (
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
      </View>
    </View>
  );
};
