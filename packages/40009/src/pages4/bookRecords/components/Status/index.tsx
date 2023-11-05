import React from 'react';
import { Space } from '@kqinfo/ui';
import cls from 'classnames';
import styles from './index.less';
export const StatusTxt: any = {
  WAIT_PAY: '待支付',
  WAIT_REVIEW: '待审核',
  WAIT_IMPROVE_INFO: '待补充资料',
  REVIEWED: '审核通过',
  WAIT_CANCEL_REVIEW: '取消待审核',
  CANCELED: '会诊取消',
  REJECT_REVIEW: '审核不通过',
  FINISH: '完成',
};
export default ({ status = 'WAIT_IMPROVE_INFO' }: { status: string }) => {
  const StatusCls: any = {
    WAIT_PAY: styles.wait,
    WAIT_REVIEW: styles.wait,
    WAIT_IMPROVE_INFO: styles.wait,
    REVIEWED: styles.success,
    WAIT_CANCEL_REVIEW: styles.cancel,
    CANCELED: styles.cancel,
    REJECT_REVIEW: styles.fail,
    FINISH: styles.success,
  };

  return (
    <Space className={cls(styles.StatusBox, StatusCls[status])}>
      {StatusTxt[status]}
    </Space>
  );
};
