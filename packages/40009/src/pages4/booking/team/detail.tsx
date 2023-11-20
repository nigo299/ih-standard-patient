import React, { useMemo, useState } from 'react';
import { View, Image, navigateTo, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Button,
  NoData,
  Space,
  ScrollView,
  useSafeArea,
  RichText,
  ListItem,
} from '@kqinfo/ui';
import useApi from '@/apis/mdt';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import ShowTitle from './components/showTitle';
import { PreviewImage } from '@/components';
import { IMAGE_DOMIN } from '@/config/constant';
import classNames from 'classnames';
import storage from '@/utils/storage';
import AfirmSheet from './components/AfirmSheet';
const WEEKS: any[] = ['一', '二', '三', '四', '五', '六', '日'];
const MODE = {
  线下: 1,
  线上: 2,
  全部: 3,
};

export default () => {
  const { teamId, isdetail } = useGetParams<{
    teamId: string;
    isdetail: string;
  }>();
  const {
    data: { data: detail },
  } = useApi.根据id查询团队详情({
    initValue: { data: {} },
    params: {
      id: teamId,
    },
    needInit: !!teamId,
  });
  const { bottomHeight } = useSafeArea();
  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '团队详情',
    });
  });
  const [showTeam, setShowTeam] = useState(false);
  const teamList = useMemo(() => {
    return (detail?.teamMembers || []).map((v) => {
      return (
        <ListItem
          className={styles.affirmSheetItem}
          key={v.id}
          img={v.doctorImage ? v.doctorImage : `${IMAGE_DOMIN}/mdt/ys2.png`}
          title={v.doctorName}
          subtitle={v.doctorLevel}
          text={
            <View>
              <Text>{v.hospitalName || ''}</Text>&nbsp;|&nbsp;
              <Text>{v.deptName || ''}</Text>
            </View>
          }
          footer={
            <View>
              <View className={styles.memo}>
                擅长：{v.doctorSpecialty || ''}
              </View>
              <Button
                type={'primary'}
                className={styles.doctor_gap}
                size="small"
                block={false}
                ghost
                onTap={() => {
                  storage.set('teamInfo', JSON.stringify(v));
                  navigateTo({
                    url: `/pages4/booking/team/expert`,
                  });
                  setShowTeam(false);
                }}
              >
                专家详情
              </Button>
            </View>
          }
        />
      );
    });
  }, [detail.teamMembers]);

  return (
    <View className={styles.page} style={{ paddingBottom: 300 }}>
      <View>
        <Space className={styles.detail_top} size={20}>
          <PreviewImage
            url={
              detail.avatarImage
                ? detail.avatarImage
                : `${IMAGE_DOMIN}/mdt/user_icon.png`
            }
            className={styles.user_icon}
          />
          <View className={styles.detail_top_right}>
            <Text className={styles.right_name}>{detail.teamName || ''}</Text>
            <Space className={styles.top_right_bottom} alignItems="center">
              {detail?.hospitalLevel ? (
                <Text className={styles.border_hos_name}>
                  {detail?.hospitalLevel}
                </Text>
              ) : (
                <></>
              )}
              <Text>{detail?.hospitalName}</Text>
            </Space>
          </View>
        </Space>
        <View className={styles.detail_content}>
          <View className={styles.inner_content}>
            <View className={styles.item_gap}>
              <ShowTitle title="病种名称">
                <Text>{detail.diseaseType || ''}</Text>
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle title="出诊时间">
                <View>
                  {(detail.visitSlot || []).map((i, index) => {
                    return (
                      <View key={index} className={styles.itemvalue}>
                        星期{WEEKS[+i.week - 1]} {`${i.startTime}~${i.endTime}`}
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
                    onTap={() => {
                      setShowTeam(true);
                      // navigateTo({
                      //   url: `/pages4/booking/team/expert`,
                      // });
                    }}
                  >
                    <Text>查看详情</Text>
                  </View>
                }
              >
                {detail.teamMembers?.length ? (
                  <ScrollView>
                    <Space size={40}>
                      {(detail.teamMembers || []).map((userItem, index) => (
                        <Space
                          className={styles.user_list}
                          key={index}
                          size={10}
                        >
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
                        </Space>
                      ))}
                    </Space>
                  </ScrollView>
                ) : (
                  <NoData />
                )}
              </ShowTitle>
            </View>
            {/* <View className={styles.item_gap}>
              <ShowTitle title="团队简介">
                <View className={styles.contentBody}>{detail?.summary}</View>
              </ShowTitle>
            </View> */}
            <View className={styles.item_gap}>
              <ShowTitle title="团队介绍">
                <RichText nodes={detail?.intro || ''} />
              </ShowTitle>
            </View>
            {!isdetail && (
              <Space vertical style={{ paddingBottom: bottomHeight + 50 }}>
                {[MODE.线下, MODE.全部].includes(detail.mode) && (
                  <Button
                    type="primary"
                    className={styles.btn_box}
                    onTap={() => {
                      navigateTo({
                        url: `/pages4/booking/agreement/index?teamId=${detail?.id}`,
                      });
                    }}
                  >
                    预约线下会诊
                  </Button>
                )}
                {[MODE.线上, MODE.全部].includes(detail.mode) && (
                  <Button type="primary" className={styles.btn_box}>
                    预约线上会诊
                  </Button>
                )}
              </Space>
            )}
          </View>
        </View>
      </View>
      {showTeam && (
        <AfirmSheet
          onClose={() => {
            setShowTeam(false);
          }}
        >
          {teamList}
        </AfirmSheet>
      )}
    </View>
  );
};
