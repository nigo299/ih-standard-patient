import React, { memo, useCallback, useState } from 'react';
import { View, Text, navigateTo, navigateBack } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import { Space, QrCode, FormItem, Button, showToast } from '@kqinfo/ui';
import useApi, { PatientType } from '@/apis/usercenter';
import patientState from '@/stores/patient';
import { QrCodeModalOld } from '@/components';
import styles from './index.less';
import classNames from 'classnames';

export default memo(() => {
  const { pageRoute, jumpPage = 'back' } = useGetParams<{
    pageRoute: string;
    jumpPage: 'back' | 'home';
  }>();
  const { bindPatientList, getPatientList, setDefaultPatientInfo } =
    patientState.useContainer();
  const [show, setShow] = useState(false);
  const [selectPatient, setSelectPatient] = useState({
    patientName: '',
    patCardNo: '',
  });
  const setDefaultPatient = useCallback(
    async (patient: PatientType) => {
      const { code, msg } = await useApi.设置默认就诊人.request({
        patientId: patient.patientId,
      });
      if (code === 0) {
        showToast({
          title: msg || '设置成功',
          icon: 'success',
        });
        getPatientList();
        navigateTo({
          url: `${pageRoute}?patientId=${patient?.patientId}`,
        });
      }
    },
    [getPatientList, pageRoute],
  );
  const onCardClick = useCallback(
    (patient: PatientType) => {
      // 首页点进来直接切换默认就诊人
      if (pageRoute) {
        setDefaultPatientInfo(patient);
        setDefaultPatient(patient);
        // if (PLATFORM === 'web') {
        //   redirectTo({
        //     url: `${pageRoute}?patientId=${patient?.patientId}`,
        //   });
        // } else {
        //   reLaunch({
        //     url: `${pageRoute}?patientId=${patient?.patientId}`,
        //   });
        // }
      } else {
        navigateTo({
          url: `/pages3/usercenter/user-info/index?patientId=${patient?.patientId}`,
        });
      }
    },
    [pageRoute, setDefaultPatient],
  );
  usePageEvent('onShow', () => {
    getPatientList();
    setNavigationBar({
      title: '选择就诊人',
    });
  });
  return (
    <View className={styles.page}>
      {bindPatientList?.length >= 1 &&
        bindPatientList.map((patient) => (
          <Space
            className={classNames(styles.card, {
              [styles.default]: patient.isDefault === 1,
            })}
            key={patient.patientId}
            onTap={() => onCardClick(patient)}
            justify="space-between"
            alignItems="center"
          >
            <Space vertical size={20}>
              <Space>
                <FormItem
                  label="就诊人"
                  labelWidth={'3em'}
                  className={styles.text}
                  labelCls={styles.text}
                />
                {patient?.patientName}
              </Space>
              <Space>
                <FormItem
                  label="就诊号"
                  labelWidth={'3em'}
                  className={styles.text}
                  labelCls={styles.text}
                />
                {patient?.patCardNo}
              </Space>
              {patient.isDefault === 1 ? (
                <Space alignItems="center" className={styles.defaultTag}>
                  <View className={styles.circle} />
                  <Text>当前默认就诊人</Text>
                </Space>
              ) : (
                <View
                  className={styles.defaultText}
                  onTap={() => setDefaultPatient(patient)}
                >
                  点击切换默认就诊人
                </View>
              )}
            </Space>

            <Space
              className={styles.qrcode}
              onTap={(e) => {
                e.stopPropagation();
                setSelectPatient(patient);
                setShow(true);
              }}
              justify="center"
              alignItems="center"
            >
              <QrCode
                content={patient.patCardNo}
                className={styles.qrcodeImg}
              />
            </Space>
          </Space>
        ))}
      {/* <View className={styles.tip}>注：你可累计注册/绑定5个</View> */}
      {bindPatientList.length < 5 && (
        <Space
          vertical
          className={classNames({
            [styles.footer]: bindPatientList.length <= 3,
          })}
        >
          <Space justify="space-between" className={styles.btns}>
            <Button
              type="primary"
              block={false}
              className={styles.btn}
              onTap={() =>
                navigateTo({
                  url: `/pages3/usercenter/select-adduser/index?patientType=0&jumpPage=${jumpPage}`,
                })
              }
            >
              <Text>
                添加<Text className={styles.btnText}>成人</Text>就诊人
              </Text>
            </Button>
            <Button
              type="primary"
              block={false}
              className={classNames(styles.btn, styles.btn2)}
              onTap={() =>
                navigateTo({
                  url: `/pages3/usercenter/select-adduser/index?patientType=1&jumpPage=${jumpPage}`,
                })
              }
            >
              <Text>
                添加<Text className={styles.btnText}>儿童</Text>就诊人
              </Text>
            </Button>
          </Space>
          <Button type="primary" ghost elderly onTap={() => navigateBack()}>
            点击返回
          </Button>
        </Space>
      )}
      <QrCodeModalOld
        show={show}
        name="电子就诊卡"
        content={selectPatient.patCardNo}
        close={() => setShow(false)}
      />
    </View>
  );
});
