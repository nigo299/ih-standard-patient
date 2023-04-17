import React from 'react';
import { Image } from 'remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';

export default ({ onTap }: { onTap: () => void }) => {
  return (
    <Image
      className={styles.banner2}
      src={`${IMAGE_DOMIN}/home/banner2.png`}
      onTap={onTap}
    />
  );
};
