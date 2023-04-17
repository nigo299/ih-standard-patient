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
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
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
  const platformTitle = PLATFORM === 'ali' ? '支付宝小程序' : '微信公众号';
  const platformPayTitle = PLATFORM === 'ali' ? '支付宝支付' : '微信支付';
  const { getPatientList, defaultPatientInfo } = patientState.useContainer();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
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

      <Mask
        show={show2}
        center
        close={() => {
          setShow2(false);
        }}
      >
        <Space vertical className={styles.popup}>
          <View className={styles.popupTop}>
            <Image
              src={`${IMAGE_DOMIN}/nucleic/hsjcxz.png`}
              className={styles.popupImg}
              mode="aspectFit"
            />
          </View>
          <Space flex="auto" vertical className={styles.popupWrap}>
            <View className={styles.bold}>亲爱的市民朋友：</View>
            <View className={styles.popupText}>
              自助核酸检测服务为我院针对新冠筛查人群提供的在线预约服务，请仔细阅读本须知：
            </View>
            <View className={styles.bold}>
              1.我院检测时间：24小时采集（
              <ColorText>
                咨询服务电话：023-65748366；咨询时间：8:00-17:30
              </ColorText>
              ）
            </View>
            <View className={styles.bold}>2.核酸报告时限：</View>

            <View className={styles.popupText}>
              ①8:01-12:00 采样的标本，报告时限为 18:00 前；
            </View>

            <View className={styles.popupText}>
              ②12:01-17:00 采样的标本，报告时限为 24:00 前；
            </View>

            <View className={styles.popupText}>
              ③17:01-22:00 采样的标本，报告时限为次日 8:00前；
            </View>

            <View className={styles.popupText}>
              ④22:01-8:00 采样的标本,报告时限为次日 14：00前。
            </View>

            <View className={styles.popupText}>
              <ColorText>
                *因核酸检测标本存在复查、审核等情况，若您有出行计划请等核酸报告出具后再行安排；我院同时承接大规模核酸采集任务，疫情期间报告时限以实际出具时间为准，谢谢您的理解与配合。
              </ColorText>
            </View>

            <View className={styles.bold}>3.核酸结果查看：</View>

            <View className={styles.popupText}>
              电子报告：关注“重庆沙坪坝区妇幼保健院”微信公众号，绑定就诊人信息，实时查看门诊报告结果
              纸质报告：请于门诊工作时间内凭检测者本人身份证前往重庆沙坪坝区妇幼保健院A栋门诊一楼大厅，在自助机上打印报告。
            </View>
            <View className={styles.bold}>4.核酸采集流程</View>
            <View className={styles.bold}>愿检尽检人群：</View>
            <View className={styles.popupText}>
              {platformTitle}
              选择“自助核酸检测开单”——选择检测类别（单检/混检）——线上预约缴费（仅支持
              {platformPayTitle}
              ）——现场出示缴费凭证（就诊人登记号/二维码）——核酸采集点打印条码——采样
            </View>
            <View className={styles.bold}>应检尽检人群（无码/黄码人群）：</View>
            <View className={styles.popupText}>
              {platformTitle}
              选择“自助核酸检测开单”——选择检测类别（单检无码/黄码）——线上预约缴费（仅支持
              {platformPayTitle}
              ）——现场出示缴费凭证（就诊人登记号/二维码）——发热门诊采集点打印条码——采样
            </View>
            <View className={styles.bold}>5.温馨提示：</View>
            <View className={styles.popupText}>
              为了做好疫情防控，请您配合工作人员测量体温，出示“健康码”、“行程码”，扫描“场所码”，全程有序排队，佩戴口罩，保持1米社交距离，避免人群聚集。
              因出国需要双语报告者请主动告知工作人员。
            </View>
          </Space>
          <Space className={styles.popupBtns}>
            <Space
              justify="center"
              alignItems="center"
              flex="auto"
              className={styles.cacelBtn}
              onTap={() => {
                setShow2(false);
              }}
            >
              不接受
            </Space>
            <Space
              justify="center"
              alignItems="center"
              flex="auto"
              className={styles.popupBtn}
              onTap={() => {
                const selectNucle = data?.data?.items?.filter(
                  (item: NucleType) => item.resourceId === resourceId,
                );
                if (selectNucle?.[0]?.nucleicName) {
                  const {
                    nucleicName,
                    endTime,
                    startTime,
                    resourceId,
                    regFee,
                  } = selectNucle[0];
                  setShow2(false);

                  navigateTo({
                    url: `/pages2/nucleic/confirm/index?patientId=${defaultPatientInfo?.patientId}&nucleicName=${nucleicName}&resourceId=${resourceId}&endTime=${endTime}&startTime=${startTime}&regFee=${regFee}`,
                  });
                }
              }}
            >
              <ColorText>接受</ColorText>
            </Space>
          </Space>
        </Space>
      </Mask>
      <Space className={styles.top} alignItems="flex-start">
        <Space alignItems="center">
          <Image src={`${IMAGE_DOMIN}/logo.jpg`} className={styles.logo} />
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

            {/* <Space
              alignItems="center"
              justify="center"
              className={styles.tip2}
              onTap={() => {
                setShow2(true);
                hideTabBar();
              }}
            >
              点击查看<ColorText>《检测须知》</ColorText>
            </Space> */}
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
            setShow2(true);
          }}
        >
          下一步
        </Button>
      </Space>
    </View>
  );
};
