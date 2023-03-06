import useGetParams from '@/utils/useGetParams';
import {
  Button,
  ScrollView,
  Shadow,
  Image,
  previewImage,
  FormItem,
  Space,
} from '@kqinfo/ui';
import { View, Text } from '@remax/one';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { navigateTo } from 'remax/one';
import styles from './index.less';
import useApi, { ComplainInfo } from '@/apis/feedback';
import { usePageEvent } from '@remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import CustomerReported from '@/components/customerReported';
import { IS_FEEDBACL } from '@/config/constant';

export default () => {
  const { id } = useGetParams<{ id: string }>();
  const [complainDetail, setComplainDetail] = useState<ComplainInfo>();

  const images = useMemo(() => {
    return complainDetail?.complaintsCert?.split(',').filter((x) => !!x) || [];
  }, [complainDetail]);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '意见反馈详情',
    });
    if (!!id) {
      useApi.获取意见反馈详情
        .request({
          id: parseInt(id),
        })
        .then((response) => {
          setComplainDetail(response?.data);
        });
    }
  });

  return (
    <ScrollView scrollY className={styles.pageFeedbackDetail}>
      <Shadow>
        <View className={styles.feedbackDetailBody}>
          <View className={styles.feedbackDetailItem}>
            <FormItem
              labelWidth={'8em'}
              label="提交时间"
              className={styles.feedbackDetailItemTitle}
            />
            <Text className={styles.feedbackDetailItemContent}>
              {complainDetail?.createDate || '暂无'}
            </Text>
          </View>
          <View className={styles.feedbackDetailItem}>
            <FormItem
              labelWidth={'8em'}
              label="提交人"
              className={styles.feedbackDetailItemTitle}
            />
            <Text className={styles.feedbackDetailItemContent}>
              {complainDetail?.patientName || '暂无'}
            </Text>
          </View>
          <View className={styles.feedbackDetailItem}>
            <FormItem
              labelWidth={'8em'}
              label="投诉或建议的原因"
              className={styles.feedbackDetailItemTitle}
            />
            <Text className={styles.feedbackDetailItemContent}>
              {complainDetail?.complaintsReason || '暂无'}
            </Text>
          </View>
          <View
            className={classNames(
              styles.feedbackDetailItem,
              styles.feedbackDetailItem1,
            )}
          >
            <FormItem
              labelWidth={'8em'}
              label="投诉或建议的内容"
              className={styles.feedbackDetailItemTitle}
            />
          </View>
          <View className={styles.feedbackDetailItem}>
            <Text className={styles.feedbackDetailItemContent1}>
              {complainDetail?.complaintsContent || '暂无'}
            </Text>
          </View>
          <View className={styles.feedbackDetailImages}>
            {(images || []).map((item, i) => {
              return (
                <Image
                  key={i}
                  preview
                  className={classNames(styles.feedbackDetailImage, {
                    [styles.feedbackDetailImageFirst]: i === 0,
                  })}
                  mode="aspectFit"
                  src={item}
                  onTap={() => {
                    previewImage({ urls: [item] });
                  }}
                />
              );
            })}
          </View>
          {(complainDetail?.replyList || []).map((item, i) => {
            return (
              <View key={i} className={styles.feedbackDetailReplyList}>
                <View className={styles.feedbackDetailItem2}>
                  <Text className={styles.feedbackDetailItemTitle3}>
                    {item.type === '2' ? '处理回复' : '我'}：
                  </Text>
                  <Text className={styles.feedbackDetailItemContent2}>
                    {item.createDate}
                  </Text>
                </View>
                <View className={styles.feedbackDetailItem}>
                  <Text className={styles.feedbackDetailItemContent1}>
                    {item.replyContent}
                  </Text>
                </View>
                <View
                  className={classNames(
                    styles.feedbackDetailImages,
                    styles.feedbackDetailImages1,
                  )}
                >
                  {(item?.replyUrl?.split(',').filter((x) => !!x) || []).map(
                    (item1, i1) => {
                      return (
                        <Image
                          key={i1}
                          preview
                          className={classNames(styles.feedbackDetailImage, {
                            [styles.feedbackDetailImageFirst]: i1 === 0,
                          })}
                          src={item1}
                          onTap={() => {
                            previewImage({ urls: [item1] });
                          }}
                        />
                      );
                    },
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </Shadow>
      <Button
        type={'primary'}
        className={styles.feedbackDetailButton}
        onTap={() => {
          navigateTo({
            url: `/pages2/feedback/feedback-add/index?id=${id}`,
          });
        }}
      >
        追加回复
      </Button>
      {IS_FEEDBACL && (
        <Space justify={'center'} className={styles.fixedBottom}>
          <CustomerReported whereShowCode={'FKXQ_DB'} isFeed />
        </Space>
      )}
    </ScrollView>
  );
};
