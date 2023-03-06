import React from 'react';
import { View, Text } from 'remax/one';
import { WxOpenLaunchWeapp, Tip, Mask } from '@/components';
import { Button, Space, QrCode } from '@kqinfo/ui';
import { NUCLEIC_HID } from '@/config/constant';
import styles from './index.less';

interface Props {
  show: boolean;
  nucleicJumpParams: string;
  close: () => void;
}

export default ({ show, nucleicJumpParams, close }: Props) => {
  return (
    <Mask center show={show} close={close}>
      <Space vertical justify="center" className={styles.nucleicCard}>
        <Tip
          items={[
            <View key={'nucleic'} className={styles.tipText}>
              遵照有关部门疫情防控要求，需要您填写一份流行病调查登记，感谢您的配合！
            </View>,
          ]}
        />
        <Space vertical alignItems="center">
          <QrCode
            content={`https://tihs.cqkqinfo.com/kaiqiao/admin/hsdj?hid=${NUCLEIC_HID}${nucleicJumpParams}`}
            className={styles.nucleicImg}
          />
          <Text className={styles.nucleicText}>
            请长按二维码识别/点击按钮跳转
          </Text>
          <Space
            justify="space-between"
            alignItems="center"
            className={styles.nucleicBtns}
          >
            <Button
              type="primary"
              ghost
              className={styles.nucleicBtn}
              onTap={close}
            >
              关闭
            </Button>
            <Button type="primary" className={styles.nucleicBtn2}>
              立即跳转
              <WxOpenLaunchWeapp
                username="gh_0788cd5d9f59"
                path={`pages/qrhs/index?hid=${NUCLEIC_HID}${nucleicJumpParams}`}
              />
            </Button>
          </Space>
        </Space>
      </Space>
    </Mask>
  );
};
