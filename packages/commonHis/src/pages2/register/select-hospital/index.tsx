import React, { useCallback } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space, showToast } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';
import { DeptType } from '@/apis/register';
import regsiterState from '@/stores/register';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { type } = useGetParams<{ type: 'reserve' | 'day' }>();
  const { hospitalList, setDeptList } = regsiterState.useContainer();
  const handleSelect = useCallback(
    (dept: DeptType[]) => {
      setDeptList(dept);
      navigateTo({
        url: `/pages2/register/department/index?type=${type}`,
      });
    },
    [setDeptList, type],
  );
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '选择院区',
    });
  });
  return (
    <View>
      <Step step={1} />
      <View className={styles.header} />
      <Space justify="center">
        <Image
          className={styles.banner}
          src={`${IMAGE_DOMIN}/register/banner.png`}
          onTap={() =>
            showToast({
              icon: 'none',
              title: '功能暂未开放!',
            })
          }
        />
      </Space>
      <WhiteSpace />
      <View className={styles.lists}>
        {hospitalList?.map((item, index) => (
          <View className={styles.itemWrap} key={index}>
            <Image
              src={`${IMAGE_DOMIN}/register/districtBg.png`}
              className={styles.bg}
            />
            <View
              key={item.id}
              className={styles.item}
              onTap={() => handleSelect(item.children)}
            >
              <View className={styles.name}>{item.name}</View>
              <View className={styles.address}>{`地址：${
                item.address || '暂无'
              }`}</View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};