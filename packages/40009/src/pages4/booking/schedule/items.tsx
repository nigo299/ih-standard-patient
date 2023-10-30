import React, { useState } from 'react';
import { View, Image } from 'remax/one';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';
import classNames from 'classnames';
import { Shadow, Space, Rotate, Fold } from '@kqinfo/ui';
import { ScheduleType } from '@/apis/register';

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
  const [folded, setFolded] = useState(false);
  return (
    <Shadow>
      <View className={styles.items}>
        <View className={styles.header}>
          <View className={styles.part} />
          {title}
          <Space
            alignItems="center"
            justify="flex-end"
            className={styles.open}
            onTap={() => setFolded(!folded)}
          >
            {folded ? '展开' : '收起'}
            <Rotate angle={180} run={folded}>
              <Image
                src={`${IMAGE_DOMIN}/register/up.svg`}
                className={styles.up}
              />
            </Rotate>
          </Space>
        </View>
        <Fold folded={folded} className={styles.fold}>
          {items.map(
            ({ leftSource, scheduleId, visitBeginTime, visitEndTime }) => (
              <Space
                alignItems="center"
                justify="center"
                key={scheduleId}
                onTap={() => {
                  onChange?.(scheduleId);
                }}
                className={classNames(styles.item, {
                  [styles.scheduleOn]: scheduleId === selectId,
                  [styles.disbaled]: Number(leftSource) === 0,
                })}
              >
                {visitBeginTime?.slice(0, 5)}-{visitEndTime?.slice(0, 5)}
                {/* <View className={styles.type}>普通</View> {`余 : ${leftSource}`} */}
                <View className={styles.type}>{`余: ${leftSource}`}</View>
              </Space>
            ),
          )}
        </Fold>
      </View>
    </Shadow>
  );
};
