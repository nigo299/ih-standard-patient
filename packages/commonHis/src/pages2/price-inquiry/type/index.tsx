import React, { useMemo } from 'react';
import { navigateTo, View, Image } from 'remax/one';
import styles from './index.less';
import { PriceType } from '../utils';
import { useTitle } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';

export default () => {
  const searchList = useMemo(
    () => [
      {
        title: '药品查询',
        subTitle: '查询药品信息',
        image: `${IMAGE_DOMIN}/price-inquiry/drug.png`,
        type: PriceType.drug,
      },
      {
        title: '项目查询',
        subTitle: '查询项目信息',
        image: `${IMAGE_DOMIN}/price-inquiry/item.png`,
        type: PriceType.item,
      },
      {
        title: '手术查询',
        subTitle: '查询手术价格信息',
        image: `${IMAGE_DOMIN}/price-inquiry/surgery.png`,
        type: PriceType.surgery,
      },
    ],
    [],
  );

  const handleToSearch = ({ type }: { type: PriceType }) => {
    navigateTo({
      url: `/pages2/price-inquiry/search/index?type=${type}`,
    });
  };

  useTitle('物价查询');

  return (
    <View className={styles.wrap}>
      {searchList.map((i) => (
        <View
          className={styles.item}
          key={i.title}
          onTap={() => handleToSearch(i)}
        >
          <Image src={i.image} className={styles.img} />
          <View>
            <View className={styles.title}>{i.title}</View>
            <View className={styles.subTitle}>{i.subTitle}</View>
          </View>
        </View>
      ))}
    </View>
  );
};
