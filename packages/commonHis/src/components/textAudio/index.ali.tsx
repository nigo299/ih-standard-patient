import React from 'react';
import { Image } from 'remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import { showToast } from '@kqinfo/ui';
import styles from './index.less';

export default () => {
  return (
    <Image
      onTap={() =>
        showToast({
          icon: 'none',
          title: '支付宝暂不支持音频播放!',
        })
      }
      src={`${IMAGE_DOMIN}/home/ear.png`}
      mode="aspectFit"
      className={styles.img}
    />
  );
};
