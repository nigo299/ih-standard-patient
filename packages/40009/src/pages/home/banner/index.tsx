import React from 'react';
import { Image } from 'remax/one';
import styles from './index.less';
import { Swiper, navigateToMiniProgram } from '@kqinfo/ui';

export default ({
  CommonImg,
}: {
  CommonImg: {
    imgUrl: string;
    jumpType: string;
    jumpUrl: string;
    appId: string;
  }[];
}) => {
  return (
    <Swiper
      interval={1000}
      indicatorDots
      autoplay
      // onChange={console.log}
      className={styles.banner2}
      items={Object.values(CommonImg).map((img) => ({
        node: (
          <Image
            src={img.imgUrl}
            className={styles.banner2}
            onTap={() => {
              if (img.jumpType === 'H5') {
                window.location.href = img.jumpUrl;
              } else if (img.jumpType === 'MINI_APP') {
                navigateToMiniProgram({
                  appId: img.appId,
                  path: img.jumpUrl,
                });
              } else {
                window.location.href = img.jumpUrl;
              }
            }}
          />
        ),
      }))}
    />
    // <Image
    //   className={styles.banner2}
    //   src={`${IMAGE_DOMIN}/home/banner2.png`}
    //   onTap={onTap}
    // />
  );
};
