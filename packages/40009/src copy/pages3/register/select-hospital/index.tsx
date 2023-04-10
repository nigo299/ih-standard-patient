import React, { useCallback, useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Space, Button } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { DeptType } from '@/apis/register';
import regsiterState from '@/stores/register';
import styles from './index.less';
import classNames from 'classnames';

export default () => {
  const { hospitalList, setDeptList } = regsiterState.useContainer();
  const [selectDept, setSelectDept] = useState(0);
  const handleSelect = useCallback(
    (dept: DeptType[], index) => {
      setSelectDept(index);
      setDeptList(dept);
    },
    [setDeptList],
  );
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '选择院区',
    });
  });
  return (
    <View className={styles.page}>
      <View className={styles.lists}>
        {hospitalList?.map((item, index) => (
          <Space
            className={classNames(styles.itemWrap, {
              [styles.active]: index === selectDept,
            })}
            key={index}
            vertical
            justify="center"
            alignItems="center"
            size={26}
            onTap={() => handleSelect(item.children, index)}
          >
            <View className={styles.name}>{item.name}</View>
            <View className={styles.address}>{item.address || '暂无地址'}</View>
          </Space>
        ))}
      </View>
      <Button
        type="primary"
        ghost
        onTap={() =>
          navigateTo({
            url: '/pages3/register/department/index',
          })
        }
      >
        下一步
      </Button>
    </View>
  );
};
