import React, { useState } from 'react';
import { Shadow, Space, Fold, Icon, Rotate } from '@kqinfo/ui';
import styles from './index.less';
import classNames from 'classnames';
import dayjs from 'dayjs';

export default ({
  data = [],
  value = '1',
  onChange,
}: {
  data?: any[];
  value?: string;
  onChange?: (v?: string) => void;
}) => {
  const [run, setRun] = useState(false);
  return (
    <Shadow>
      <Space className={styles.fold} vertical>
        <Space
          alignItems="center"
          justify="space-between"
          onTap={() => setRun(!run)}
          className={styles.foldHead}
        >
          {data?.[0]?.timeDesc}
          <Space alignItems="center" className={styles.actiontxt} size={10}>
            {run ? '展开' : '收起'}
            <Rotate run={run} angle={180}>
              <Icon name={'kq-down'} size={20} color={'#666666'} />
            </Rotate>
          </Space>
        </Space>
        <Fold folded={run} className={styles.content}>
          {data.map((item) => {
            return (
              <Space
                className={classNames(styles.item, {
                  [styles.active]: item.id === value,
                  [styles.disabled]: item.leftResourceNum === 0,
                })}
                key={item.id}
                onTap={() => {
                  if (item.leftResourceNum === 0) {
                    return;
                  }
                  onChange?.(item.id);
                }}
              >
                {`${dayjs(item.startTime).format('HH:mm')}-${dayjs(
                  item.endTime,
                ).format('HH:mm')} 余 ${item.leftResourceNum}`}
              </Space>
            );
          })}
        </Fold>
      </Space>
    </Shadow>
  );
};
