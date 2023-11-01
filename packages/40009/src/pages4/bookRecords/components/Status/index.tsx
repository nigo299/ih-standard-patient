import React from 'react';
import { Space } from '@kqinfo/ui';
import cls from 'classnames';
import styles from './index.less';
export default ({ status = '1' }: { status: string }) => {
  const StatusCls: any = {
    '1': styles.wait,
    '2': styles.success,
    '3': styles.fail,
    '4': styles.wait,
    '5': styles.cancel,
  };
  const StatusTxt: any = {
    '1': '待审核',
    '2': '审核通过',
    '3': '审核不通过',
    '4': '取消待审核',
    '5': '会诊取消',
  };
  return (
    <Space className={cls(styles.StatusBox, StatusCls[status])}>
      {StatusTxt[status]}
    </Space>
  );
};
