import React, { ReactNode } from 'react';
import { FormItem, Exceed, Space } from '@kqinfo/ui';
import styles from './index.less';
import classNames from 'classnames';

import { useHisConfig } from '@/hooks';

export default ({
  label,
  text,
  elderly,
}: {
  label?: string;
  text?: string | ReactNode;
  elderly?: boolean;
}) => {
  return (
    <Space
      justify="flex-start"
      alignItems="center"
      className={classNames(styles.item, {
        [styles.elderly]: elderly,
      })}
    >
      <FormItem
        label={label}
        className={styles.title}
        labelCls={styles.title}
        colon
        labelWidth={'4em'}
      />
      <Space style={{ flexWrap: 'wrap', width: '100%' }}>
        <Exceed className={classNames(styles.text)}>{text || '暂无'}</Exceed>
      </Space>
    </Space>
  );
};
