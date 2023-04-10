import React from 'react';
import { View } from 'remax/one';
import { Space, Button } from '@kqinfo/ui';
import classNames from 'classnames';
import styles from './index.less';

interface DialogProps {
  /** 是否显示 */
  show?: boolean;
  hideFail?: boolean;
  className?: string;
  /** 正文内容 */
  children: React.ReactNode;
  /** 标题 */
  title?: string;
  failText?: string;
  successText?: string;
  onFail?: () => void;
  onSuccess?: () => void;
}

const Dialog = (props: DialogProps) => {
  const {
    show,
    className,
    children,
    title,
    failText = '不同意',
    successText = '同意',
    onFail,
    onSuccess,
    hideFail = false,
  } = props;

  if (!show) {
    return null;
  }
  return (
    <Space justify="center" alignItems="center" className={styles.mask}>
      <Space
        className={classNames(styles.wrap, className)}
        vertical
        justify="center"
        alignItems="center"
      >
        {title && <View className={styles.title}>{title}</View>}
        {children}
        <View className={styles.btns}>
          {!hideFail && (
            <Button onTap={onFail} ghost className={styles.btn}>
              {failText}
            </Button>
          )}
          <Button
            onTap={onSuccess}
            ghost
            type={'primary'}
            className={styles.btn}
          >
            {successText}
          </Button>
        </View>
      </Space>
    </Space>
  );
};

export default Dialog;
