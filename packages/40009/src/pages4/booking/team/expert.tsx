import React, { useState } from 'react';
import { View, Text, Image, navigateTo, redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Button,
  ColorText,
  NoData,
  showToast,
  Space,
  Calendar,
  Loading,
  Exceed,
  Icon,
} from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { Mask } from '@/components';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useEffectState } from 'parsec-hooks';
import useApi from '@/apis/common';
import styles from './index.less';
import patientState from '@/stores/patient';
import useGetParams from '@/utils/useGetParams';
import ShowTitle from './components/showTitle';

import userSrc from './assets/images/user.png';
import shareSrc from './assets/images/fx.png';
import scPng from './assets/images/sc.png';
import scFullPng from './assets/images/sc_full.png';

interface NucleType {
  deptId: string;
  doctorId: string;
  endTime: string;
  leftNum: string;
  nucleicDate: string;
  nucleicName: string;
  regFee: string;
  resourceId: string;
  sortNo: string;
  startTime: string;
  timeFlag: string;
  totalNum: string;
}
export default () => {
  const { type } = useGetParams<{ type: string }>();
  const [hasCollect, setHasCollect] = useState(false);
  const { getPatientList, defaultPatientInfo } = patientState.useContainer();
  const [show, setShow] = useState(false);
  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  const {
    request,
    loading,
    data: { data },
  } = useApi.透传字段({
    params: {
      transformCode: 'KQ00021',
      time: selectDate,
      type,
    },
    needInit: false,
  });
  const [resourceId, setResourceId] = useEffectState(
    data?.data?.items?.[0]?.resourceId || '',
  );
  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '专家介绍',
    });
  });
  const toggleCollect = () => {
    setHasCollect(!hasCollect);
  };
  return (
    <View className={styles.page}>
      {loading && <Loading type={'top'} />}
      <View style={{ width: '100%' }}>
        <Space className={styles.detail_top} size={'10px'}>
          <Space size={'10px'} style={{ flex: 1 }}>
            <Image
              src={userSrc}
              className={styles.user_icon}
            ></Image>
            <View className={styles.detail_top_right}>
              <Text className={styles.right_name}>
                {'医生名称'}&nbsp;|&nbsp;{'副主任医生'}
              </Text>
              <View className={styles.top_right_bottom}>
                <Text>内科</Text>
                <Text
                  className={`${styles.border_hos_name} ${styles.border_hos_name_unique}`}
                >
                  本部
                </Text>
              </View>
            </View>
          </Space>
          <View className={styles.expert_icon}>
            <Image
              src={hasCollect ? scFullPng : scPng}
              className={styles.share_icon}
              onTap={toggleCollect}
            ></Image>
            <Image src={shareSrc} className={styles.share_icon}></Image>
          </View>
        </Space>
        <View className={styles.detail_content}>
          <View className={styles.inner_content}>
            <View className={styles.item_gap}>
              <ShowTitle title="擅长领域">
                <Text>
                  从事内分泌与代谢疾病的临床、教学和科研工作20余年，擅长小儿常见病、糖尿病、痛风、高脂血症等代谢性疾病的综合管理治疗以及甲状腺
                </Text>
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle title="医生简介">
                <Text>
                  1979年毕业于第四军医大学获博士学位，主要从事内分泌与代谢疾病的临床、教学和科研工作20余年，擅长小儿常见病、糖尿病、痛风、
                </Text>
              </ShowTitle>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
