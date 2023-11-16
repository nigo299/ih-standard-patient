import React, { useCallback } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space, showToast } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { Step, WhiteSpace } from '@/components';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import { DeptType } from '@/apis/register';
import regsiterState from '@/stores/register';
import styles from 'commonHis/src/pages2/register/select-hospital/index.less';
import useGetParams from '@/utils/useGetParams';
const healthDept = [
  '陈家桥儿科',
  '陈家桥产科',
  '陈家桥妇科',
  '陈家桥儿保科',
  '儿科',
  '产科',
  '妇科',
  '儿保科',
  '陈家桥体检科',
  '陈家桥入托体检科',
  '教师体检科',
  '入园体检科',
];
export default () => {
  const { type, summary, doctor } = useGetParams<{
    type: 'reserve' | 'day' | 'health';
    summary: string;
    doctor: string;
  }>();
  const { hospitalList, setDeptList } = regsiterState.useContainer();
  const handleSelect = useCallback(
    (dept: DeptType[]) => {
      if (type === 'health') {
        const arr: DeptType[] = [];
        dept.forEach((item) => {
          if (healthDept.includes(item.name)) arr.push(item);
        });

        setDeptList(arr);
      } else {
        setDeptList(dept);
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
          onTap={() => {
            if (PLATFORM === 'ali') {
              showToast({
                icon: 'none',
                title: '功能暂未开放!',
              });
            } else {
              window.location.href =
                'https://ask.cqkqinfo.com/online/user/#/pages/index/index?hisId=40026';
            }
          }}
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
