import React, { useMemo, useRef } from 'react';
import { Image, View } from 'remax/one';
import {
  Space,
  Exceed,
  Button,
  Sheet,
  PartTitle,
  Calendar,
  ColorText,
  showToast,
} from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { ScheduleWeekType } from '@/apis/register';
import styles from './index.less';
import { SheetInstance } from '@kqinfo/ui/es/sheet';
import classNames from 'classnames';
import dayjs from 'dayjs';

export interface IProps {
  deptImg?: string;
  deptName: string;
  deptAddress: string;
  deptSummary: string;
  deptSourceList: ScheduleWeekType[];
  /** 当前选中的日期 */
  current: string;
  onSelectDate: (day: dayjs.Dayjs) => void;
  /**
   * 渲染标记点，返回false不显示，可以返回一个元素可以自定义显示
   */
  renderDot?: (day: dayjs.Dayjs, index: number) => React.ReactNode | boolean;
  /**
   * 渲染禁止的日期
   * @default day => day.isBefore(dayjs(), 'date')
   */
  renderDisable?: (day: dayjs.Dayjs) => boolean;
}

export default ({
  deptName,
  deptAddress,
  deptImg,
  deptSummary,
  deptSourceList,
  current,
  onSelectDate,
  renderDisable,
  renderDot,
}: IProps) => {
  const sheetRef = useRef<SheetInstance>(null);
  const sheetRef2 = useRef<SheetInstance>(null);
  const deptSourceListView = useMemo(() => {
    const Index = deptSourceList.findIndex(
      (item) => item.scheduleDate === current,
    );
    const prevArr = deptSourceList.slice(Index);
    const nextArr = deptSourceList.slice(0, Index);
    return [...prevArr, ...nextArr];
  }, [current, deptSourceList]);
  return (
    <Space vertical className={styles.card}>
      <Sheet ref={sheetRef}>
        <Space vertical className={styles.sheet}>
          <Space
            justify="space-between"
            alignItems="center"
            className={styles.sheetHead}
          >
            <View className={styles.sheetTitle}>科室介绍</View>
            <Button
              block={false}
              type="primary"
              elderly
              className={styles.sheetBtn}
              onTap={() => {
                sheetRef.current?.setVisible(false);
              }}
            >
              关闭
            </Button>
          </Space>
          <PartTitle elderly full bold>
            科室位置
          </PartTitle>
          <View className={styles.sheetText}>{deptAddress}</View>
          <PartTitle elderly full bold>
            科室介绍
          </PartTitle>
          <View className={styles.sheetText}>{`简介: ${deptSummary}`}</View>
        </Space>
      </Sheet>

      <Sheet ref={sheetRef2}>
        <Space vertical className={styles.sheet2}>
          <Space
            justify={'space-between'}
            alignItems={'center'}
            className={styles.sheet2Head}
          >
            <ColorText fontWeight="bold" fontSize="46">
              日期选择
            </ColorText>
            <Button
              type={'primary'}
              className={styles.sheetBtn}
              block={false}
              elderly
              onTap={() => {
                sheetRef2.current?.setVisible(false);
              }}
            >
              关闭
            </Button>
          </Space>
          <Calendar
            elderly
            style={{ flex: 1, overflow: 'auto' }}
            listEndDay={dayjs().add(8, 'month')}
            renderDot={renderDot}
            renderDisable={renderDisable}
            onChange={(day) => {
              if (!Array.isArray(day)) {
                onSelectDate(day);
              }
            }}
            current={dayjs(current)}
          />
        </Space>
      </Sheet>
      <Space className={styles.head}>
        <Space className={styles.imgs} justify="center" alignItems="center">
          <Image
            src={deptImg || `${IMAGE_DOMIN}/register/dept-active-old.png`}
            mode="aspectFit"
            className={styles.img}
          />
        </Space>
        <Space vertical justify="center" className={styles.headRight}>
          <View className={styles.deptName}>{deptName}</View>
          <Exceed
            className={styles.deptSkill}
          >{`科室简介: ${deptSummary}`}</Exceed>
        </Space>
        <Space
          className={styles.tag}
          justify="center"
          alignItems="center"
          onTap={() => {
            sheetRef.current?.setVisible(true);
          }}
        >
          详情
        </Space>
      </Space>
      <Space
        justify="space-between"
        alignItems="center"
        className={styles.date}
      >
        <View className={styles.dateText}>{`${dayjs(current).year()}年${
          dayjs(current).month() + 1
        }月${dayjs(current).date()}日`}</View>
        <View
          className={styles.dateText2}
          onTap={() => {
            sheetRef2.current?.setVisible(true);
          }}
        >{`更多日期>`}</View>
      </Space>
      <Space justify="space-between" alignItems="center">
        {deptSourceListView.length >= 1 &&
          deptSourceListView.slice(0, 4).map((dept, index) => (
            <Space
              key={index}
              vertical
              justify="center"
              alignItems="center"
              className={classNames(styles.item, {
                [styles.active]: current === dept.scheduleDate,
              })}
              onTap={() => {
                if (dept.status !== 1) {
                  showToast({
                    icon: 'none',
                    title: '当前日期暂无号源!',
                  });
                  return;
                }

                onSelectDate(dayjs(dept.scheduleDate));
              }}
            >
              <View className={styles.weekData}>{`周${dept.weekDate}`}</View>
              <View className={styles.scheduleDate}>{`${
                dayjs(dept.scheduleDate).month() + 1
              }月${dayjs(dept.scheduleDate).date()}`}</View>
              <View
                className={classNames(styles.status, {
                  [styles.status1]: dept.status === 1,
                  [styles.status2]: dept.status === 2,
                })}
              >
                {dept.status === 0 && '无号'}
                {dept.status === 1 && '有号'}
              </View>
            </Space>
          ))}
      </Space>
    </Space>
  );
};
