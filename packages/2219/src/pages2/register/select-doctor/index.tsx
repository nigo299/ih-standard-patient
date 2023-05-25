import React, { useState, useMemo, useEffect } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import { IMAGE_DOMIN, HOSPITAL_NAME, STEP_ITEMS } from '@/config/constant';
import { DeptInfo, Calendar } from '@/pages2/register/components';
import { NoData, Space, Loading, Radio, RichText } from '@kqinfo/ui';
import dayjs from 'dayjs';
import useGetParams from '@/utils/useGetParams';
import { useEffectState } from 'parsec-hooks';
import useApi from '@/apis/register';
import useMicrositeApi from '@/apis/microsite';
import registerState from '@/stores/register';
import { useUpdateEffect } from 'ahooks';
import useComApi from '@/apis/common';
import styles from './index.less';
import { useHisConfig } from '@/hooks';
import ShowPrice from '@/pages2/register/select-doctor/components/show-price';
import ShowSource from '@/pages2/register/select-doctor/components/show-source';
import ShowDocTags from '@/pages2/register/select-doctor/components/show-doc-tags';
import Dialog from '@/components/dialog';
enum DoctorType {
  all = '仅展示有号',
  normal = '急诊号',
  expert = '专科号',
  night = '普通号',
}
const specilDepts = ['30312001', '30312002', '30312003'];

export default () => {
  const { config } = useHisConfig();
  const [visible, setVisible] = useState(false);
  const { setDeptDetail } = registerState.useContainer();
  const { deptId, type = 'default' } = useGetParams<{
    deptId: string;
    type: 'reserve' | 'day' | 'default';
  }>();
  const {
    data: { data: infoData },
  } = useComApi.注意事项内容查询({
    params: {
      noticeType: 'SYTS',
      noticeMethod: 'TC',
    },
  });
  const {
    request: requestScheduleList,
    loading,
    data: { data: originScheduleList },
  } = useApi.查询科室排班日期({
    initValue: {
      data: [],
    },
    params: {
      deptId: specilDepts.includes(deptId) ? '30312' : deptId,
      extFields: specilDepts.includes(deptId)
        ? { inputData: deptId?.slice(-1) }
        : null,
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
        if (config.showFullSourceDay) {
          newDate = scheduleList?.find(
            ({ status }) => status === 1 || status === 2,
          )?.scheduleDate;
        } else {
          newDate = scheduleList?.find(
            ({ status }) => status === 1,
          )?.scheduleDate;
        }
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
      deptId: specilDepts.includes(deptId) ? '30312' : deptId,
      extFields: specilDepts.includes(deptId)
        ? { inputData: deptId?.slice(-1) }
        : null,
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
  const realDeptDetail = useMemo(() => {
    if (deptId === '30312001') {
      return {
        name: '儿童牙病',
        hisDistrict: '冉家坝院区',
        summary:
          '诊疗范围：儿童牙体龋病、非龋病疾病、牙髓病、根尖周疾病，儿童口腔舒适治疗。',
      };
    }
    if (deptId === '30312002') {
      return {
        name: '儿童早期矫治',
        hisDistrict: '冉家坝院区',
        summary:
          '诊疗范围：儿童各类错颌畸形的早期矫治（如牙列拥挤，反合，上牙前突，阻生牙等）；儿童口腔不良习惯的阻断治疗（如口呼吸，咬唇，吐舌等）。',
      };
    }
    if (deptId === '30312003') {
      return {
        name: '儿童牙外伤',
        hisDistrict: '冉家坝院区',
        summary: '诊疗范围：儿童乳牙和年轻恒牙外伤。',
      };
    }
    return deptDetail;
  }, [deptDetail, deptId]);
  const newDoctorList = useMemo(() => {
    if (doctorList && config.showFullDoc) {
      return doctorList;
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
  }, [doctorList, config.showFullDoc, doctorType]);
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
  useEffect(() => {
    if (deptId === '30312001') {
      console.log('1233');

      setDeptDetail({
        name: '儿童牙病',
        hisDistrict: '冉家坝院区',
        summary:
          '诊疗范围：儿童牙体龋病、非龋病疾病、牙髓病、根尖周疾病，儿童口腔舒适治疗。',
      });
    }
    if (deptId === '30312002') {
      setDeptDetail({
        name: '儿童早期矫治',
        hisDistrict: '冉家坝院区',
        summary:
          '诊疗范围：儿童各类错颌畸形的早期矫治（如牙列拥挤，反合，上牙前突，阻生牙等）；儿童口腔不良习惯的阻断治疗（如口呼吸，咬唇，吐舌等）。',
      });
    }
    if (deptId === '30312003') {
      setDeptDetail({
        name: '儿童牙外伤',
        hisDistrict: '冉家坝院区',
        summary: '诊疗范围：儿童乳牙和年轻恒牙外伤。',
      });
    }
  }, [deptId, setDeptDetail]);
  usePageEvent('onShow', () => {
    /** 优化小程序跳转授权返回后不自动请求接口 */
    if (deptId) {
      requestScheduleList();
      requestDoctorList();
    }
    setVisible(true);
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
          deptImg={realDeptDetail?.img || `${IMAGE_DOMIN}/register/dept.png`}
          hospitalName={HOSPITAL_NAME || '暂无'}
          deptName={realDeptDetail?.name || '暂无'}
          tag={realDeptDetail?.hisDistrict || '本院'}
          summary={`简介: ${realDeptDetail?.summary || '暂无'}`}
          onDetailTap={() =>
            navigateTo({
              url: `/pages2/register/dept-summary/index?deptId=${deptId}`,
            })
          }
        />
        <WhiteSpace />
        <Calendar
          renderDot={renderDate}
          renderDisable={
            config.showFullSourceDay
              ? undefined
              : (day: dayjs.Dayjs) => !renderCanChoose(day)
          }
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
        ) ? (
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
      <Dialog
        hideFail
        show={visible}
        title={'温馨提示'}
        successText={'我已知晓'}
        onSuccess={() => setVisible(false)}
      >
        <Space style={{ lineHeight: 1.2, padding: 20 }}>
          <RichText nodes={infoData?.[0]?.noticeInfo || ''} />
        </Space>
      </Dialog>
    </View>
  );
};
