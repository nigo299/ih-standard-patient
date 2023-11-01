import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, Text } from 'remax/one';
import {
  DropDownMenu,
  DropDownMenuItem,
  List,
  Shadow,
  Space,
  useTitle,
} from '@kqinfo/ui';
import styles from './index.less';
import useApi from '@/apis/register';
import { IMAGE_DOMIN } from '@/config/constant';
import Label from '@/components/label';
import Status from './components/Status';

export default () => {
  useTitle('预约记录');
  const [selectUser, setSelectUser] = useState('1');

  const options1 = useMemo(
    () => [
      {
        text: '全部',
        value: '1',
      },
      {
        text: '凯小桥',
        value: '2',
      },
    ],
    [],
  );
  const options2 = useMemo(
    () => [
      {
        text: '检查报告',
        value: '1',
      },
      {
        text: '检验报告',
        value: '2',
      },
    ],
    [],
  );
  const getDoctorList = useCallback((page, limit) => {
    return useApi.查询科室医生列表
      .request({
        deptId: '',
        pageNum: page,
        numPerPage: limit,
      })
      .then((data) => {
        return {
          list: [{ doctorId: 1 }] || data.data?.recordList,
          pageNum: data.data?.currentPage,
          pageSize: data?.data?.numPerPage,
          total: data?.data?.totalCount || 0,
        };
      });
  }, []);
  return (
    <View className={styles.page}>
      <DropDownMenu showModal={false}>
        <DropDownMenuItem
          title="就诊人"
          value={selectUser}
          onChange={setSelectUser}
          options={options1}
        />
        <DropDownMenuItem title="会诊状态" options={options2} />
      </DropDownMenu>
      <View className={styles.warp}>
        <List
          getList={getDoctorList}
          renderItem={(item: any) => {
            return (
              <Shadow key={item.doctorId}>
                <Space className={styles.item} alignItems="center" size={20}>
                  <Space className={styles.status}>
                    <Image
                      src={`${IMAGE_DOMIN}/mdt/status.png`}
                      className={styles.icon}
                    />
                    <Text className={styles.statusTxt}>患者端</Text>
                  </Space>
                  <Space vertical flex={1}>
                    <View className={styles.itemTitle}>伴随精神心理障碍</View>
                    <View className={styles.itemdesc}>乔木沐 女 5岁3月龄</View>
                    {[
                      { text: '患者ID', value: '1' },
                      { text: '申请时间', value: '1' },
                      { text: '会诊方式', value: '1' },
                    ].map((item, index) => (
                      <Space className={styles.itemdesc} key={index}>
                        <Label key={index}>{item.text}</Label>
                        <Space
                          flex={1}
                          flexWrap="wrap"
                          className={styles.value}
                        >
                          {item.value}
                        </Space>
                      </Space>
                    ))}
                  </Space>
                  <Status status="1" />
                </Space>
              </Shadow>
            );
          }}
        />
      </View>
    </View>
  );
};
