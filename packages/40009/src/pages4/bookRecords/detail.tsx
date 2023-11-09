import React from 'react';
import { View, navigateTo } from 'remax/one';
import {
  Space,
  Shadow,
  PartTitle,
  useTitle,
  Image,
  Button,
  Loading,
  Modal,
  Form,
  FormItem,
  ReTextarea,
} from '@kqinfo/ui';
import styles from './index.less';
import { WhiteSpace } from '@/components';
import Status, { StatusTxt } from './components/Status';
import Label from '@/components/label';
import Fold from './components/Fold';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/mdt';
import dayjs from 'dayjs';
import { encryptPhone } from '@/utils';
export default () => {
  useTitle('MDT申请单');
  const { id } = useGetParams<{
    id: string;
  }>();
  const {
    data: { data: mdtDetail },
    loading,
    request: getdetail,
  } = useApi.查询线下MDT详情({
    params: {
      id,
    },
    initValue: {
      data: { data: {} },
    },
    needInit: !!id,
  });
  const { request } = useApi.申请取消会诊({
    needInit: false,
  });
  const [form] = Form.useForm();
  return (
    <View className={styles.warpPage}>
      {loading && <Loading />}
      <Modal />
      <View className={styles.title}>
        <View>MDT申请单</View>
      </View>
      {mdtDetail?.mdtState === 'WAIT_IMPROVE_INFO' && (
        <Shadow>
          <View className={styles.pane}>
            <Space className={styles.paneHead}>
              <PartTitle full>审核信息</PartTitle>
            </Space>
            <View className={styles.paneBody}>
              {[
                {
                  label: '未通过原因',
                  content: mdtDetail?.rejectReviewReason || '',
                },
                {
                  label: '退款到账',
                  content:
                    mdtDetail?.payState === 'REFUND'
                      ? '费用已原路退回，请查询支付账户！'
                      : StatusTxt[mdtDetail?.payState],
                },
              ].map((item, index) => (
                <Space
                  key={index}
                  alignItems="center"
                  className={styles.itemdesc}
                >
                  <Label width={60}>{item.label}</Label>
                  <View className={styles.value}>{item.content}</View>
                </Space>
              ))}
            </View>
          </View>
        </Shadow>
      )}

      <WhiteSpace />
      <Shadow>
        <View className={styles.pane}>
          <Space className={styles.paneHead}>
            <PartTitle full>会诊信息</PartTitle>
            <Status status={mdtDetail?.mdtState} />
          </Space>
          <View className={styles.paneBody}>
            {[
              { label: '会诊方式', content: '线下MDT门诊' },
              { label: '会诊团队', content: mdtDetail?.teamName },
              {
                label: '会诊时间',
                content: `${dayjs(mdtDetail?.mdtStartTime).format(
                  'YYYY-MM-DD',
                )} ${dayjs(mdtDetail?.mdtStartTime).format('HH:mm')}-${dayjs(
                  mdtDetail?.mdtEndTime,
                ).format('HH:mm')}`,
              },
              { label: '会诊地点', content: mdtDetail?.roomName },
            ].map((item, index) => (
              <Space
                key={index}
                alignItems="center"
                className={styles.itemdesc}
              >
                <Label>{item.label}</Label>
                <View className={styles.value}>{item.content}</View>
              </Space>
            ))}
          </View>
        </View>
      </Shadow>
      <Shadow>
        <View className={styles.pane}>
          <Space className={styles.paneHead}>
            <PartTitle full>就诊人信息</PartTitle>
          </Space>
          <View className={styles.paneBody}>
            {[
              { label: '就诊人', content: mdtDetail?.patName },
              { label: '就诊ID', content: mdtDetail?.patientId },
              {
                label: '联系方式',
                content: encryptPhone(mdtDetail?.contactPhone),
              },
              {
                label: '症状描述',
                content: mdtDetail?.mdtOfflineApply?.symptom,
              },
              {
                label: '过敏史',
                content: mdtDetail?.mdtOfflineApply?.allergies,
              },
              {
                label: '慢病史',
                content: mdtDetail?.mdtOfflineApply?.medicalHistory,
              },
              {
                label: '手术史',
                content: mdtDetail?.mdtOfflineApply?.operationHistory,
              },
            ].map((item, index) => (
              <Space
                key={index}
                alignItems="center"
                className={styles.itemdesc}
              >
                <Label>{item.label}</Label>
                <View className={styles.value}>{item.content}</View>
              </Space>
            ))}
            <Fold title="患者上传图片资料">
              {JSON.parse(mdtDetail?.mdtOfflineApply?.imageData || '[]').map(
                (item: string, index: string) => (
                  <Image
                    src={item}
                    key={index}
                    className={styles.img}
                    preview
                  />
                ),
              )}
            </Fold>
            <Fold title="患者上传视频资料">
              {JSON.parse(mdtDetail?.mdtOfflineApply?.videoData || '[]').map(
                (item: string, index: string) => (
                  <Image className={styles.img} src={item} key={index} />
                ),
              )}
            </Fold>
          </View>
        </View>
      </Shadow>
      <Space className={styles.bottomPane} vertical size={20}>
        {mdtDetail?.payState === 'UNPAY' && (
          <Button
            type="primary"
            onTap={() =>
              navigateTo({
                url: `/pages4/cash/index?id=${id}`,
              })
            }
          >
            立即缴费
          </Button>
        )}
        {mdtDetail?.mdtState === 'WAIT_IMPROVE_INFO' && (
          <Button
            type="primary"
            onTap={() =>
              navigateTo({
                url: `/pages4/supplyCondition/index?id=${id}`,
              })
            }
          >
            补充病历资料
          </Button>
        )}
        {['WAIT_REVIEW', 'WAIT_IMPROVE_INFO'].includes(mdtDetail?.mdtState) && (
          <Button
            className={styles.ghostbtn}
            onTap={() =>
              Modal.show({
                title: '取消申请',
                bodyCls: styles.modalContent,
                // 异步关闭
                onOk: () =>
                  new Promise((resolve, reject) => {
                    form.submit();
                    form
                      .validateFields()
                      .then((values) => {
                        request({ ...values, id }).then(() => {
                          getdetail();
                          resolve('');
                        });
                      })
                      .catch(reject);
                  }),
                content: (
                  <Form form={form} style={{ width: '100%' }} vertical>
                    <FormItem
                      noStyle
                      name={'reason'}
                      rules={[{ required: true, message: '请输入取消原因' }]}
                    >
                      <ReTextarea
                        placeholder={'请输入取消原因'}
                        className={styles.txtarea}
                      />
                    </FormItem>
                  </Form>
                ),
              })
            }
          >
            取消MDT
          </Button>
        )}
      </Space>
    </View>
  );
};
