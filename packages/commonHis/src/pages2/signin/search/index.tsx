import React from 'react';
import { View, navigateTo } from 'remax/one';
import { Button, Form, FormItem, ReInput } from '@kqinfo/ui';
import styles from './index.less';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';

export default () => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      // const res = await useApi.签到列表查询.request(v);
      // hideLoading();
      // if (res.data?.length) {
      //   hashHistory.push({
      //     pathname: '/sign-in/list',
      //     query: v,
      //   });
      //   return;
      // }

      navigateTo({
        url: '/pages2/signin/list/index',
      });
    } catch (err) {
      console.log(err);
    }
  };
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '查询就诊人',
    });
  });
  return (
    <View className={styles.wrap}>
      <View className={styles.forms}>
        <Form form={form} cell onFinish={handleSubmit} labelWidth={'4em'}>
          <FormItem
            label={'姓名'}
            name={'patientName'}
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <ReInput placeholder={'请输入就诊人姓名（必填）'} />
          </FormItem>
          <FormItem
            label={'就诊卡号'}
            name={'patientId'}
            rules={[{ required: true, message: '请输入00开头的ID号' }]}
          >
            <ReInput placeholder={'请输入00开头的ID号'} />
          </FormItem>
        </Form>
      </View>
      <Button
        type={'primary'}
        onTap={() => {
          form.submit();
        }}
      >
        提交
      </Button>
    </View>
  );
};
