import React from 'react';
import { View, Image, Text } from 'remax/one';
import styles from './index.less';
import {
  Button,
  Form,
  FormItem,
  PartTitle,
  ReInput,
  ReTextarea,
  Shadow,
  Space,
  UploadImg,
  showToast,
} from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import Label from '@/components/label';
import SwitchInput from './components/SwitchInput';
import TelPhone from './components/TelPhone';
export default () => {
  const [form] = Form.useForm();
  return (
    <View className={styles.page}>
      <Space className={styles.banner} size={20}>
        <Image src={`${IMAGE_DOMIN}/mdt/tel.png`} className={styles.tel} />
        <Space flex={1} vertical size={20} className={styles.content}>
          <View className={styles.contentdesc}>电话咨询</View>
          <View className={styles.contentdesc}>
            预约前、如有疑问，可拨打以下电话咨询：
          </View>
          <Space justify="space-between">
            <Text>023-45964325</Text>
            <Text>023-45964325</Text>
          </Space>
        </Space>
      </Space>
      <View className={styles.warp}>
        <Shadow>
          <Space className={styles.pane1} vertical size={20}>
            <View className={styles.paneHead}>
              <Text className={styles.bold}>乔木衫</Text>女 5岁3月龄
            </View>
            <Space className={styles.paneItem}>
              <Label>患者ID</Label>
              <Text className={styles.value}>123456789</Text>
            </Space>
          </Space>
        </Shadow>
        <Shadow>
          <View className={styles.pane}>
            <Space className={styles.paneHead}>
              <PartTitle full>申请信息</PartTitle>
            </Space>
            <View className={styles.status}>会诊方式：线下会诊</View>
            <View className={styles.paneBody}>
              <Form
                form={form}
                onFinish={console.log}
                vertical
                labelCls={styles.Formlabel}
                requiredMarkCls={styles.requiredMark}
              >
                <FormItem
                  label={'会诊团队'}
                  name={'city'}
                  rules={[{ required: true }]}
                  readOnly
                >
                  <ReInput placeholder="会诊团队" className={styles.ipt} />
                </FormItem>
                <FormItem
                  label={'会诊时间'}
                  name={'city'}
                  rules={[{ required: true }]}
                  readOnly
                >
                  <ReInput placeholder="会诊时间" className={styles.ipt} />
                </FormItem>
                <FormItem
                  label={'症状描述'}
                  name={'name'}
                  rules={[{ required: true }]}
                >
                  <ReTextarea
                    placeholder={'请输入'}
                    className={styles.textarea}
                    maxLength={100}
                  />
                </FormItem>
                <FormItem
                  label={'过敏史'}
                  name={'idCard'}
                  rules={[{ type: 'idCard', required: true }]}
                >
                  <SwitchInput />
                </FormItem>
                <FormItem
                  label={'慢病史'}
                  name={'idCard1'}
                  rules={[{ type: 'idCard', required: true }]}
                >
                  <SwitchInput />
                </FormItem>
                <FormItem
                  label={'手术史'}
                  name={'idCard2'}
                  rules={[{ type: 'idCard', required: true }]}
                >
                  <SwitchInput />
                </FormItem>
                <FormItem
                  label={'预约手机号'}
                  name={'idCard3'}
                  rules={[{ type: 'idCard', required: true }]}
                >
                  <TelPhone />
                </FormItem>
                <FormItem
                  label={'上传检验检查资料'}
                  name={'idCard4'}
                  rules={[{ type: 'idCard', required: true }]}
                >
                  <UploadImg
                    className={styles.upload}
                    length={5}
                    multiple
                    tip={
                      <View className={styles.tips}>
                        图片支持JPEG、JPG、PNGBMP、GIF、TIFF格式，限制单
                        张图片不超过5M
                      </View>
                    }
                    maxSize={1 * 1024 * 1024}
                    onMaxError={() => {
                      showToast({ title: '文件过大', icon: 'none' });
                    }}
                    // 示例，这里需要换成真实上传方法
                    uploadFn={(file) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          resolve(URL.createObjectURL(file));
                        }, 10000);
                      })
                    }
                  />
                </FormItem>
                <FormItem
                  label={'上传检查影像文件'}
                  name={'idCard5'}
                  rules={[{ type: 'idCard', required: true }]}
                >
                  <UploadImg
                    className={styles.upload}
                    length={5}
                    multiple
                    tip={
                      <View className={styles.tips}>
                        请上传DCM格式的DICOM文件
                      </View>
                    }
                    maxSize={1 * 1024 * 1024}
                    onMaxError={() => {
                      showToast({ title: '文件过大', icon: 'none' });
                    }}
                    // 示例，这里需要换成真实上传方法
                    uploadFn={(file) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          resolve(URL.createObjectURL(file));
                        }, 10000);
                      })
                    }
                  />
                </FormItem>
                <FormItem
                  label={'上传视频资料'}
                  name={'idCard6'}
                  rules={[{ type: 'idCard', required: true }]}
                >
                  <UploadImg
                    className={styles.upload}
                    length={5}
                    multiple
                    tip={
                      <View className={styles.tips}>
                        视频仅支持MP4格式，单个视频不超过200M
                      </View>
                    }
                    maxSize={1 * 1024 * 1024}
                    onMaxError={() => {
                      showToast({ title: '文件过大', icon: 'none' });
                    }}
                    // 示例，这里需要换成真实上传方法
                    uploadFn={(file) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          resolve(URL.createObjectURL(file));
                        }, 10000);
                      })
                    }
                  />
                </FormItem>
              </Form>
            </View>
          </View>
        </Shadow>
        <Button type="primary" className={styles.btn}>
          提交
        </Button>
      </View>
    </View>
  );
};
