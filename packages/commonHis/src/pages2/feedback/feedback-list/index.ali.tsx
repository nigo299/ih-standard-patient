import React from 'react';
import {
  ScrollView,
  Shadow,
  Space,
  FormItem,
  Loading,
  NoData,
} from '@kqinfo/ui';
import { View, Text } from '@remax/one';
import { navigateTo } from 'remax/one';
import styles from './index.less';
import useApi from '@/apis/feedback';
import { usePageEvent } from '@remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';

export default () => {
  const { data, request, loading } = useApi.获取意见反馈列表({
    needInit: false,
  });
  usePageEvent('onShow', () => {
    request();
    setNavigationBar({
      title: '意见反馈列表',
    });
  });

  return (
    <ScrollView className={styles.pageFeedback} scrollY>
      {loading && <Loading type="top" />}
      {data?.data?.recordList?.length > 0 ? (
        data?.data?.recordList.map(
          ({
            id,
            complaintsReason,
            complaintsContent,
            patientName,
            createDate,
            replyList,
          }) => {
            // 取replyList数组里，type === 2 时，最新的一条
            const replyContents = (replyList || [])
              .filter((x) => x.type === '2')
              .sort((a, b) => {
                return a.createTime > b.createTime ? 1 : -1;
              });
            return (
              <Shadow key={id}>
                <View className={styles.feedbackItem}>
                  <View className={styles.feedbackItemContent}>
                    <FormItem
                      labelWidth={'6em'}
                      label={'投诉建议原因'}
                      className={styles.feedbackItemContentTitle}
                    />

                    <Text className={styles.feedbackItemContentText}>
                      {complaintsReason}
                    </Text>
                  </View>
                  <View className={styles.feedbackItemContent}>
                    <FormItem
                      labelWidth={'6em'}
                      label="投诉建议内容"
                      className={styles.feedbackItemContentTitle}
                    />

                    <Text className={styles.feedbackItemContentText}>
                      {complaintsContent}
                    </Text>
                  </View>
                  <View className={styles.feedbackItemContent}>
                    <FormItem
                      labelWidth={'6em'}
                      label="提交人"
                      className={styles.feedbackItemContentTitle}
                    />

                    <Text className={styles.feedbackItemContentText}>
                      {patientName}
                    </Text>
                  </View>
                  <View className={styles.feedbackItemContent}>
                    <FormItem
                      labelWidth={'6em'}
                      label="提交时间"
                      className={styles.feedbackItemContentTitle}
                    />

                    <Text className={styles.feedbackItemContentText}>
                      {createDate}
                    </Text>
                  </View>
                  <View className={styles.feedbackItemContent}>
                    <FormItem
                      labelWidth={'6em'}
                      label="处理回复"
                      className={styles.feedbackItemContentTitle}
                    />
                    {/* 取replyList数组里，type === 2 时，最新的一条 */}

                    <Text className={styles.feedbackItemContentText}>
                      {replyContents && replyContents.length
                        ? replyContents[0].replyContent
                        : '暂无'}
                    </Text>
                  </View>
                  <View className={styles.feedbackItemDivider} />
                  <View className={styles.feedbackItemDetail}>
                    <Text
                      className={styles.feedbackItemDetailText}
                      onTap={() => {
                        navigateTo({
                          url: `/pages2/feedback/feedback-detail/index?id=${id}`,
                        });
                      }}
                    >
                      查询详情
                    </Text>
                  </View>
                </View>
              </Shadow>
            );
          },
        )
      ) : (
        <NoData />
      )}
      <View className={styles.pageFeedbackAddBox}>
        <Space
          className={styles.addWrap}
          onTap={() => {
            navigateTo({
              url: '/pages2/feedback/feedback-add/index',
            });
          }}
        />
      </View>
    </ScrollView>
  );
};
