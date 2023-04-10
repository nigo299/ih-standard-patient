import React from 'react';
import { View } from 'remax/one';
import classNames from 'classnames';
import { Space, PartTitle } from '@kqinfo/ui';
import { ScheduleType } from '@/apis/register';
import styles from './index.less';

export default ({
  items,
  onChange,
  scheduleId: selectId,
  title,
}: {
  items: ScheduleType[];
  title?: string;
  onChange?: (v: string) => void;
  scheduleId?: string;
}) => {
  return (
    <>
      <PartTitle full bold elderly>
        {title}
      </PartTitle>
      <Space
        flexWrap="wrap"
        justify="space-between"
        alignItems="flex-start"
        className={styles.items}
      >
        {items.map(
          ({ leftSource, scheduleId, visitBeginTime, visitEndTime }) => (
            <Space
              alignItems="center"
              justify="center"
              vertical
              key={scheduleId}
              onTap={() => {
                onChange?.(scheduleId);
              }}
              className={classNames(styles.item, {
                [styles.active]: scheduleId === selectId,
                [styles.disbaled]: Number(leftSource) === 0,
              })}
            >
              <View className={styles.text}>
                {visitBeginTime?.slice(0, 5)}-{visitEndTime?.slice(0, 5)}
              </View>
              <View className={styles.text2}>{`剩余：${leftSource}个号`}</View>
            </Space>
          ),
        )}
      </Space>
    </>
  );
};
