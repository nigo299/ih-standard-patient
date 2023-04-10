import React from 'react';
import { Icon, Tip } from '@kqinfo/ui';
import styles from './index.less';
import classNames from 'classnames';
import { PLATFORM } from '@/config/constant';

export default ({
  items,
  title = '温馨提示',
  className,
}: {
  title?: string;
  className?: string;
  items: React.ReactNode[];
}) => (
  <Tip
    title={title}
    padding={0}
    margin={0}
    icon={
      <Icon
        name="kq-tip"
        size={40}
        color="#FE9A78"
        className={classNames(styles.icon, {
          [styles.webIcon]: PLATFORM === 'web',
        })}
      />
    }
    className={classNames(styles.tip, className)}
    titleCls={classNames(styles.tipTitle, {
      [styles.webTipTitle]: PLATFORM === 'web',
    })}
    items={items}
  />
);
