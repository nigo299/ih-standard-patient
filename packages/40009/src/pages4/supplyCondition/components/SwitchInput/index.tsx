import React from 'react';
import { Space, ReTextarea, Switch } from '@kqinfo/ui';
import { Text } from 'remax/one';
import styles from './index.less';
export default ({
  value,
  onChange,
  placeholder = '请输入',
  maxLength = 500,
}: {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (v?: string) => void;
  maxLength?: number;
}) => {
  return (
    <Space size={20} vertical className={styles.box}>
      <Switch
        className={styles.switch}
        value={!!value && value.length > 0}
        onChange={(v) => {
          if (!v) {
            onChange?.('');
          } else {
            onChange?.(' ');
          }
        }}
      />
      {!!value && value.length > 0 && (
        <Text className={styles.count}>
          {value.length}/{maxLength}
        </Text>
      )}
      {!!value && value.length > 0 && (
        <ReTextarea
          placeholder={placeholder}
          className={styles.textarea}
          onChange={(v?: string) => {
            onChange?.(v);
          }}
          maxLength={maxLength}
        />
      )}
    </Space>
  );
};
