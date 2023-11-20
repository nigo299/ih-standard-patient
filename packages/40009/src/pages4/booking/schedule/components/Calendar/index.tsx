import React, { useState } from 'react';
import { View, Text } from 'remax/one';
import { Shadow, Space, Calendar } from '@kqinfo/ui';
import styles from './index.less';
import dayjs from 'dayjs';

export default ({
  data = [],
  value = dayjs().format('YYYY-MM-DD').toString(),
  onChange,
}: {
  data?: any[];
  value?: string;
  onChange?: (value?: string) => void;
}) => {
  const [limit, setlimit] = useState(7);
  const States: any = {
    0: '约满',
    1: '有号',
  };
  const WEEKS: any[] = ['日', '一', '二', '三', '四', '五', '六'];
  return (
    <>
      <Shadow>
        <View className={styles.box}>
          <Space
            alignItems="center"
            justify="space-between"
            className={styles.head}
          >
            <Text className={styles.font1}>
              {dayjs(value).format('YYYY-MM-DD')} 星期
              {WEEKS[dayjs(value).day()]}
            </Text>{' '}
            <Text
              className={styles.font2}
              onTap={() => {
                const key = limit === 7 ? 14 : 7;
                setlimit(key);
              }}
            >
              {limit === 7 ? `更多日期 >` : '精简日期 >'}
            </Text>
          </Space>
          <Calendar
            onChange={(v: any) =>
              onChange?.(dayjs(v).format('YYYY-MM-DD').toString())
            }
            current={dayjs(value)}
            itemCls={styles.CalendarItem}
            activeItemCls={styles.active}
            dotWrapCls={styles.dotwarp}
            limit={limit}
            // renderDisable={(day) => {
            //   const isflag = (data || []).find((i) => {
            //     return dayjs(i?.date).isSame(day, 'days');
            //   });
            //   console.log('isflag', isflag);
            //   if (!isflag?.date) {
            //     return true;
            //   } else {
            //     return false;
            //   }
            // }}
            renderDate={(day) =>
              dayjs().isSame(day, 'date')
                ? '今天'
                : `${day.get('month') + 1}/${day.get('date')}`
            }
            renderDot={(day) => {
              const isflag = (data || []).find((i) => {
                return dayjs(i?.date).isSame(day, 'days');
              });
              if (dayjs().isSame(day, 'days')) {
                return <Text>{States[0]}</Text>;
              }
              if (isflag) {
                return <Text>{States[isflag?.state]}</Text>;
              }
            }}
          />
        </View>
      </Shadow>
    </>
  );
};
