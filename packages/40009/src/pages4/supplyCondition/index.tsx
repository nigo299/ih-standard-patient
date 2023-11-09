import React, { useCallback } from 'react';
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
import UploadFile from './components/uploadFile';
import useApi from '@/apis/mdt';
import useGetParams from '@/utils/useGetParams';
import { getPatientAge } from '@/utils';
import dayjs from 'dayjs';
import { uploadFunc } from '@/utils/useUpload';
export default () => {
  const { id } = useGetParams<{
    id: string;
  }>();
  const {
    data: { data: mdtDetail },
  } = useApi.查询线下MDT详情({
    params: {
      id,
    },
    initValue: {
      data: { data: {} },
    },
    needInit: !!id,
  });
  const { request: subRequest, loading: subLoading } = useApi.线下MDT补充资料({
    needInit: false,
  });
  const [form] = Form.useForm();
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  const submit = useCallback(
    (values: any) => {
      const params = {
        id: mdtDetail?.id,
        symptom: values?.symptom, //症状描述
        allergies: values?.allergies, //过敏历
        medicalHistory: values?.medicalHistory, //现病史
        operationHistory: values?.operationHistory, //手术史
        imageData: JSON.stringify(values?.imageData), //图片资料
        fileData: JSON.stringify(values?.fileData), //文档资料
        videoData: JSON.stringify(values?.videoData), //视频资料
        contactPhone: values?.contactPhone, //预留电话
      };
      subRequest({
        ...params,
      }).then(() => {
        showToast({ title: '提交成功' });
        setTimeout(() => {
          history.back();
        }, 1000);
      });
    },
    [mdtDetail.id, subRequest],
  );
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
              <Text className={styles.bold}>{mdtDetail?.patName}</Text>
              {getPatientAge(mdtDetail?.patSex)}
              {mdtDetail?.patAgeStr}
            </View>
            <Space className={styles.paneItem}>
              <Label>患者ID</Label>
              <Text className={styles.value}>{mdtDetail?.patientId}</Text>
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
                onFinish={(values) => submit(values)}
                onFinishFailed={(err) => {
                  console.log(err);
                }}
                vertical
                labelCls={styles.Formlabel}
                requiredMarkCls={styles.requiredMark}
                values={
                  mdtDetail?.teamName
                    ? {
                        ...mdtDetail,
                        mdtRangeTime: `${dayjs(mdtDetail.mdtStartTime).format(
                          'YYYY-MM-DD',
                        )}  星期${
                          week[dayjs(mdtDetail.mdtStartTime).day()]
                        }  ${dayjs(mdtDetail.mdtStartTime).format(
                          'HH:mm',
                        )} - ${dayjs(mdtDetail.mdtEndTime).format('HH:mm')}`,
                        symptom: mdtDetail?.mdtOfflineApply?.symptom,
                        allergies:
                          mdtDetail?.mdtOfflineApply?.allergies || '无',
                        medicalHistory:
                          mdtDetail?.mdtOfflineApply?.medicalHistory || '无',
                        operationHistory:
                          mdtDetail?.mdtOfflineApply?.operationHistory || '无',
                        imageData: JSON.parse(
                          mdtDetail?.mdtOfflineApply?.imageData || '[]',
                        ),
                        fileData: JSON.parse(
                          mdtDetail?.mdtOfflineApply?.fileData || '[]',
                        ),
                        videoData: JSON.parse(
                          mdtDetail?.mdtOfflineApply?.videoData || '[]',
                        ),
                      }
                    : { teamName: '' }
                }
              >
                <FormItem
                  label={'会诊团队'}
                  name={'teamName'}
                  rules={[{ required: true }]}
                >
                  <ReInput
                    placeholder="会诊团队"
                    className={styles.ipt}
                    disabled
                  />
                </FormItem>
                <FormItem
                  label={'会诊时间'}
                  name={'mdtRangeTime'}
                  rules={[{ required: true }]}
                >
                  <ReInput
                    placeholder="会诊时间"
                    className={styles.ipt}
                    disabled
                  />
                </FormItem>
                <FormItem
                  label={'症状描述'}
                  name={'symptom'}
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
                  name={'allergies'}
                  rules={[{ required: true }]}
                >
                  <SwitchInput />
                </FormItem>
                <FormItem
                  label={'慢病史'}
                  name={'medicalHistory'}
                  rules={[{ required: true }]}
                >
                  <SwitchInput />
                </FormItem>
                <FormItem
                  label={'手术史'}
                  name={'operationHistory'}
                  rules={[{ required: true }]}
                >
                  <SwitchInput />
                </FormItem>
                <FormItem
                  label={'预约手机号'}
                  name={'contactPhone'}
                  rules={[{ type: 'phone', required: true }]}
                >
                  <TelPhone reserved={mdtDetail?.mdtOfflineApply?.patPhone} />
                </FormItem>
                <FormItem
                  label={'上传检验检查资料'}
                  name={'imageData'}
                  rules={[{ required: true }]}
                >
                  <UploadImg
                    length={5}
                    multiple
                    maxSize={1 * 1024 * 1024}
                    onMaxError={() => {
                      showToast({ title: '文件过大', icon: 'none' });
                    }}
                    delIconCls={styles.delAction}
                    delIcon={<Text>删除</Text>}
                    tip={<></>}
                    // 示例，这里需要换成真实上传方法
                    uploadFn={async (file: any) =>
                      await uploadFunc(file, 'image')
                    }
                  />
                </FormItem>
                <View className={styles.tips}>
                  图片支持JPEG、JPG、PNGBMP、GIF、TIFF格式，限制单张图片不超过5M
                </View>
                <FormItem label={'上传检查影像文件'} name={'fileData'}>
                  <UploadFile
                    length={5}
                    multiple
                    maxSize={200 * 1024 * 1024}
                    delIconCls={styles.delAction}
                    delIcon={<Text>删除</Text>}
                    tip={<></>}
                    onMaxError={() => {
                      showToast({ title: '文件过大', icon: 'none' });
                    }}
                    // 示例，这里需要换成真实上传方法
                    uploadFn={async (file: any) =>
                      await uploadFunc(file, 'video')
                    }
                  />
                </FormItem>
                <View className={styles.tips}>请上传DCM格式的DICOM文件</View>
                <FormItem label={'上传视频资料'} name={'videoData'}>
                  <UploadFile
                    length={5}
                    multiple
                    maxSize={200 * 1024 * 1024}
                    onMaxError={() => {
                      showToast({ title: '文件过大', icon: 'none' });
                    }}
                    delIconCls={styles.delAction}
                    delIcon={<Text>删除</Text>}
                    tip={<></>}
                    // 示例，这里需要换成真实上传方法
                    uploadFn={async (file: any) =>
                      await uploadFunc(file, 'video')
                    }
                  />
                </FormItem>
                <View className={styles.tips}>
                  视频仅支持MP4格式，单个视频不超过200M
                </View>
              </Form>
            </View>
          </View>
        </Shadow>
        <Button
          type="primary"
          className={styles.btn}
          loading={subLoading}
          onTap={() => form.submit()}
        >
          提交
        </Button>
      </View>
    </View>
  );
};
