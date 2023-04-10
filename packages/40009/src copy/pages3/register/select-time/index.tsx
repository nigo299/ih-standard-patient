import React, { useState, useMemo, useCallback } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { DoctorSkillCardOld, NoDataOld } from '@/components';
import { Button, showToast } from '@kqinfo/ui';
import useGetParams from '@/utils/useGetParams';
import Items from './items';
import dayjs from 'dayjs';
import { useEffectState } from 'parsec-hooks';
import useApi from '@/apis/register';
import registerState from '@/stores/register';
import patientState from '@/stores/patient';
import { useUpdateEffect } from 'ahooks';
import styles from './index.less';

export default () => {
  const { setConfirmInfo, setDoctorDetail } = registerState.useContainer();
  const { defaultPatientInfo } = patientState.useContainer();
  const { deptId, doctorId, scheduleDate, doctorType } = useGetParams<{
    deptId: string;
    doctorId: string;
    scheduleDate: string;
    doctorType: '1' | '2' | '3' | undefined;
  }>();
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
    request: doctorScheduleRequest,
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
    useMemo(() => dayjs(scheduleDate), [scheduleDate]),
  );
  const {
    request: doctoreDateRequest,
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
    const canSelectAndHasSource = doctorScheduleList?.some(
      ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 1,
    );
    const nowActive = day.isSame(date);
    if (canSelectAndHasSource) {
      return (
        <View
          className={styles.hasSource}
          style={{ color: nowActive ? '#fff' : '#333' }}
        >
          有号
        </View>
      );
    } else {
      return <View className={styles.noSource}>暂无</View>;
    }
  };
  const renderCanChoose = (day: dayjs.Dayjs) => {
    return doctorScheduleList?.some(
      ({ scheduleDate, status }) => day?.isSame(scheduleDate) && status === 1,
    );
  };
  const morningList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item) => item.visitPeriod === 1,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);
  const afternoonList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item) => item.visitPeriod === 2,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);
  const nightList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item) => item.visitPeriod === 3,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);
  const dayList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item) => item.visitPeriod === 4,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);
  const duringList = useMemo(() => {
    return (
      doctorScheduleDateDetail?.itemList?.filter(
        (item) => item.visitPeriod === 5,
      ) || []
    );
  }, [doctorScheduleDateDetail?.itemList]);

  const selectScheduleItem = useMemo(() => {
    return doctorScheduleDateDetail?.itemList?.filter(
      (item) => item.scheduleId === scheduleId,
    )[0];
  }, [doctorScheduleDateDetail?.itemList, scheduleId]);

  const handleNext = useCallback(async () => {
    if (!defaultPatientInfo?.patientName) {
      showToast({
        icon: 'none',
        title: '请先添加就诊人',
      }).then(() =>
        navigateTo({
          url: '/pages3/usercenter/add-user/index?patientType=0',
        }),
      );
      return;
    }
    const { code, data } = await useApi.锁号信息确认.request({
      deptId,
      doctorId,
      scheduleDate: date.format('YYYY-MM-DD'),
      scheduleId,
      visitBeginTime: selectScheduleItem?.visitBeginTime,
      visitEndTime: selectScheduleItem?.visitEndTime,
      visitPeriod: selectScheduleItem?.visitPeriod,
    });
    if (code === 0) {
      setConfirmInfo({ ...data, deptId, doctorId, scheduleId });
      navigateTo({
        url: `/pages3/usercenter/select-user/index?pageRoute=/pages3/register/confirm/index&jumpPage=${encodeURIComponent(
          `/pages3/register/select-time/index?deptId=${deptId}&doctorId=${doctorId}&scheduleDate=${scheduleDate}&doctorType=${doctorType}`,
        )}`,
      });
    }
  }, [
    defaultPatientInfo?.patientName,
    deptId,
    doctorId,
    date,
    scheduleId,
    selectScheduleItem?.visitBeginTime,
    selectScheduleItem?.visitEndTime,
    selectScheduleItem?.visitPeriod,
    setConfirmInfo,
    scheduleDate,
    doctorType,
  ]);

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
    <View className={styles.page}>
      <DoctorSkillCardOld
        deptName={doctorDetail?.deptName}
        doctorName={doctorDetail?.name}
        doctorTitle={doctorDetail?.level}
        doctorGood={'暂无'}
        doctorSkill={doctorDetail?.specialty || '暂无'}
        doctorSourceList={doctorScheduleList}
        doctorType={doctorType}
        current={date.format('YYYY-MM-DD')}
        onSelectDate={setDate}
        renderDot={renderDate}
        renderDisable={(day) => !renderCanChoose(day)}
      />
      <View className={styles.content}>
        {doctorScheduleDateDetail?.itemList.length === 0 && <NoDataOld />}
        {morningList?.length > 0 && (
          <Items
            items={morningList}
            title="选择上午时间段"
            onChange={setScheduleId}
            scheduleId={scheduleId}
          />
        )}
        {afternoonList?.length > 0 && (
          <Items
            items={afternoonList}
            title="选择下午时间段"
            onChange={setScheduleId}
            scheduleId={scheduleId}
          />
        )}
        {nightList?.length > 0 && (
          <Items
            items={nightList}
            title="选择晚上时间段"
            onChange={setScheduleId}
            scheduleId={scheduleId}
          />
        )}

        {dayList?.length > 0 && (
          <Items
            items={dayList}
            title="选择全天时间段"
            onChange={setScheduleId}
            scheduleId={scheduleId}
          />
        )}

        {duringList?.length > 0 && (
          <Items
            items={duringList}
            title="选择白天时间段"
            onChange={setScheduleId}
            scheduleId={scheduleId}
          />
        )}
        {doctorScheduleDateDetail?.itemList.length !== 0 && (
          <View className={styles.buttons}>
            <Button
              type="primary"
              elderly
              onTap={handleNext}
              disable={!scheduleId}
            >
              下一步
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};
