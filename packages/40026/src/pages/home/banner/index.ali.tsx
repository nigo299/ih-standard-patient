/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Image, View } from 'remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import { Swiper } from '@kqinfo/ui';
// import navigateToAlipayPage from '@/utils/navigateToAlipayPage';
import classnames from 'classnames';

export default ({ onTap }: { onTap: () => void }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0); // banner 默认选中的值
  return (
    <View className={styles.warp}>
      <Swiper
        className={styles.swiper}
        circular
        onChange={({ detail }) => {
          setActiveIndex(detail.current);
          console.log(detail.current);
        }}
        interval={5000}
        indicatorDots={false}
        autoplay
        items={[
          // {
          //   node: (
          //     <Image
          //       className={styles.banner2}
          //       src={`${IMAGE_DOMIN}/home/banner3.png`}
          //       onTap={() =>
          //         navigateToAlipayPage({
          //           path: 'https://render.alipay.com/p/c/18rjl80fivi8',
          //         })
          //       }
          //     />
          //   ),
          // },
          {
            node: (
              <Image
                className={styles.banner2}
                src={`${IMAGE_DOMIN}/home/banner2.png`}
                onTap={onTap}
              />
            ),
          },
        ]}
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
