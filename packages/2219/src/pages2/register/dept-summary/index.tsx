import React, { useMemo } from 'react';
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
  const realDeptDetail = useMemo(() => {
    if (deptId === '30312001') {
      return {
        name: '儿童牙病',
        hisDistrict: '冉家坝院区',
        summary:
          '诊疗范围：儿童牙体龋病、非龋病疾病、牙髓病、根尖周疾病，儿童口腔舒适治疗。',
      };
    }
    if (deptId === '30312002') {
      return {
        name: '儿童早期矫治',
        hisDistrict: '冉家坝院区',
        summary:
          '诊疗范围：儿童各类错颌畸形的早期矫治（如牙列拥挤，反合，上牙前突，阻生牙等）；儿童口腔不良习惯的阻断治疗（如口呼吸，咬唇，吐舌等）。',
      };
    }
    if (deptId === '30312003') {
      return {
        name: '儿童牙外伤',
        hisDistrict: '冉家坝院区',
        summary: '诊疗范围：儿童乳牙和年轻恒牙外伤。',
      };
    }
    return deptDetail;
  }, [deptDetail, deptId]);
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
              url={realDeptDetail?.img || `${IMAGE_DOMIN}/register/dept.png`}
              className={styles.deptImg}
            />
            <Space vertical size={10}>
              <Space alignItems="center">
                <Text className={styles.cardTitle}>{realDeptDetail?.name}</Text>
                <Space
                  className={styles.tag}
                  justify="center"
                  alignItems="center"
                >
                  {realDeptDetail?.hisDistrict}
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
        <TextWrap text={realDeptDetail?.tel || '暂无'} />
        <PartTitle className={styles.partTitle} bold full>
          科室位置
        </PartTitle>
        <TextWrap text={realDeptDetail?.address || '暂无'} />
        <PartTitle className={styles.partTitle} bold full>
          科室介绍
        </PartTitle>

        {realDeptDetail?.summary ? (
          <RichText
            nodes={realDeptDetail?.summary}
            className={styles.textWrap}
          />
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
