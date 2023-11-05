import React from 'react';
import { View, Image, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Button,
  NoData,
  Space,
  Loading,
  ScrollView,
  useSafeArea,
  AffirmSheet,
  setStorageSync,
} from '@kqinfo/ui';
import dayjs from 'dayjs';
import useApi from '@/apis/mdt';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import ShowTitle from './components/showTitle';
import { PreviewImage } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';
import classNames from 'classnames';

const WEEKS: any[] = ['一', '二', '三', '四', '五', '六', '日'];

export default () => {
  const { teamId } = useGetParams<{ teamId: string }>();
  const { bottomHeight } = useSafeArea();
  const {
    loading,
    data: { data: detail },
  } = useApi.根据id查询团队详情({
    initValue: { data: {} },
    params: {
      id: teamId,
    },
    needInit: true,
  });
  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '团队详情',
    });
  });

  const handleExpertDetail = (v: typeof detail.teamMembers) => {
    setStorageSync('expert_info', v);
    navigateTo({ url: '/pages4/booking/team/expert' });
  };

  const hanldeAffirmClose = () => {
    AffirmSheet.hide();
  };

  const handleTeamDetail = () => {
    AffirmSheet.show({
      title: (
        <View className={styles.affirmSheet_box}>
          <Text style={{ color: '#333' }}>团队成员</Text>
          <Text style={{ color: '#333' }} onTap={hanldeAffirmClose}>
            X
          </Text>
        </View>
      ),
      content: (
        <View
          className={styles.affirmSheet_content}
          style={{ paddingBottom: bottomHeight }}
        >
          {(detail.teamMembers ?? []).map((v) => {
            return (
              <Space size={10} key={v.id} className={styles.affirmSheet_item}>
                <View>
                  <PreviewImage
                    url={v.doctorImage ?? `${IMAGE_DOMIN}/mdt/ys2.png`}
                    className={styles.user_icon}
                  />
                </View>
                <Space vertical className={styles.doctor_desc} size={20}>
                  <View>
                    <Text className={styles.doctor_name}>{v.doctorName}</Text>
                    <Text>{v.doctorLevel}</Text>
                  </View>
                  <View>
                    <Text>{v.hospitalName}</Text>&nbsp;|&nbsp;
                    <Text>{v.deptName}</Text>
                  </View>
                  <View>{v.doctorSpecialty}</View>
                  <Button
                    type={'primary'}
                    className={styles.doctor_gap}
                    size="small"
                    block={false}
                    ghost
                    onTap={() => handleExpertDetail(v as any)}
                  >
                    专家详情
                  </Button>
                </Space>
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
        <Space className={styles.detail_top} size={20}>
          <PreviewImage
            url={detail.avatarImage ?? `${IMAGE_DOMIN}/mdt/user_icon.png`}
            className={styles.user_icon}
          />
          <View className={styles.detail_top_right}>
            <Text className={styles.right_name}>{detail.teamName}</Text>
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
                <Text>{detail.diseaseType}</Text>
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle title="出诊时间">
                <View>
                  {(detail.visitSlot ?? []).map((i) => {
                    return (
                      <View key={i.week}>
                        星期{WEEKS[i.week + 1]} (
                        {dayjs(`2000-10-10 ${i.startTime}`).format('hh:mm')} ~{' '}
                        {dayjs(`2000-10-10 ${i.endTime}`).format('hh:mm')})
                      </View>
                    );
                  })}
                </View>
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
                {detail.teamMembers.length ? (
                  <ScrollView>
                    <Space size={40}>
                      {(detail.teamMembers ?? []).map((userItem) => (
                        <Space key={userItem.id} size={10}>
                          <View className={styles.user_list}>
                            <Image
                              src={
                                userItem.doctorImage ??
                                `${IMAGE_DOMIN}/mdt/ys2.png`
                              }
                              className={classNames([
                                styles.user_icon,
                                styles.user_icon_bottom,
                              ])}
                            />
                            <View>{userItem.doctorName}</View>
                          </View>
                        </Space>
                      ))}
                    </Space>
                  </ScrollView>
                ) : (
                  <NoData />
                )}
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle title="团队介绍">
                <Text>{detail.intro}</Text>
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
