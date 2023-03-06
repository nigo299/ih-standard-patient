import React from 'react';
import { View, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import { IMAGE_DOMIN, HOSPITAL_NAME } from '@/config/constant';
import { Space, Shadow, PartTitle, RichText } from '@kqinfo/ui';
import setNavigationBar from '@/utils/setNavigationBar';
import styles from './index.less';
import { PreviewImage } from '@/components';
import useMicrositeApi from '@/apis/microsite';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const { deptId } = useGetParams<{
    deptId: string;
  }>();
  const {
    data: { data: deptDetail },
  } = useMicrositeApi.获取科室详情({
    params: {
      no: deptId,
    },
    needInit: !!deptId,
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '科室介绍',
    });
  });
  return (
    <View className={styles.page}>
      <View className={styles.top} />
      <View className={styles.card}>
        <Shadow card>
          <Space alignItems="center" className={styles.cardWrap}>
            <PreviewImage
              url={deptDetail?.img || `${IMAGE_DOMIN}/register/dept.png`}
              className={styles.deptImg}
            />
            <Space vertical size={10}>
              <Space alignItems="center">
                <Text className={styles.cardTitle}>{deptDetail?.name}</Text>
                <Space
                  className={styles.tag}
                  justify="center"
                  alignItems="center"
                >
                  {deptDetail?.hisDistrict}
                </Space>
              </Space>
              <Text className={styles.cardText}>{HOSPITAL_NAME}</Text>
            </Space>
          </Space>
        </Shadow>
      </View>
      <View className={styles.content}>
        <PartTitle className={styles.partTitle} bold full>
          联系电话
        </PartTitle>
        <TextWrap text={deptDetail?.tel || '暂无'} />
        <PartTitle className={styles.partTitle} bold full>
          科室位置
        </PartTitle>
        <TextWrap text={deptDetail?.address || '暂无'} />
        <PartTitle className={styles.partTitle} bold full>
          科室介绍
        </PartTitle>

        {deptDetail?.summary ? (
          <RichText nodes={deptDetail?.summary} className={styles.textWrap} />
        ) : (
          <TextWrap text={'暂无'} />
        )}
      </View>
    </View>
  );
};

const TextWrap = ({ text }: { text: string }) => (
  <View className={styles.textWrap}>{text}</View>
);
