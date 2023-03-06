import React from 'react';
import { Image } from 'remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import { showToast } from '@kqinfo/ui';

export default () => {
  return (
    <Image
      onTap={() =>
        showToast({
          icon: 'none',
          title: '网页端暂不支持音频播放!',
        })
      }
      src={`${IMAGE_DOMIN}/home/ear.png`}
      mode="aspectFit"
      className={styles.img}
    />
  );
};
