import React, { useState } from 'react';
import { Shadow, Space, Fold, Icon, Rotate } from '@kqinfo/ui';
import styles from './index.less';
import classNames from 'classnames';

export default ({
  data = [
    {
      id: '1',
      name: '8:00-9:00',
      left: 1,
    },
    {
      id: '2',
      name: '8:00-9:00',
      left: 1,
    },
    {
      id: '3',
      name: '8:00-9:00',
      left: 1,
    },
    {
      id: '4',
      name: '8:00-9:00',
      left: 0,
    },
  ],
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
          选择号源
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
                  [styles.disabled]: item.left === 0,
                })}
                key={item.id}
                onTap={() => {
                  if (item.left === 0) {
                    return;
                  }
                  onChange?.(item.id);
                }}
              >
                {`${item.name} 余 ${item.left}`}
              </Space>
            );
          })}
        </Fold>
      </Space>
    </Shadow>
  );
};
