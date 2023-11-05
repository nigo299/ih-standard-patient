import React, { useState } from 'react';
import { View, Text } from 'remax/one';
import { Shadow, Space, Calendar } from '@kqinfo/ui';
import styles from './index.less';
import dayjs from 'dayjs';

export default ({
  data = [],
  value = dayjs().format('YYYY-MM-DD').toString(),
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
  console.log('data', data);
  return (
    <>
      <Shadow>
        <View className={styles.box}>
          <Space
            alignItems="center"
            justify="space-between"
            className={styles.head}
          >
            <Text className={styles.font1}>2023-10-25 星期三</Text>{' '}
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
            current={dayjs(value)}
            itemCls={styles.CalendarItem}
            activeItemCls={styles.active}
            dotWrapCls={styles.dotwarp}
            limit={limit}
            renderDate={(day) =>
              dayjs().isSame(day, 'date')
                ? '今天'
                : `${day.get('month') + 1}/${day.get('date')}`
            }
            renderDot={(day) => {
              const isflag = (data || []).find((i) => {
                return dayjs(i?.date).isSame(day, 'days');
              });
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
