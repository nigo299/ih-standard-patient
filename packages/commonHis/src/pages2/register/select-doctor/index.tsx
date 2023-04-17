import React, { useState, useMemo } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace, PreviewImage } from '@/components';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import { DeptInfo, Calendar } from '../components';
import {
  NoData,
  Shadow,
  Exceed,
  Space,
  showToast,
  Loading,
  Radio,
} from '@kqinfo/ui';
import dayjs from 'dayjs';
import useGetParams from '@/utils/useGetParams';
import { useEffectState } from 'parsec-hooks';
import useApi from '@/apis/register';
import useMicrositeApi from '@/apis/microsite';
import registerState from '@/stores/register';
import { useUpdateEffect } from 'ahooks';
import styles from './index.less';
import classNames from 'classnames';
import { useHisConfig } from '@/hooks';
import ShowPrice from './components/ShowPrice';
import ShowSource from './components/ShowSource';
enum DoctorType {
  all = '仅展示有号',
  normal = '急诊号',
  expert = '专科号',
  night = '普通号',
}

export default () => {
  const { showPrice } = useHisConfig();
  console.log(showPrice);

  const { setDeptDetail } = registerState.useContainer();
  const { deptId, type = 'default' } = useGetParams<{
    deptId: string;
    type: 'reserve' | 'day' | 'default';
  }>();
  const {
    request: requestScheduleList,
    loading,
    data: { data: scheduleList },
  } = useApi.查询科室排班日期({
    initValue: {
      data: [],
    },
    params: {
      deptId,
    },
    needInit: !!deptId,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [doctorType, setDoctorType] = useState<DoctorType>(DoctorType.all);
  const [date, setDate] = useEffectState(
    useMemo(() => {
      let newDate;
      if (type === 'reserve') {
        newDate =
          scheduleList?.find(
            ({ scheduleDate, status }) =>
              scheduleDate !== dayjs().format('YYYY-MM-DD') && status === 1,
          )?.scheduleDate || scheduleList?.[1]?.scheduleDate;
      } else if (type === 'day') {
        newDate = dayjs().format('YYYY-MM-DD');
      } else {
        newDate = scheduleList?.find(
          ({ status }) => status === 1,
        )?.scheduleDate;
      }
      return dayjs(newDate);
    }, [scheduleList, type]),
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
      canSelectAndHasSource = scheduleList?.some(
        ({ scheduleDate, status }) =>
          scheduleDate !== dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1,
      );
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
      return scheduleList?.some(
        ({ scheduleDate, status }) =>
          scheduleDate !== dayjs().format('YYYY-MM-DD') &&
          day.isSame(scheduleDate) &&
          status === 1,
      );
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
      <Step step={3} />
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
          limit={14}
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
        {scheduleList?.find(
          (item) => item?.scheduleDate === date?.format('YYYY-MM-DD'),
        )?.status === 1 ? (
          newDoctorList?.length >= 1 &&
          newDoctorList?.map((item, index) => {
            const {
              leftSource,
              image,
              name,
              deptName,
              registerFee,
              doctorSkill,
              title = '',
              level = '',
              sourceType = '',
              extFields = { doctorInitialRegFee: '0' },
            } = item;
            return (
              <Shadow key={index}>
                <View
                  className={styles.doctor}
                  onTap={() => {
                    if (item.leftSource > 0) {
                      navigateTo({
                        url: `/pages2/register/select-time/index?deptId=${deptId}&doctorId=${
                          item.doctorId
                        }&scheduleDate=${date.format(
                          'YYYY-MM-DD',
                        )}&doctorName=${name}&sourceType=${sourceType}&type=${type}&level=${level}&title=${title}`,
                      });
                    } else {
                      showToast({
                        icon: 'none',
                        title: '当前医生暂无号源!',
                      });
                    }
                  }}
                >
                  <PreviewImage
                    url={
                      (image !== 'null' && image) ||
                      `${IMAGE_DOMIN}/register/doctor.png`
                    }
                    className={styles.photo}
                  />
                  <View className={styles.doctorInfo}>
                    <View style={{ display: 'flex' }}>
                      <View className={styles.left}>
                        <View className={styles.name}>{name}</View>
                      </View>
                      {!!showPrice ? (
                        <ShowPrice
                          leftSource={leftSource}
                          extFields={extFields}
                          registerFee={registerFee}
                        />
                      ) : (
                        <ShowSource
                          leftSource={leftSource}
                          item={item}
                          registerFee={registerFee}
                        />
                      )}
                    </View>
                    <View className={styles.subtitle}>
                      {`${deptName} | ${title || ''}`}
                    </View>
                    <Exceed clamp={1} className={styles.doctorText}>
                      {`擅长: ${
                        doctorSkill && doctorSkill !== 'null'
                          ? doctorSkill
                          : '暂无'
                      }`}
                    </Exceed>
                  </View>
                </View>
              </Shadow>
            );
          })
        ) : (
          <NoData />
        )}
      </View>
    </View>
  );
};
