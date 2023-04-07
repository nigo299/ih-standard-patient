import React, { useState } from 'react';
import { View, navigateBack, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Button,
  TransferChange,
  ReInput,
  Picker,
  getAddressOptions,
  Form,
  FormItem,
  PartTitle,
  showToast,
} from '@kqinfo/ui';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/usercenter';
import { IMAGE_DOMIN } from '@/config/constant';
import { CascadePickerOption } from 'antd-mobile/es/components/cascade-picker/cascade-picker';
import { useHisConfig } from '@/hooks';

export default () => {
  const { patientId, patientAddress = '' } = useGetParams<{
    patientId: string;
    patientAddress: string;
  }>();
  const [addressOptions, setAddressOptions] = useState<CascadePickerOption[]>(
    [],
  );
  const { config } = useHisConfig();
  const [form] = Form.useForm();
  usePageEvent('onShow', () => {
    getAddressOptions().then((options) => setAddressOptions(options));
    form.setFieldsValue({
      patientAddress,
    });
    setNavigationBar({
      title: '修改地址',
    });
  });
  return (
    <View className={styles.page}>
      <PartTitle bold>修改地址</PartTitle>
      <View className={styles.content}>
        <Form
          form={form}
          cell
          labelWidth="4em"
          requiredMark={false}
          className={styles.label}
          childrenCls={styles.children}
          childrenAlign={'left'}
          onFinish={(values: any) =>
            useApi.修改就诊人详情
              .request({
                patientId,
                patientAddress: values['patientAddress'],
              })
              .then((res) => {
                if (res.code === 0) {
                  showToast({
                    icon: 'success',
                    title: '修改成功!',
                  }).then(() => navigateBack());
                }
              })
          }
        >
          <FormItem
            label={'地址'}
            name={'birthPlace'}
            initialValue={config.defaultAddress}
            rules={[{ required: true }]}
            after={
              <Image
                src={`${IMAGE_DOMIN}/usercenter/down.png`}
                className={styles.icon}
              />
            }
          >
            <TransferChange mode={'city'}>
              <Picker cols={3} data={addressOptions}>
                请选择省市区
              </Picker>
            </TransferChange>
          </FormItem>
          <FormItem
            // label={'详细地址'}
            name={'patientAddress'}
            childrenAlign="left"
            rules={[
              {
                required: true,
                message: '详细地址是必填的',
              },
            ]}
          >
            <ReInput
              placeholder="请输入详细地址"
              placeholderClassName={styles.placeholder}
              className={styles.reInput}
              adjustPosition
            />
          </FormItem>
        </Form>
        <Button
          type="primary"
          bold
          className={styles.button}
          onTap={form.submit}
        >
          提交
        </Button>
      </View>
    </View>
  );
};
