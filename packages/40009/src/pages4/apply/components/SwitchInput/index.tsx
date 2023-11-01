import React from 'react';
import { Space, ReTextarea, Switch } from '@kqinfo/ui';
import styles from './index.less';
export default ({
  value,
  onChange,
  placeholder = '请输入',
}: {
  disabled?: boolean;
  placeholder?: string;
  value?: {
    isfalg: boolean;
    text: string;
  };
  onChange?: (v?: { isfalg: boolean; text?: string }) => void;
}) => {
  console.log(value);
  return (
    <Space size={20} vertical className={styles.box}>
      <Switch
        className={styles.switch}
        value={value?.isfalg}
        onChange={(v) => {
          if (!v) {
            onChange?.({
              isfalg: false,
              text: '',
            });
          } else {
            onChange?.({
              isfalg: true,
              text: '',
            });
          }
        }}
      />
      {value?.isfalg && (
        <ReTextarea
          placeholder={placeholder}
          className={styles.textarea}
          onChange={(v?: string) => {
            onChange?.({
              isfalg: true,
              text: v,
            });
          }}
        />
      )}
    </Space>
  );
};
