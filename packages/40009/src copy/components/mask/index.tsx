import React from 'react';
import { Space } from '@kqinfo/ui';
import styles from './index.less';
import classNames from 'classnames';
import { sleep } from '@/utils';
import { useLockFn } from 'ahooks';

interface Props {
  show: boolean;
  /** 是否垂直居中 */
  center?: boolean;
  /** 点击背景是否可以关闭 */
  maskClosable?: boolean;
  /**
   * 动画方向
   * @default bottom
   */
  direction?: 'left' | 'top' | 'right' | 'bottom';
  close: () => void;
  children: React.ReactNode;
  mask?: boolean;
}

export default ({
  show,
  center,
  maskClosable = true,
  close,
  direction = 'bottom',
  children,
  mask,
}: Props) => {
  return (
    <Space
      className={classNames(styles.show, {
        [styles.mask]: show,
        [styles.noBackground]: mask,
      })}
      alignItems={center ? 'center' : 'normal'}
      justify={center ? 'center' : 'normal'}
      vertical={center ? true : false}
      onTap={useLockFn(async (e) => {
        e.stopPropagation();
        await sleep(100);
        maskClosable && close();
      })}
    >
      <Space
        onTap={(e) => e.stopPropagation()}
        className={classNames(styles[direction], styles.content, {
          [styles.contentFooter]: !center,
        })}
      >
        {children}
      </Space>
    </Space>
  );
};
