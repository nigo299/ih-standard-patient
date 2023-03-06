import React, { useState, useMemo } from 'react';
import { View, navigateTo, Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { DeptSkillCardOld, NoDataOld } from '@/components';
import { IMAGE_DOMIN, THEME_COLOR } from '@/config/constant';
import { Space, Button, showToast } from '@kqinfo/ui';
import dayjs from 'dayjs';
import useGetParams from '@/utils/useGetParams';
import { useEffectState } from 'parsec-hooks';
import useApi from '@/apis/register';
import useMicrositeApi from '@/apis/microsite';
import registerState from '@/stores/register';
import { useUpdateEffect } from 'ahooks';
import styles from './index.less';
import classNames from 'classnames';

enum DoctorType {
  all = 0,
  normal = 1,
  expert = 2,
  night = 3,
}

const doctorTypeArr = [
  { value: 0, label: '全部' },
  { value: 1, label: '专家' },
  { value: 2, label: '普通' },
  { value: 3, label: '特需' },
];

export default () => {
  const { setDeptDetail } = registerState.useContainer();
  const { deptId } = useGetParams<{ deptId: string }>();
  const {
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
  const [doctorType, setDoctorType] = useState<DoctorType>(DoctorType.all);
  const [date, setDate] = useEffectState(
    useMemo(
      () =>
        scheduleList
          ? dayjs(
              scheduleList?.find(({ status }) => status === 1)?.scheduleDate,
            )
          : dayjs(),
      [scheduleList],
    ),
  );

  const {
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
    if (doctorType === 0) {
      return doctorList && doctorList.filter((doctor) => doctor.leftSource > 0);
    } else {
      return (
        doctorList &&
        doctorList.filter((doctor) => doctor.doctorSessTypeCode === doctorType)
      );
    }
  }, [doctorType, doctorList]);
  const renderDate = (day: dayjs.Dayjs) => {
    // const canSelect = scheduleList && scheduleList.some(({ scheduleDate }) =>
    //   day.isSame(scheduleDate),
    // );
    const canSelectAndHasSource =
      scheduleList &&
      scheduleList.some(
        ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 1,
      );
    const isFull =
      scheduleList &&
      scheduleList.some(
        ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 2,
      );
    const nowActive = day.isSame(date);
    if (canSelectAndHasSource) {
      return (
        <View style={{ color: nowActive ? '#fff' : THEME_COLOR }}>有号</View>
      );
    } else if (isFull) {
      return <View style={{ color: '#D95E38' }}>满诊</View>;
    } else {
      return <View style={{ color: '#999' }}>暂无</View>;
    }
  };
  const renderCanChoose = (day: dayjs.Dayjs) =>
    scheduleList &&
    scheduleList.some(
      ({ scheduleDate, status }) => day.isSame(scheduleDate) && status === 1,
    );

  useUpdateEffect(() => {
    if (deptDetail?.name) {
      setDeptDetail(deptDetail);
    }
  }, [deptDetail]);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '选择医生',
    });
  });
  return (
    <View className={styles.page}>
      <DeptSkillCardOld
        deptAddress={deptDetail?.address || '暂无'}
        deptSummary={deptDetail?.summary || '暂无'}
        deptImg={deptDetail?.img}
        deptName={deptDetail?.name || ''}
        deptSourceList={scheduleList}
        current={date.format('YYYY-MM-DD')}
        onSelectDate={setDate}
        renderDot={renderDate}
        renderDisable={(day) => !renderCanChoose(day)}
      />
      <View className={styles.content}>
        <Space
          className={styles.tabs}
          justify="space-between"
          alignItems="center"
        >
          {doctorTypeArr.map((tab) => (
            <Space
              key={tab.value}
              flex="auto"
              justify="center"
              className={classNames(styles.tab, {
                [styles.activeType]: doctorType === tab.value,
              })}
              onTap={() => setDoctorType(tab.value)}
            >
              {tab.label}
              {/* {doctorType === tab.value && (
                <Image
                  src={`${IMAGE_DOMIN}/register/tab-active-old.png`}
                  mode="aspectFit"
                  className={styles.tabImg}
                />
              )} */}
            </Space>
          ))}
        </Space>

        {newDoctorList?.length >= 1 ? (
          newDoctorList.map((item, index) => {
            const {
              leftSource,
              doctorImg,
              name,
              deptName,
              registerFee,
              doctorSkill,
              doctorSessTypeCode,
              title,
            } = item;
            return (
              <Space
                vertical
                justify="space-between"
                className={styles.card}
                key={index}
              >
                <Space justify="space-between" alignItems="flex-start">
                  <Space
                    className={styles.avatar}
                    justify="center"
                    alignItems="flex-end"
                  >
                    <Image
                      src={doctorImg || `${IMAGE_DOMIN}/search/doctor-old.png`}
                      className={styles.avatarImg}
                      mode="aspectFit"
                    />
                  </Space>
                  <Space flex="auto" vertical justify="flex-start">
                    <Space
                      justify="space-between"
                      flex="auto"
                      alignItems="center"
                    >
                      <View className={styles.doctorName}>
                        {name}|{title}
                      </View>
                      <View className={styles.registerFee}>
                        ¥{(registerFee / 100).toFixed(2)}
                      </View>
                    </Space>
                    <View className={styles.deptName}>{deptName}</View>
                    <View className={styles.skill}>
                      擅长:{' '}
                      <Text className={styles.text}>
                        {doctorSkill || '暂无'}
                      </Text>
                    </View>
                  </Space>
                </Space>
                <View className={styles.solid} />
                <Space justify="space-between" alignItems="center">
                  <View
                    className={classNames(styles.status, {
                      [styles.status1]: item.status === 1,
                      [styles.status2]: item.status === 2,
                    })}
                  >
                    {item.status === 0 && '停诊'}
                    {item.status === 1 && `余号: ${leftSource}`}
                    {item.status === 2 && '约满'}
                  </View>
                  <Button
                    type="primary"
                    elderly
                    block={false}
                    className={styles.button}
                    onTap={() => {
                      if (item.leftSource > 0) {
                        navigateTo({
                          url: `/pages3/register/select-time/index?deptId=${deptId}&doctorId=${
                            item.doctorId
                          }&scheduleDate=${date.format(
                            'YYYY-MM-DD',
                          )}&doctorType=${doctorSessTypeCode}`,
                        });
                      } else {
                        showToast({
                          icon: 'none',
                          title: '当前医生暂无号源!',
                        });
                      }
                    }}
                  >
                    点击预约
                  </Button>
                </Space>
                {doctorSessTypeCode && (
                  <Space className={styles.tag}>
                    {doctorSessTypeCode === 1 && (
                      <Image
                        src={`${IMAGE_DOMIN}/register/zjh-old.png`}
                        mode="aspectFit"
                        className={styles.tagImg}
                      />
                    )}
                    {doctorSessTypeCode === 2 && (
                      <Image
                        src={`${IMAGE_DOMIN}/register/pth-old.png`}
                        mode="aspectFit"
                        className={styles.tagImg}
                      />
                    )}
                    {doctorSessTypeCode === 3 && (
                      <Image
                        src={`${IMAGE_DOMIN}/register/txh-old.png`}
                        mode="aspectFit"
                        className={styles.tagImg}
                      />
                    )}
                  </Space>
                )}
              </Space>
            );
          })
        ) : (
          <NoDataOld />
        )}
      </View>
    </View>
  );
};
