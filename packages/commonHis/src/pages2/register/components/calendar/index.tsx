import React, { useMemo } from 'react';
import { View, navigateTo } from 'remax/one';
import { Calendar, Tab, NoticeBar, Shadow } from '@kqinfo/ui';
import { Props } from '@kqinfo/ui/lib/calendar';
import styles from './index.less';
import { THEME_COLOR2 } from '@/config/constant';
import { useHisConfig } from '@/hooks';
import dayjs, { Dayjs } from 'dayjs';
const weeks = ['日', '一', '二', '三', '四', '五', '六'];

export default ({
  setType,
  showDoctor,
  current,
  deptId,
  type,
  isHealth,
  oneDeptNo,
  ...props
}: Props & {
  current: Dayjs;
  setType?: (type: number | string) => void;
  showDoctor?: boolean;
  deptId: string;
  type: 'reserve' | 'day' | 'default';
  isHealth?: string;
  oneDeptNo?: string;
}) => {
  const { config } = useHisConfig();

  const showTab = useMemo(() => {
    if (type === 'day') {
      return config.showSelectTypeInTodayRegister;
    }
    return true;
  }, [config, type]);

  const showCalender = useMemo(() => {
    if (type === 'day') {
      return config.showCalenderInTodayRegister;
    }
    return true;
  }, [config, type]);

  return (
    <Shadow>
      <View className={styles.wrap}>
        {config.showRegisterNoticeScrollText && (
          <NoticeBar
            className={styles.notice}
            color={THEME_COLOR2}
            background={
              'linear-gradient(90deg, rgba(255,151,67,0.2), rgba(255,151,67,0.01))'
            }
          >
            {config.registerNoticeText}
          </NoticeBar>
        )}
        <View className={styles.filter}>
          <View>
            {current?.format('YYYY-MM-DD')} 星期
            {current && weeks[current.get('day')]}
          </View>
          {showTab && (
            <Tab
              control
              current={1}
              className={styles.tab}
              onChange={setType}
              tabs={[
                {
                  content: <View className={styles.tabItem}>按日期挂号</View>,
                  index: 1,
                },
                {
                  content: (
                    <View
                      onTap={() => {
                        navigateTo({
                          url: `/pages2/register/choose-doctor/index?deptId=${deptId}&scheduleDate=${current?.format(
                            'YYYY-MM-DD',
                          )}&type=${type}&isHealth=${isHealth}&oneDeptNo=${oneDeptNo}`,
                        });
                      }}
                      className={styles.tabItem2}
                    >
                      按医生挂号
                    </View>
                  ),
                  index: 2,
                },
              ].slice(0, showDoctor ? 2 : 1)}
            />
          )}
        </View>
        {showCalender && (
          <Calendar
            activeItemCls={styles.activeItemCls}
            dotWrapCls={styles.dots}
            disableItemCls={styles.calenderDisable}
            itemCls={styles.calenderItem}
            current={current}
            weekOffset={dayjs().day() % 7}
            {...props}
          />
        )}
      </View>
    </Shadow>
  );
};
