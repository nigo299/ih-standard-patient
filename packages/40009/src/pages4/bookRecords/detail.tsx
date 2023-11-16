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
import Status from './components/Status';
import Label from '@/components/label';
import Fold from './components/Fold';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/mdt';
import dayjs from 'dayjs';
import { encryptPhone } from '@/utils';
import { usePageEvent } from 'remax/macro';
export default () => {
  useTitle('MDT详情');
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
  usePageEvent('onShow', () => {
    getdetail({ id });
  });
  const { request } = useApi.申请取消会诊({
    needInit: false,
  });
  const [form] = Form.useForm();
  const StatusTxt: any = {
    UNPAY: '无需退款！',
    REFUND: '退款已完成！',
    REFUND_FAIL: '退款失败！',
    PAID: '待退款！',
  };
  const ResonJSON: any = {
    CANCELED: {
      title: '取消原因',
      content: mdtDetail?.applyCancelReason || '-',
      refund: StatusTxt[mdtDetail.payState],
    },
    FAIL_NOTIFY_HIS: {
      title: '失败原因',
      content: '因HIS系统接口调用失败，本次会诊申请取消！',
      refund: '费用将在1-3个工作日内，人工审核后原路退回！',
    },
    EXCEPTION_NOTIFY_HIS: {
      title: '异常原因',
      content: '因HIS系统接口调用失败，本次会诊申请取消！',
      refund: '费用将在1-3个工作日内，人工审核后原路退回！',
    },
  };

  return (
    <View className={styles.warpPage}>
      {loading && <Loading />}
      <Modal />
      <View className={styles.title}>
        <View>MDT申请单</View>
      </View>
      {mdtDetail?.mdtState === 'REJECT_REVIEW' && (
        <Shadow>
          <View className={styles.pane}>
            <Space className={styles.paneHead}>
              <PartTitle full>审核信息</PartTitle>
            </Space>
            <View className={styles.paneBody}>
              <Space alignItems="center" className={styles.itemdesc}>
                <Label>未通过原因</Label>
                <View className={styles.value}>
                  {mdtDetail?.rejectReviewReason || ''}
                </View>
              </Space>
              <Space alignItems="center" className={styles.itemdesc}>
                <Label>退款到账</Label>
                <View className={styles.value}>
                  费用已原路退回，请查询支付账户！
                </View>
              </Space>
            </View>
          </View>
        </Shadow>
      )}

      {['CANCELED', 'FAIL_NOTIFY_HIS', 'EXCEPTION_NOTIFY_HIS'].includes(
        mdtDetail?.mdtState,
      ) && (
        <Shadow>
          <View className={styles.pane}>
            <Space className={styles.paneHead}>
              <PartTitle full>温馨提示</PartTitle>
            </Space>
            <View className={styles.paneBody}>
              <Space alignItems="center" className={styles.itemdesc}>
                <Label>{ResonJSON[mdtDetail?.mdtState].title}</Label>
                <View className={styles.value}>
                  {mdtDetail?.applyCancelReason}
                </View>
              </Space>
              <Space alignItems="center" className={styles.itemdesc}>
                <Label>退款到账</Label>
                <View className={styles.value}>
                  费用将在1-3个工作日内，人工审核后原路退回！
                </View>
              </Space>
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
              { label: '就诊ID', content: mdtDetail?.patCardNo },
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
