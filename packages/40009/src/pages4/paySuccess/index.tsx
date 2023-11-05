import React from 'react';
import { navigateTo, View } from 'remax/one';
import { WhiteSpace } from '@/components';
import { Shadow, PartTitle, Button, Space, Loading } from '@kqinfo/ui';
import classNames from 'classnames';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';
import useApi from '@/apis/mdt';
import Label from '@/components/label';
import Status from '../bookRecords/components/Status';
import dayjs from 'dayjs';
import { encryptPhone } from '@/utils';
export default () => {
  const { id } = useGetParams<{
    id: string;
  }>();
  const {
    data: { data: mdtDetail },
    loading,
  } = useApi.查询线下MDT详情({
    params: {
      id,
    },
    initValue: {
      data: { data: {} },
    },
    needInit: !!id,
  });
  return (
    <View className={styles.page}>
      {loading && <Loading />}
      <View className={styles.title}>
        <View>MDT申请单</View>
      </View>
      <WhiteSpace />
      <Shadow>
        <View className={styles.pane}>
          <Space className={styles.paneHead}>
            <PartTitle full>会诊信息</PartTitle>
            <Status status={'WAIT_IMPROVE_INFO'} />
          </Space>
          <View className={styles.paneBody}>
            {[
              { label: '会诊方式', content: '线下MDT门诊' },
              { label: '预约病种', content: mdtDetail?.diseaseType },
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
                content: encryptPhone(mdtDetail?.mdtOfflineApply?.contactPhone),
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
          </View>
        </View>
      </Shadow>
      <WhiteSpace />

      <Button
        type="primary"
        className={classNames(styles.button)}
        onTap={() => {
          navigateTo({
            url: `/pages4/supplyCondition/index?id=${id}`,
          });
        }}
      >
        补充病历资料
      </Button>
    </View>
  );
};
