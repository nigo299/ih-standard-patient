import React, { memo, useState, useCallback } from 'react';
import { View, Text, navigateBack, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Space,
  Shadow,
  Button,
  Form,
  FormItem,
  Switch,
  showToast,
  Exceed,
} from '@kqinfo/ui';
import useApi from '@/apis/usercenter';
import useGetParams from '@/utils/useGetParams';
import classNames from 'classnames';
import { MediCardS, HealthCard, WhiteSpace } from '@/components';
import patientState from '@/stores/patient';
import styles from './index.less';
import { IDTYPES, PLATFORM } from '@/config/constant';
import showModal from '@/utils/showModal';
import { PatGender } from '@/config/dict';
import { useHisConfig } from '@/hooks';

const tabs = [
  { content: '就诊卡', index: 1 },
  { content: '电子健康卡', index: 2 },
];

export default memo(() => {
  const { config } = useHisConfig();
  const { bindPatientList, defaultPatientInfo, setDefaultPatientInfo } =
    patientState.useContainer();
  const { patientId, tab = '1' } = useGetParams<{
    patientId: string;
    tab: string;
  }>();
  const [form] = Form.useForm();
  const {
    request: getUserInfoRequest,
    data: { data: userInfo },
  } = useApi.查询就诊人详情({
    initValue: {
      data: { data: {} },
    },
    params: {
      patientId,
      idFullTransFlag: '1',
    },
    // needInit: !!patientId,
  });
  const {
    request,
    data: { data: jkkInfo, msg: errorMsg },
  } = useApi.查询电子健康卡详情({
    initValue: {
      data: { qrCodeText: '', address: '' },
    },
    params: {
      patientId,
    },
    needInit: tab === '2',
  });
  const [selectTab, setSelectTab] = useState(Number(tab));
  const unBindPatient = useCallback(async () => {
    const { code } = await useApi.解绑就诊人.request({ patientId });
    if (code === 0) {
      if (
        bindPatientList.length === 1 &&
        bindPatientList[0].patientName === defaultPatientInfo.patientName
      ) {
        setDefaultPatientInfo({
          ...defaultPatientInfo,
          patientName: '',
          patCardNo: '',
          patientFullIdNo: '',
        });
      }
      showToast({
        title: '删除就诊人成功!',
        icon: 'success',
      }).then(() => navigateBack());
    }
  }, [bindPatientList, defaultPatientInfo, patientId, setDefaultPatientInfo]);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '就诊人详情',
    });
    getUserInfoRequest();
  });
  return (
    <View className={styles.userinfo}>
      <Space justify="flex-end" alignItems="center" className={styles.checks}>
        <View className={styles.title}>默认就诊人</View>
        <Switch
          fontSize={PLATFORM === 'web' ? 10 : 20}
          value={userInfo.isDefault === 1}
          onChange={(val) => {
            if (val && userInfo.isDefault !== 1) {
              useApi.设置默认就诊人
                .request({
                  patientId: userInfo.patientId,
                })
                .then((res) => {
                  if (res.code === 0) {
                    showToast({
                      icon: 'success',
                      title: '设置默认就诊成功',
                      duration: 2000,
                    }).then(() => getUserInfoRequest());
                  }
                });
            } else {
              showToast({
                icon: 'none',
                title: '您已是默认就诊人!',
              });
            }
          }}
        />
      </Space>

      <Shadow
        card
        style={{
          padding: 0,
        }}
      >
        <Space vertical className={styles.cards}>
          <View className={styles.tab}>
            {tabs.map(({ content, index }, i) => (
              <React.Fragment key={index}>
                <View
                  className={classNames(styles.item, {
                    [styles.active]: selectTab === index,
                  })}
                  onTap={() => {
                    if (index === 2 && !jkkInfo?.healthCardId) {
                      request();
                    }
                    setSelectTab(index);
                  }}
                >
                  {content}
                </View>
                {i !== tabs.length - 1 && tabs.length === 2 && (
                  <View
                    className={styles.slice}
                    style={{
                      background: selectTab
                        ? `linear-gradient(${
                            selectTab === 1 ? 248 : -248
                          }deg, #EDF8F9 50%, #fff 50%)`
                        : `#EDF8F9`,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          <Space vertical alignItems="center" className={styles.card}>
            {selectTab === 1 ? (
              <MediCardS
                patientId={userInfo?.patientId}
                patCardNo={userInfo?.[config?.patCardNoValue] || ''}
                patientName={userInfo?.patientName}
                isDetail={true}
              />
            ) : (
              <HealthCard
                patientName={userInfo?.patientName}
                idNo={userInfo?.idNo}
                qrCode={jkkInfo?.qrCodeText}
                patCardNo={userInfo?.patCardNo || ''}
                healthCardId={jkkInfo?.healthCardId}
                errorMsg={!jkkInfo ? errorMsg : ''}
              />
            )}
            <Text className={styles['card__tip']}>
              就诊时出示二维码(点击二维码放大查看)
            </Text>
          </Space>
        </Space>
      </Shadow>

      <Shadow card>
        <Form form={form} labelCls={styles.listLabel}>
          <Space vertical>
            <Space className={styles.list}>
              <FormItem label="性别" labelWidth={'4em'} />
              <View className={styles.listText}>
                {PatGender[userInfo?.patientSex] || ''}
              </View>
            </Space>
            <Space className={styles.list}>
              <FormItem label="出生日期" labelWidth={'4em'} />
              <View className={styles.listText}>
                {userInfo?.birthday?.slice(0, 10)}
              </View>
            </Space>
            <Space className={styles.list}>
              <FormItem
                label={
                  IDTYPES.find(
                    (item) => item.dictKey === String(userInfo?.idType),
                  )?.dictValue + '号' || '身份证号'
                }
                labelWidth={'4em'}
              />
              <View className={styles.listText}>
                {userInfo?.idNo === ' ' ? '无证件建档' : userInfo?.idNo}
              </View>
            </Space>
            <Space className={styles.list}>
              <FormItem label="手机号" labelWidth={'4em'} />
              <View className={styles.listText}>{userInfo?.patientMobile}</View>
            </Space>
            <Space className={styles.list}>
              <FormItem label="地址" labelWidth={'4em'} />
              <Exceed className={styles.listText}>
                <Text>{userInfo?.patientAddress || '暂无'}</Text>
                {/* {selectTab === 1 && (
                  <Text>{userInfo?.patientAddress || '暂无'}</Text>
                )}
                {selectTab === 2 && (
                  <Text>
                    {jkkInfo?.address && jkkInfo?.address !== ' '
                      ? jkkInfo?.address
                      : '暂无'}
                  </Text>
                )} */}
              </Exceed>
            </Space>
          </Space>
        </Form>
      </Shadow>
      <Button
        type={'primary'}
        bold
        className={styles.button}
        onTap={() =>
          navigateTo({
            url: `/pages2/usercenter/revise-user/index?patientId=${userInfo.patientId}`,
          })
        }
      >
        修改个人信息
      </Button>
      <WhiteSpace />
      <Button
        type={'primary'}
        ghost
        bold
        onTap={() => {
          showModal({
            title: '提示',
            content: '是否确认删除就诊人?',
          }).then(({ confirm }) => {
            if (confirm) {
              unBindPatient();
            }
          });
        }}
      >
        删除就诊人
      </Button>
    </View>
  );
});
