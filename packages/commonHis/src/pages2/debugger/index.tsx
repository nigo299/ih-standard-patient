import React from 'react';
import {
  Space,
  Form,
  FormItem,
  Button,
  PartTitle,
  showToast,
  showModal,
} from '@kqinfo/ui';
import { View } from 'remax/one';
import styles from './index.less';
import storage from '@/utils/storage';
import { reLaunchUrl } from '@/utils';

const PWD = 'kq123456';

export default () => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    if (values.pwd === PWD) {
      storage.set('debugger', 'true');
      showModal({
        title: '提示',
        content: '调试码设置成功',
        showCancel: false,
        confirmText: '我知道了',
      }).then((res) => {
        if (res.confirm) {
          reLaunchUrl('/pages/home/index');
        }
      });
    } else {
      showToast({
        title: '调试码错误',
        icon: 'none',
      });
    }
  };

  return (
    <View className={styles.wrap}>
      <Space alignItems={'stretch'} vertical size={30}>
        <PartTitle>即将进入调试模式</PartTitle>
        <Form form={form} onFinish={handleFinish} cell>
          <FormItem
            label={'调试码'}
            name={'pwd'}
            rules={[{ required: true }]}
          />
        </Form>
        <Space vertical size={30}>
          <Button type={'primary'} onTap={() => form.submit()}>
            提交
          </Button>
          <Button type={'primary'} onTap={() => storage.del('debugger')}>
            清空调试模式
          </Button>
          <Button type={'primary'} onTap={() => storage.clear()}>
            清空缓存
          </Button>
          <Button
            type={'primary'}
            onTap={() => reLaunchUrl('/pages/home/index')}
          >
            重启
          </Button>
        </Space>
      </Space>
    </View>
  );
};
