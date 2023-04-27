import React, { useState } from 'react';
import { View, Image, navigateTo, redirectTo } from 'remax/one';
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
    request();
    if (!defaultPatientInfo?.patientName) {
      getPatientList(false).then((res) => {
        if (res.length === 0) {
          showToast({
            title: '请先添加就诊人!',
            icon: 'none',
            mask: true,
          }).then(() => {
            navigateTo({
              url: `/pages2/usercenter/add-user/index`,
            });
          });
        }
      });
    }
    setNavigationBar({
      title: '核酸检测',
    });
  });
  return (
    <View className={styles.page}>
      {loading && <Loading type={'top'} />}
      <Mask
        show={show}
        close={() => {
          setShow(false);
        }}
      >
        <Space vertical className={styles.calendar}>
          <Space justify="space-between" className={styles.calendarWrap}>
            <ColorText fontWeight={600}>日期选择</ColorText>
            <Image
              src={`${IMAGE_DOMIN}/nucleic/close.png`}
              className={styles.calendarImg}
              onTap={() => {
                setShow(false);
              }}
            />
          </Space>
          <Calendar
            listEndDay={dayjs().add(1, 'month')}
            onChange={(
              day:
                | dayjs.Dayjs
                | [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined],
            ) => {
              if (!Array.isArray(day)) {
                setSelectDate(dayjs(day).format('YYYY-MM-DD'));
                setShow(false);
              }
            }}
          />
        </Space>
      </Mask>

      <Space className={styles.top} alignItems="flex-start">
        <Space alignItems="center">
          <Image src={`${IMAGE_DOMIN}/auth/logo.png`} className={styles.logo} />
          <View>核酸检测</View>
        </Space>
      </Space>
      <Space className={styles.content} vertical>
        <Space
          className={styles.comboUser}
          justify="space-around"
          alignItems="center"
        >
          <Space
            vertical
            size={20}
            onTap={() =>
              redirectTo({
                url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/nucleic/select-combo/index',
              })
            }
            className={styles.comboUserWrap}
          >
            <Space
              className={styles.userName}
              justify="center"
              alignItems="center"
            >
              {defaultPatientInfo.patientName || '暂无'}
              <Image
                src={`${IMAGE_DOMIN}/nucleic/down.png`}
                className={styles.downImg}
              />
            </Space>
            <View className={styles.userText}>切换当前就诊人</View>
          </Space>
          <Space
            vertical
            size={20}
            // onTap={() => {
            //   setShow(true);
            // }}
            className={styles.comboUserWrap}
          >
            <Space
              className={styles.userName}
              justify="center"
              alignItems="center"
            >
              {selectDate}
              {/* <Image
                src={`${IMAGE_DOMIN}/nucleic/down.png`}
                className={styles.downImg}
              /> */}
            </Space>
            <View className={styles.userText}>预约核酸检测时间</View>
          </Space>
        </Space>
        <View className={styles.box}>
          <View className={styles.popTitle}>温馨提示：</View>
          <View className={styles.popText}>
            核酸采集点工作时间：8:00-17:30；核酸挂号缴费时间：8:00-17:00。
            号源每日08:00更新，如有需求，请提前预约。
          </View>
        </View>
        {data?.data?.items?.length > 0 ? (
          <>
            {data?.data?.items.map((item: NucleType) => {
              const { nucleicName } = item;
              return (
                <Space
                  className={classNames(styles.card, {
                    [styles.active]: resourceId === item.resourceId,
                  })}
                  key={item.resourceId}
                  onTap={() => setResourceId(item.resourceId)}
                  vertical
                  // size={30}
                  // ignoreNum={4}
                  justify="center"
                >
                  {resourceId === item.resourceId && (
                    <Image
                      src={`${IMAGE_DOMIN}/nucleic/active.png`}
                      className={styles.activeImg}
                    />
                  )}
                  <Exceed className={styles.nucleicName}>
                    {item.nucleicName}
                  </Exceed>
                  <Space alignItems="center" className={styles.regFee}>
                    <View>单价：</View>
                    <ColorText fontWeight={600}>{item?.regFee}元</ColorText>
                  </Space>
                  <View className={styles.solid} />

                  <Space alignItems="center" className={styles.itemText}>
                    <Image
                      src={`${IMAGE_DOMIN}/nucleic/wh.png`}
                      className={styles.whImg}
                    />
                    <View>
                      {nucleicName.includes('黄码') && (
                        <ColorText>健康码状态为无码、黄码人员</ColorText>
                      )}
                      {(nucleicName.includes('核酸检测（混检）') ||
                        nucleicName.includes(
                          '核酸检测（出租网约车免费）（绿码）',
                        )) &&
                        '新型冠状病毒核酸检测（混采10:1）'}

                      {nucleicName.includes('核酸检测（单检') &&
                        '自愿核酸检测人员，单人单管'}
                    </View>
                  </Space>
                  {/*<Image*/}
                  {/*  className={styles.nucleImg}*/}
                  {/*  src={*/}
                  {/*    nucleicName.includes('核酸检测（混检）（绿码')*/}
                  {/*      ? `${IMAGE_DOMIN}/nucleic/lm.png`*/}
                  {/*      : nucleicName.includes('核酸检测（黄码/无码）')*/}
                  {/*      ? `${IMAGE_DOMIN}/nucleic/hmwm.png`*/}
                  {/*      : nucleicName.includes(*/}
                  {/*          '核酸检测（出租网约车免费）（绿码）',*/}
                  {/*        )*/}
                  {/*      ? `${IMAGE_DOMIN}/nucleic/czclm.png`*/}
                  {/*      : `${IMAGE_DOMIN}/nucleic/czchm.png`*/}
                  {/*  }*/}
                  {/*/>*/}
                </Space>
              );
            })}

            <Space className={styles.tip}>
              <ColorText>*</ColorText>
              <View> 我院提供24小时核酸检测服务</View>
            </Space>
          </>
        ) : (
          <NoData />
        )}
      </Space>
      <Space className={styles.footer}>
        <Space alignItems="center" flex="auto" className={styles.footerWrap}>
          已选择<ColorText>{!!resourceId ? '1' : '0'}</ColorText>个项目
        </Space>
        <Button
          className={styles.button}
          type="primary"
          disabled={
            data?.data?.item?.length === 0 ||
            !resourceId ||
            !defaultPatientInfo.patientName
          }
          onTap={(e) => {
            e.stopPropagation();

            const selectNucle = data?.data?.items?.filter(
              (item: NucleType) => item.resourceId === resourceId,
            );
            if (selectNucle?.[0]?.nucleicName) {
              const { nucleicName, endTime, startTime, resourceId, regFee } =
                selectNucle[0];
              navigateTo({
                url: `/pages2/nucleic/confirm/index?patientId=${defaultPatientInfo?.patientId}&nucleicName=${nucleicName}&resourceId=${resourceId}&endTime=${endTime}&startTime=${startTime}&regFee=${regFee}`,
              });
            }
          }}
        >
          下一步
        </Button>
      </Space>
    </View>
  );
};
