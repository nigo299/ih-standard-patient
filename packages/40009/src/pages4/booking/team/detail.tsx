import React, { useState } from 'react';
import { View, Image, navigateTo, redirectTo, Text } from 'remax/one';
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
  ScrollView,
  useSafeArea,
  AffirmSheet,
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
  const { bottomHeight } = useSafeArea();
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
      title: '团队详情',
    });
  });
  const handleTeamDetail = () => {
    // setShow(true);
    AffirmSheet.show({
      title: (
        <View className={styles.affirmSheet_box}>
          <Text style={{ color: '#333' }}>团队成员</Text>
          {/* <Icon name={'kq-clear'} /> */}
          <Text style={{ color: '#333' }}>X</Text>
        </View>
      ),
      content: (
        <View
          className={styles.affirmSheet_content}
          style={{ paddingBottom: bottomHeight }}
        >
          {new Array(20).fill('').map((v, i) => {
            return (
              <Space size={'10px'} key={i} className={styles.affirmSheet_item}>
                <View>
                  <Image
                    src={userSrc}
                    style={{ width: '60px', height: '60px' }}
                  ></Image>
                </View>
                <View className={styles.doctor_desc}>
                  <View className={styles.doctor_gap}>
                    <Text className={styles.doctor_name}>医生名称</Text>
                    <Text>主任医生</Text>
                  </View>
                  <View className={styles.doctor_gap}>
                    <Text>重庆松山医院</Text>&nbsp;|&nbsp;<Text>新增内科</Text>
                  </View>
                  <View className={styles.doctor_gap}>
                    <Text>
                      擅长：临床工作30余年，擅长心力衰竭，心
                      肌病、辩膜病、心脏影像学。
                    </Text>
                  </View>
                  <Button
                    type={'primary'}
                    className={styles.doctor_gap}
                    size="small"
                    block={false}
                    ghost
                  >
                    专家详情
                  </Button>
                </View>
              </Space>
            );
          })}
        </View>
      ),
      footer: null,
    });
  };
  return (
    <View className={styles.page}>
      {loading && <Loading type={'top'} />}
      <View>
        <Space className={styles.detail_top} size={'10px'}>
          <Image
            src={userSrc}
            style={{ width: '100px', height: '100px' }}
          ></Image>
          <View className={styles.detail_top_right}>
            <Text className={styles.right_name}>肥胖和糖尿病代谢疾病MDT</Text>
            <View className={styles.top_right_bottom}>
              <Text className={styles.border_hos_name}>三甲医院</Text>
              <Text>重庆松山医院</Text>
            </View>
          </View>
        </Space>
        <View className={styles.detail_content}>
          <View className={styles.inner_content}>
            <View className={styles.item_gap}>
              <ShowTitle title="病种名称">
                <Text>肥胖和糖尿病代谢疾病</Text>
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle title="出诊时间">
                <Text>周三上午（13:00）</Text>
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle
                title="团队成员"
                footer={
                  <View
                    className={styles.teamer_footer}
                    onTap={() => handleTeamDetail()}
                  >
                    <Text>查看详情</Text>
                  </View>
                }
              >
                <ScrollView>
                  <Space size={10}>
                    {new Array(50).fill(0).map((_, i) => (
                      <Space key={i}>
                        <View>
                          <Image
                            src={userSrc}
                            style={{ width: '60px', height: '60px' }}
                          ></Image>
                          <Text>束带结</Text>
                        </View>
                      </Space>
                    ))}
                  </Space>
                </ScrollView>
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle title="团队介绍">
                <Text>
                  随着我国肥胖和超重人群的逐渐增长，肥胖既是一种独立的疾病，同时也是多种心脑血管疾病以及内分泌代谢疾病的危险因素，如2型糖尿病、
                </Text>
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle title="服务内容">
                <Text>
                  1.肥胖和糖尿病代谢疾病的诊断和治疗 2.检验检查报告解读
                  3.复诊预约 4.肥胖和糖尿病代谢疾病患者的全程管理
                </Text>
              </ShowTitle>
            </View>
            <Space vertical style={{ paddingBottom: bottomHeight }}>
              <Button type="primary" className={styles.btn_box}>
                预约线下会诊
              </Button>
              <Button type="primary" className={styles.btn_box}>
                预约线上会诊
              </Button>
            </Space>
          </View>
        </View>
        <AffirmSheet />
      </View>
    </View>
  );
};
