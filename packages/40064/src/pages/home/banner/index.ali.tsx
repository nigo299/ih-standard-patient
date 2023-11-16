/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Image, View } from 'remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import { Swiper, navigateToMiniProgram } from '@kqinfo/ui';
// import navigateToAlipayPage from '@/utils/navigateToAlipayPage';
import classnames from 'classnames';

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
  const [activeIndex, setActiveIndex] = useState<number>(0); // banner 默认选中的值
  return (
    <View className={styles.warp}>
      <Swiper
        className={styles.swiper}
        circular
        onChange={({ detail }) => {
          setActiveIndex(detail.current);
        }}
        interval={5000}
        indicatorDots={false}
        autoplay
        items={
          CommonImg.map((img) => ({
            node: (
              <Image
                src={img.imgUrl}
                className={styles.banner2}
                onTap={() => {
                  if (img.jumpType === 'MINI_APP') {
                    navigateToMiniProgram({
                      appId: img.appId,
                      path: img.jumpUrl,
                    });
                  }
                }}
              />
            ),
          }))
          // [
          //   // {
          //   //   node: (
          //   //     <Image
          //   //       className={styles.banner2}
          //   //       src={`${IMAGE_DOMIN}/home/banner3.png`}
          //   //       onTap={() =>
          //   //         navigateToAlipayPage({
          //   //           path: 'https://render.alipay.com/p/c/18rjl80fivi8',
          //   //         })
          //   //       }
          //   //     />
          //   //   ),
          //   // },
          //   {
          //     node: (
          //       <Image
          //         className={styles.banner2}
          //         src={`${IMAGE_DOMIN}/home/banner2.png`}
          //       />
          //     ),
          //   },
          // ]
        }
      />
      {/* <View className={styles.dotsWarp}>
        {[0, 1].map((_, index) => (
          <View
            key={`indicator-dots-item-${index}`}
            className={classnames(styles.dotsItem, {
              [styles.active]: activeIndex === index,
            })}
          />
        ))}
      </View> */}
    </View>
  );
};
