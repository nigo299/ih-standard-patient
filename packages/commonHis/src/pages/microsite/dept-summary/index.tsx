import React, { useCallback } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, Icon, Search } from '@kqinfo/ui';
import { WhiteSpace } from '@/components';
import useApi from '@/apis/microsite';
import registerState from '@/stores/register';
import styles from './index.less';

export default () => {
  const { setDeptDetail } = registerState.useContainer();
  const {
    data: { data },
  } = useApi.获取科室列表({
    initValue: {
      data: {
        deptList: [],
      },
    },
    needInit: true,
  });
  const handleDeptClick = useCallback(
    async (deptId: string) => {
      const { data, code } = await useApi.获取科室详情.request({
        no: deptId,
      });
      if (code === 0) {
        setDeptDetail(data);
        navigateTo({
          url: '/pages2/register/dept-summary/index',
        });
      }
    },
    [setDeptDetail],
  );
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '科室介绍',
    });
  });
  return (
    <View className={styles.page}>
      <Search
        onConfirm={(val) => {
          navigateTo({
            url: `/pages2/register/search-doctor/index?q=${val}`,
          });
        }}
        placeholder={'输入科室名称进行搜索'}
        showBtn
        style={{ flex: 0 }}
      />
      {data?.deptList?.length >= 1 &&
        data?.deptList.map((dept) => (
          <Space
            justify="space-between"
            alignItems="center"
            key={dept.deptId}
            className={styles.list}
            onTap={() => handleDeptClick(dept.deptId)}
          >
            <View>{dept.deptName}</View>
            <Icon name={'kq-right'} color={'#ccc'} size={20} />
          </Space>
        ))}
      <WhiteSpace />
    </View>
  );
};
