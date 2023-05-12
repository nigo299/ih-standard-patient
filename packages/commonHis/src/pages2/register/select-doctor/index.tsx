import React, { useState, useMemo } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import { IMAGE_DOMIN, HOSPITAL_NAME, STEP_ITEMS } from '@/config/constant';
import { DeptInfo, Calendar } from '@/pages2/register/components';
import { NoData, Space, Loading, Radio } from '@kqinfo/ui';
import dayjs from 'dayjs';
import useGetParams from '@/utils/useGetParams';
import { useEffectState } from 'parsec-hooks';
import useApi from '@/apis/register';
import useMicrositeApi from '@/apis/microsite';
import registerState from '@/stores/register';
import { useUpdateEffect } from 'ahooks';
import styles from './index.less';
import { useHisConfig } from '@/hooks';
import ShowPrice from '@/pages2/register/select-doctor/components/show-price';
import ShowSource from '@/pages2/register/select-doctor/components/show-source';
import ShowDocTags from '@/pages2/register/select-doctor/components/show-doc-tags';
enum DoctorType {
  all = '仅展示有号',
  normal = '急诊号',
  expert = '专科号',
  night = '普通号',
}

export default () => {
  const { config } = useHisConfig();

  const { setDeptDetail } = registerState.useContainer();
  const { deptId, type = 'default' } = useGetParams<{
    deptId: string;
    type: 'reserve' | 'day' | 'default';
  }>();
  const {
    request: requestScheduleList,
    loading,
    data: { data: originScheduleList },
  } = useApi.查询科室排班日期({
    initValue: {
      data: [],
    },
    params: {
      deptId,
    },
    needInit: !!deptId,
  });

  /** 当日挂号的时候不选择日期的号源 */
  const scheduleList = useMemo(() => {
    if (type === 'day') {
      return originScheduleList?.filter(
        (i) => i.scheduleDate === dayjs().format('YYYY-MM-DD'),
      );
    }
    return originScheduleList;
  }, [originScheduleList, type]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [doctorType, setDoctorType] = useState<DoctorType>(DoctorType.all);
  const [date, setDate] = useEffectState(
    useMemo(() => {
      let newDate;
      if (type === 'reserve' && !config.showTodayRegisterSourceInReserve) {
        newDate =
          scheduleList?.find(
            ({ scheduleDate, status }) =>
              scheduleDate !== dayjs().format('YYYY-MM-DD') && status === 1,
          )?.scheduleDate || scheduleList?.[1]?.scheduleDate;
      } else if (type === 'day' || config.showTodayRegisterSourceInReserve) {
        newDate = dayjs().format('YYYY-MM-DD');
      } else {
        newDate = scheduleList?.find(
          ({ status }) => status === 1,
        )?.scheduleDate;
      }
      return dayjs(newDate);
    }, [config, scheduleList, type]),
  );

  const {
    request: requestDoctorList,
    loading: loading2,
    data: { data: doctorList },
  } = useApi.查询科室医生号源({
    initValue: {
      data: [],
    },
    params: {
      scheduleDate: date.format('YYYY-MM-DD'),
      deptId,
    },
    needInit: !!deptId && !!date,
  });

  const {
    data: { data: deptDetail },
  } = useMicrositeApi.获取科室详情({
    params: {
      no: deptId,
    },
    needInit: !!deptId,
  });
  const newDoctorList = useMemo(() => {
    if (doctorList && config.showFullDoc) {
      return doctorList.sort((prev, next) =>
        prev?.leftSource === 0 ? 1 : next?.leftSource === 0 ? -1 : 0,
      );
    }
    if (doctorType === '仅展示有号') {
      return (
        doctorList && doctorList?.filter((doctor) => doctor.leftSource > 0)
      );
    } else {
      return (
        doctorList &&
        doctorList?.filter((doctor) =>
          doctorType?.includes(doctor.doctorSessType),
        )
      );
    }
  }, [doctorType, doctorList]);
  const renderDate = (day: dayjs.Dayjs) => {
    const canSelect =
      scheduleList &&
      scheduleList?.some(({ scheduleDate }) => day.isSame(scheduleDate));
    const isFull =
      scheduleList &&
      scheduleList?.some(
        ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 2,
      );
    let canSelectAndHasSource;

    if (type === 'reserve') {
      canSelectAndHasSource = scheduleList?.some(({ scheduleDate, status }) => {
        if (config.showTodayRegisterSourceInReserve) {
          return day.isSame(scheduleDate) && status === 1;
        }
        return (
          scheduleDate !== dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1
        );
      });
    } else if (type === 'day') {
      canSelectAndHasSource = scheduleList?.some(
        ({ scheduleDate, status }) =>
          scheduleDate === dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1,
      );
    } else {
      canSelectAndHasSource = scheduleList?.some(
        ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 1,
      );
    }
    const nowActive = day.isSame(date);
    if (canSelectAndHasSource) {
      return (
        <View
          className={styles.hasSource}
          style={{ color: nowActive ? '#f371a9' : '#333', fontWeight: 400 }}
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
      return scheduleList?.some(({ scheduleDate, status }) => {
        if (config.showTodayRegisterSourceInReserve) {
          return day.isSame(scheduleDate) && status === 1;
        }
        return (
          scheduleDate !== dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1
        );
      });
    } else if (type === 'day') {
      return scheduleList?.some(
        ({ scheduleDate, status }) =>
          scheduleDate === dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1,
      );
    } else {
      return scheduleList?.some(
        ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 1,
      );
    }
  };

  useUpdateEffect(() => {
    if (deptDetail?.name) {
      setDeptDetail(deptDetail);
    }
  }, [deptDetail]);

  usePageEvent('onShow', () => {
    /** 优化小程序跳转授权返回后不自动请求接口 */
    if (deptId) {
      requestScheduleList();
      requestDoctorList();
    }
    setNavigationBar({
      title: '选择医生',
    });
  });
  return (
    <View>
      <Step step={STEP_ITEMS.findIndex((i) => i === '选择医生') + 1} />
      {(loading || loading2) && <Loading type="top" />}
      <View className={styles.content}>
        <DeptInfo
          deptImg={deptDetail?.img || `${IMAGE_DOMIN}/register/dept.png`}
          hospitalName={HOSPITAL_NAME || '暂无'}
          deptName={deptDetail?.name || '暂无'}
          tag={deptDetail?.hisDistrict || '本院'}
          summary={`简介: ${deptDetail?.summary || '暂无'}`}
          onDetailTap={() =>
            navigateTo({
              url: `/pages2/register/dept-summary/index?deptId=${deptId}`,
            })
          }
        />
        <WhiteSpace />
        <Calendar
          renderDot={renderDate}
          renderDisable={(day: dayjs.Dayjs) => !renderCanChoose(day)}
          current={date}
          limit={config.regCalendarNumberOfDays}
          showDoctor
          deptId={deptId}
          onChange={(
            day:
              | dayjs.Dayjs
              | [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined],
          ) => {
            if (!Array.isArray(day)) {
              setDate(day);
            }
          }}
          type={type}
        />
        <WhiteSpace />
        {config.showRegSourceTypes && (
          <Space className={styles.radiosWrap} flexWrap="nowrap">
            <Radio.Group
              value={doctorType}
              className={styles.radios}
              onChange={(v) => setDoctorType(v as DoctorType)}
            >
              {[
                { value: '仅展示有号', label: '仅展示有号' },
                { value: '专家号', label: '专家号' },
                { value: '普通号', label: '普通号' },
                { value: '义诊号', label: '义诊号' },
              ].map((item: any) => (
                <Radio
                  className={styles.radio}
                  value={item.value}
                  backgroundColor={'#fff'}
                  color={'#C1C1C1'}
                  type="button"
                  key={item.value}
                >
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          </Space>
        )}
        {scheduleList?.find(
          (item) => item?.scheduleDate === date?.format('YYYY-MM-DD'),
        )?.status === 1 ? (
          newDoctorList?.length >= 1 &&
          newDoctorList?.map((item) => {
            if (config.registerDoctorTagType === 'ORIGINAL_AND_CURRENT_PRICE') {
              return (
                <ShowPrice
                  data={{ item, date, deptId, type }}
                  key={item.doctorId}
                />
              );
            }
            if (config.registerDoctorTagType === 'SOURCE_AND_PRICE') {
              return (
                <ShowSource
                  data={{ item, date, deptId, type }}
                  key={item.doctorId}
                />
              );
            }
            if (config.registerDoctorTagType === 'SHOW_DOC_TAGS') {
              return (
                <ShowDocTags
                  data={{ item, date, deptId, type }}
                  key={item.doctorId}
                />
              );
            }
          })
        ) : (
          <NoData />
        )}
      </View>
    </View>
  );
};
