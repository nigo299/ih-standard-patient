import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'remax/one';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/price-inquiry';
import { formatListResult, formatPrice, PriceType } from '../utils';
import { List, ReInput, useTitle } from '@kqinfo/ui';

export default () => {
  const { type } = useGetParams<{ type: PriceType }>();
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const cacheKey = useMemo(() => `${type}${Math.random()}`, [type]);

  const getDrugList = useCallback(
    (page: number, limit: number) => {
      return useApi.药品查询
        .request({ pageNo: page, pageNumber: limit, name })
        .then((r) => {
          console.log(r.data.items, 'r.data.items');
          return formatListResult(r);
        });
    },
    [name],
  );

  const getItemList = useCallback(
    (page: number, limit: number) => {
      return useApi.项目查询
        .request({ pageNo: page, pageNumber: limit, name })
        .then(formatListResult);
    },
    [name],
  );

  const getSurgeryList = useCallback(
    (page: number, limit: number) => {
      return useApi.手术查询
        .request({ pageNo: page, pageNumber: limit, name })
        .then(formatListResult);
    },
    [name],
  );

  const title = useMemo(() => {
    if (type === PriceType.drug) {
      return '药品查询';
    }
    if (type === PriceType.surgery) {
      return '手术查询';
    }
    return '项目查询';
  }, [type]);

  useTitle(title);

  return (
    <View className={styles.wrap}>
      <View className={styles.searchWrap}>
        <ReInput
          className={styles.input}
          onChange={setSearch as (v?: string) => void}
          value={search}
          placeholder="请输入项目名称搜索"
        />
        <View className={styles.search} onTap={() => setName(search)}>
          搜索
        </View>
      </View>
      <View className={styles.listWrap}>
        {type === PriceType.drug && (
          <List
            cacheKey={cacheKey}
            getList={getDrugList}
            renderItem={(item) => (
              <View className={styles.drugItem} key={item.itemCode}>
                <View className={styles.infoWrap}>
                  <View className={styles.name}>名称：{item.itemName}</View>
                  <View className={styles.right}>{item.siLevel}</View>
                </View>
                <View className={styles.infoWrap}>
                  <View className={styles.left}>规格：{item.itemSpec}</View>
                  <View className={styles.right}>
                    价格: {formatPrice(item.itemPrice)}
                  </View>
                </View>
              </View>
            )}
          />
        )}
        {type === PriceType.item && (
          <List
            cacheKey={cacheKey}
            getList={getItemList}
            renderItem={(item) => (
              <View className={styles.drugItem} key={item.itemCode}>
                <View className={styles.infoWrap}>
                  <View className={styles.name}>名称：{item.itemName}</View>
                  <View className={styles.right}>{item.siLevel}</View>
                </View>
                <View className={styles.infoWrap}>
                  <View className={styles.left}>单位：{item.itemSpec}</View>
                  <View className={styles.right}>
                    价格: {formatPrice(item.itemPrice)}
                  </View>
                </View>
              </View>
            )}
          />
        )}
        {type === PriceType.surgery && (
          <List
            cacheKey={cacheKey}
            getList={getSurgeryList}
            renderItem={(item) => (
              <View className={styles.drugItem} key={item.itemCode}>
                <View className={styles.infoWrap}>
                  <View className={styles.name}>名称：{item.itemName}</View>
                  <View className={styles.right}>{item.siLevel}</View>
                </View>
                <View className={styles.infoWrap}>
                  <View className={styles.left}>单位：{item.itemSpec}</View>
                  <View className={styles.right}>
                    价格: {formatPrice(item.itemPrice)}
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};
