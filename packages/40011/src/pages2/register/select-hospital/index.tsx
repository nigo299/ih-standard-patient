import React, { useCallback } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space, showToast } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';
import { DeptType } from '@/apis/register';
import regsiterState from '@/stores/register';
import styles from '@/pages2/register/select-hospital/index.less';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { type, summary, doctor } = useGetParams<{
    type: 'reserve' | 'day';
    summary: string;
    doctor: string;
  }>();
  const { hospitalList, setDeptList } = regsiterState.useContainer();
  const handleSelect = useCallback(
    ({ children: dept, name }: { children: DeptType[]; name: string }) => {
      setDeptList(hospitalList?.[1]?.children || []);
      if (name === '彭水中医院新城院区') {
        navigateTo({
          url: `/pages2/register/department/index?type=${type}&hisType=1`,
        });
        return;
      } else if (name === '彭水中医院老院区') {
        navigateTo({
          url: `/pages2/register/department/index?type=${type}&hisType=2`,
        });
        return;
      }

      if (!!summary) {
        if (!!doctor) {
          navigateTo({
            url: `/pages/microsite/dept-summary/index?doctor=true`,
          });
          return;
        }
        navigateTo({
          url: `/pages/microsite/dept-summary/index`,
        });
        return;
      }
      navigateTo({
        url: `/pages2/register/department/index?type=${type}`,
      });
      return;
    },
    [doctor, setDeptList, summary, type],
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
        <View className={styles.itemWrap}>
          <Image
            src={`${IMAGE_DOMIN}/register/districtBg.png`}
            className={styles.bg}
          />
          <View
            className={styles.item}
            onTap={() => {
              navigateTo({
                url: `/pages2/register/department/index?type=${type}&hisType=1`,
              });
            }}
          >
            <View className={styles.name}>{'新院区'}</View>
            <View className={styles.address}>{`地址：${'暂无'}`}</View>
          </View>
        </View>
        <View className={styles.itemWrap}>
          <Image
            src={`${IMAGE_DOMIN}/register/districtBg.png`}
            className={styles.bg}
          />
          <View
            className={styles.item}
            onTap={() => {
              navigateTo({
                url: `/pages2/register/department/index?type=${type}&hisType=2`,
              });
            }}
          >
            <View className={styles.name}>{'老院区'}</View>
            <View className={styles.address}>{`地址：${'暂无'}`}</View>
          </View>
        </View>
      </View>
    </View>
  );
};
