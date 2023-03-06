import React, { useCallback } from 'react';
import { usePageEvent } from 'remax/macro';
import { Image, Text } from 'remax/one';
import { Space, Button } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import setNavigationBar from '@/utils/setNavigationBar';
import styles from './index.less';

export default () => {
  const handleFaceVerify = useCallback(() => {
    // 1.检测设备是否支持人脸识别
  }, []);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '开始人脸识别',
    });
  });

  return (
    <Space vertical className={styles.page}>
      <Text className={styles.title}>请衣着整齐，平视屏幕，并正对光源</Text>
      <Image
        src={`${IMAGE_DOMIN}/usercenter/rlsb-old.png`}
        mode="aspectFit"
        className={styles.img}
      />
      <Text className={styles.text}>拍摄须知</Text>
      <Space
        justify="space-between"
        alignItems="center"
        flex="auto"
        className={styles.content}
      >
        <Image
          src={`${IMAGE_DOMIN}/usercenter/zdqjk-old.png`}
          mode="aspectFit"
          className={styles.img2}
        />
        <Image
          src={`${IMAGE_DOMIN}/usercenter/bzdlb-old.png`}
          mode="aspectFit"
          className={styles.img2}
        />
        <Image
          src={`${IMAGE_DOMIN}/usercenter/ldsz-old.png`}
          mode="aspectFit"
          className={styles.img2}
        />
      </Space>
      <Button type="primary" elderly onTap={handleFaceVerify}>
        点击开始人脸验证
      </Button>
    </Space>
  );
};
