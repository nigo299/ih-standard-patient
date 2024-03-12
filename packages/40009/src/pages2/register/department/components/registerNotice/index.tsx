import React, { useEffect } from 'react';
import { View, Image } from 'remax/one';
import { Mask } from '@/components';
import { Button, RichText, Space } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import showTabBar from '@/utils/showTabBar';
import setPageStyle from '@/utils/setPageStyle';
import classNames from 'classnames';
import { useDownCount } from 'parsec-hooks';
import { useUpdateEffect } from 'ahooks';

interface Props {
  cancelBtn?: boolean;
  title?: string;
  show: boolean;
  confirm: () => void;
  close: () => void;
  content: string;
  confirmButtonStyle?: React.CSSProperties;
}

export default ({
  cancelBtn = true,
  title,
  show,
  confirm,
  close,
  content,
  confirmButtonStyle,
}: Props) => {
  const { countdown, setCountdown, clearCountdownTimer } = useDownCount();
  useEffect(() => {
    return () => {
      clearCountdownTimer();
    };
  }, [clearCountdownTimer]);
  useUpdateEffect(() => {
    setCountdown(0);
  }, [show]);
  return (
    <Mask
      show={show}
      close={() => {
        setPageStyle({
          overflow: 'inherit',
        });
        close();
        showTabBar();
      }}
    >
      <Space vertical alignItems="center" className={styles.notice}>
        <View className={styles.noticeTitle}>{title}</View>
        <View className={styles.noticeText}>
          <RichText nodes={content || ''} />
        </View>
        <Space
          className={styles.buttons}
          justify={cancelBtn ? 'space-between' : 'center'} // 如果有取消按钮，则按钮之间左右分布，否则居中
          alignItems="center"
        >
          {cancelBtn && (
            <Button
              className={styles.cancelBtn}
              onTap={() => {
                setPageStyle({
                  overflow: 'inherit',
                });
                close();
                showTabBar();
              }}
            >
              取消
            </Button>
          )}
          <Button
            type={'primary'}
            className={classNames(styles.confirmBtn, {
              [styles.confirmBtnDisabled]: countdown > 0,
            })}
            disabled={countdown > 0}
            style={confirmButtonStyle}
            onTap={() => {
              confirm();
              setPageStyle({
                overflow: 'inherit',
              });
              close();
              showTabBar();
            }}
          >
            同意{countdown > 0 && `(${countdown}s)`}
          </Button>
        </Space>
        <Image
          src={`${IMAGE_DOMIN}/home/ghfwxz.png`}
          className={styles.noticeImg}
        />
      </Space>
    </Mask>
  );
};
