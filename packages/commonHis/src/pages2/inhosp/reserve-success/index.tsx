import React from 'react';
import { Image, navigateTo, View, redirectTo } from 'remax/one';
import styles from './index.less';
import { Button, Form, FormItem, Space } from '@kqinfo/ui';
// import useGetParams from '@/utils/useGetParams';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { name, dept, time, carNo, id } = useGetParams<{
    name: string;
    dept: string;
    time: string;
    carNo: string;
    id: string;
  }>();
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '住院预约',
    });
  });

  return (
    <View>
      <View className={styles.body}>
        <Space vertical alignItems={'center'} className={styles.top}>
          <Image
            className={styles.img}
            src={require('./success.png').default}
          />
          <View className={styles.title}>您已成功提交住院预约登记息</View>
        </Space>
        <Form labelWidth={'4em'} cell>
          <FormItem label={'就诊人'}>{name}</FormItem>
          <FormItem label={'就诊人卡号'}>{carNo}</FormItem>
          <FormItem label={'等床科室'}>{dept}</FormItem>
          <FormItem label={'预约入院日期'}>{time}</FormItem>
        </Form>
      </View>
      <View className={styles.btns}>
        <Button
          className={styles.check}
          type={'primary'}
          onTap={() =>
            navigateTo({
              url: `/pages2/inhosp/reserve-detail/index?id=${id}`,
            })
          }
        >
          查看记录
        </Button>
        <Button
          type={'primary'}
          ghost
          onTap={() => redirectTo({ url: '/pages/home/index' })}
        >
          回到首页
        </Button>
      </View>
    </View>
  );
};
