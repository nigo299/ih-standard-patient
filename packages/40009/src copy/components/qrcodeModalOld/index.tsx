import React from 'react';
import { Text } from 'remax/one';
import { QrCode, BarCode, Space, Button } from '@kqinfo/ui';
import { Mask } from '@/components';
import styles from './index.less';

interface Props {
  show: boolean;
  name: '电子健康卡' | '电子就诊卡' | string;
  patCardNo: string;
  healthCardNo: string;
  isQRCode?: boolean;
  isBarCode?: boolean;
  close: () => void;
}

export default ({
  show,
  name,
  patCardNo,
  healthCardNo,
  isBarCode = true,
  isQRCode = true,
  close,
}: Props) => {
  return (
    <Mask show={show} close={close} center>
      <Space
        className={styles.content}
        vertical
        alignItems="center"
        onTap={(e) => e.stopPropagation()}
      >
        <Space justify="center" alignItems="center" className={styles.title}>
          {name}
        </Space>
        <Text className={styles.text}>请在就诊窗口出示此码</Text>
        {isBarCode && (
          <BarCode
            content={patCardNo}
            className={styles.barCode}
            width={480}
            height={360}
          />
        )}
        {isQRCode && (
          <QrCode content={healthCardNo} className={styles.qrcodeImg} />
        )}
        <Button
          type="primary"
          onTap={close}
          className={styles.button}
          block={false}
        >
          关闭
        </Button>
      </Space>
    </Mask>
  );
};
