import React, { useState } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { Search, Space, Menu, Exceed, showToast } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import { IMAGE_DOMIN } from '@/config/constant';
import regsiterState from '@/stores/register';
import styles from './index.less';
import { THEME_COLOR } from '@/config/constant';
import { TextAudio } from '@/components';
import classNames from 'classnames';

export default () => {
  const { deptList } = regsiterState.useContainer();
  const [inputVal, setInputVal] = useState('');
  const [selectDept, setSelectDept] = useState(deptList[0].no);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '选择科室',
    });
  });
  return (
    <View className={styles.page}>
      <Space className={styles.search} alignItems="center">
        <Search
          value={inputVal}
          onChange={(val) => val && setInputVal(val)}
          inputWrapStyle={{ background: '#fff' }}
          btnStyle={{
            background: '#fff',
            color: THEME_COLOR,
          }}
          onConfirm={(val) => {
            // showToast({
            //   icon: 'none',
            //   title: '功能暂未开放',
            // });
            // return;
            if (!val) {
              showToast({
                icon: 'none',
                title: '搜索内容不能为空',
              });
              return;
            }
            setInputVal('');
            navigateTo({
              url: `/pages3/search/index?q=${val}`,
            });
          }}
          elderly
          showBtn
          placeholder={'输入医生或者科室名字查询'}
        />
      </Space>
      <Menu
        leftItemCls={styles.leftItem}
        rightItemCls={styles.rightItem}
        rightCls={styles.right}
        className={styles.menu}
        data={deptList.map(({ name, children, no, img }) => ({
          name: (
            <Space
              vertical
              justify="center"
              alignItems="center"
              className={classNames(styles.deptLeft, {
                [styles.active]: no === selectDept,
              })}
            >
              <Image
                src={
                  img ||
                  `${IMAGE_DOMIN}/register/${
                    no === selectDept ? 'dept-active-old' : 'dept-old'
                  }.png`
                }
                mode="aspectFit"
                className={styles.deptImg}
              />

              <View className={styles.deptName}>{name}</View>
            </Space>
          ),
          id: no,
          children: children.map(({ name, no, summary }) => ({
            name: (
              <Space
                vertical
                flex="auto"
                className={styles.deptRight}
                justify="center"
              >
                <Space justify="space-between" alignItems="center">
                  <View className={styles.rightName}>{name}</View>
                  <View onTap={(e) => e.stopPropagation()}>
                    <TextAudio
                      size="small"
                      text={`科室简介: ${summary || '暂无'}`}
                      id={name}
                    />
                  </View>
                </Space>
                <Exceed className={styles.rightText}>
                  {`科室简介: ${summary || '暂无'}`}
                </Exceed>
              </Space>
            ),
            id: no,
          })),
        }))}
        onChange={(id, children) => {
          if (children.length === 0) {
            navigateTo({
              url: `/pages3/register/select-doctor/index?deptId=${id}`,
            });
          } else {
            setSelectDept(id as string);
          }
        }}
        onSelect={(dept) => {
          navigateTo({
            url: `/pages3/register/select-doctor/index?deptId=${dept.id}`,
          });
        }}
      />
    </View>
  );
};
