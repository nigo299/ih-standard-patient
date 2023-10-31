import React from 'react';
import { Space, ReInput, Button } from '@kqinfo/ui';
import styles from './index.less';
export default ({
  value,
  onChange,
  placeholder = '请输入',
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v?: string) => void;
}) => {
  console.log(value);
  return (
    <Space size={20} className={styles.ipt}>
      <ReInput
        type="number"
        placeholder={placeholder}
        onChange={(v) => onChange?.(v)}
      />
      <Button
        type="primary"
        size="tiny"
        onTap={() => {
          //通过接口获取预留手机号
        }}
      >
        获取预留手机号
      </Button>
    </Space>
  );
};
