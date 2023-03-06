import React from 'react';
import { QrCode, Space, Button } from '@kqinfo/ui';
import { Mask } from '@/components';
import styles from './index.less';

interface Props {
  show: boolean;
  content: string;
  name: string;
  type?: 'patCardNo' | 'health';
  close: () => void;
}

export default ({ show, name, content, close, type = 'patCardNo' }: Props) => {
  return (
    <Mask show={show} close={close} center>
      <Space
        className={styles.qrcodeModal}
        alignItems="center"
        justify="center"
        onTap={close}
      >
        <Space
          className={styles.content}
          vertical
          alignItems="center"
          justify="center"
          onTap={(e) => e.stopPropagation()}
        >
          <Space> {type === 'patCardNo' ? name : '电子健康卡'}</Space>
          <QrCode content={content} className={styles.qrcodeImg} />
          <Button type="primary" onTap={close} className={styles.button} ghost>
            关闭
          </Button>
        </Space>
      </Space>
    </Mask>
  );
};
