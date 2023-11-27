import React, { memo, useCallback, useState } from 'react';
import { View, Image, navigateTo, redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import { Space, Shadow, FormItem, PartTitle, Button } from '@kqinfo/ui';
import { PatientType } from '@/apis/usercenter';
import patientState from '@/stores/patient';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import styles from 'commonHis/src/pages2/usercenter/select-user/index.less';
import classNames from 'classnames';
import { PatGender } from '@/config/dict';
import { decrypt } from 'commonHis/src/utils';
// import patientState from '@/stores/patient';
export default memo(() => {
  const { setFaceInfo } = patientState.useContainer();
  const { pageRoute, checkMedical } = useGetParams<{
    pageRoute: string;
    checkMedical?: string;
  }>();
  const {
    bindPatientList,
    getPatientList,
    setDefaultPatientInfo,
    defaultPatientInfo,
    setSelectPatientInfo,
  } = patientState.useContainer();
  const [selectPatient, setSelectPatient] = useState({
    ...defaultPatientInfo,
  });
  const onCardClick = useCallback(
    async (patient: PatientType) => {
      const url = `${pageRoute}?patientId=${patient?.patientId}&patCardNo=${patient.patCardNo}&patHisNo=${patient.patHisNo}`;
      // 首页点进来直接切换默认就诊人
      if (pageRoute) {
        if (defaultPatientInfo.patientId === patient.patientId) {
          redirectTo({
            url,
          });
          return;
        }
        setDefaultPatientInfo(patient);
        redirectTo({
          url,
        });
      }
      if (checkMedical) {
        if (PLATFORM === 'ali') {
          setSelectPatientInfo(patient);
          navigateTo({
            url: '/pages/mine/index/index?faceVerify=1',
          });
          return;
        }
        setSelectPatientInfo(patient);
        setFaceInfo({
          idNo: decrypt(patient?.encryptIdNo) as string,
          name: decrypt(patient?.encryptPatientName) as string,
          success: false,
          checkMedical: true,
        });
        navigateTo({
          url: '/pages2/usercenter/face-verify/index',
        });
        return;
      }
    },
    [
      checkMedical,
      defaultPatientInfo.patientId,
      pageRoute,
      setDefaultPatientInfo,
      setFaceInfo,
      setSelectPatientInfo,
    ],
  );

  usePageEvent('onShow', () => {
    if (!defaultPatientInfo?.patCardNo) {
      getPatientList().then((res) => {
        res.map((item) => {
          if (item.isDefault === 1) {
            setSelectPatient(item);
          }
        });
      });
    } else {
      getPatientList(false, false);
    }

    setNavigationBar({
      title: '选择就诊人',
    });
  });
  return (
    <View className={styles.page}>
      <PartTitle bold>请选择就诊人</PartTitle>
      <View className={styles.content}>
        {bindPatientList?.length >= 1 &&
          bindPatientList.map((patient) => (
            <Space
              className={classNames(styles.card, {
                [styles.active]: selectPatient.patCardNo === patient.patCardNo,
              })}
              key={patient.patientId}
              vertical
              onTap={() => {
                setSelectPatient(patient);
              }}
            >
              <Space className={styles.name} size={40}>
                <FormItem
                  label={patient?.patientName}
                  labelWidth={'3em'}
                  colon={false}
                  style={{
                    color: 'inherit',
                  }}
                />
                {`${PatGender[patient.patientSex] || ''} | ${
                  patient.patientAge
                }岁`}
              </Space>
              <Space
                className={classNames(styles.text, {
                  [styles.active]:
                    selectPatient.patCardNo === patient.patCardNo,
                })}
                size={40}
              >
                <FormItem
                  label="就诊号"
                  labelWidth={'3em'}
                  colon={false}
                  style={{
                    color: 'inherit',
                  }}
                />

                {patient?.patCardNo}
              </Space>
              <Image
                src={`${IMAGE_DOMIN}/usercenter/bg.png`}
                mode="aspectFit"
                className={styles.cardImg}
              />
            </Space>
          ))}

        {bindPatientList?.length < 5 && (
          <Shadow card>
            <Space
              justify="center"
              alignItems="center"
              vertical
              className={styles.add}
              onTap={() =>
                navigateTo({
                  url: '/pages2/usercenter/add-user/index',
                })
              }
            >
              <Space className={styles.addWrap} />
              <View className={styles.addText}>添加就诊人</View>
            </Space>
          </Shadow>
        )}
      </View>
      <View
        className={classNames(styles.button, {
          [styles.button2]: bindPatientList.length > 3,
        })}
      >
        <Button
          type="primary"
          onTap={() => onCardClick(selectPatient)}
          disabled={bindPatientList.length === 0}
        >
          确定
        </Button>
      </View>
    </View>
  );
});
