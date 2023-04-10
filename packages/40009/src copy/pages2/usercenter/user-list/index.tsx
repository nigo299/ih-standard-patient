import React, { memo, useCallback, useState } from 'react';
import { View, Text, navigateTo, redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import useGetParams from '@/utils/useGetParams';
import { Space, Shadow, QrCode, Form, FormItem } from '@kqinfo/ui';
import { PatientType } from '@/apis/usercenter';
import patientState from '@/stores/patient';
import { QrCodeModal, Tip } from '@/components';
import { IDTYPES, THEME_COLOR2 } from '@/config/constant';
import styles from './index.less';

export default memo(() => {
  const { pageRoute } = useGetParams<{
    pageRoute: string;
  }>();
  const [form] = Form.useForm();
  const { bindPatientList, getPatientList, setDefaultPatientInfo } =
    patientState.useContainer();
  const [show, setShow] = useState(false);
  const [selectPatient, setSelectPatient] = useState({
    patientName: '',
    patCardNo: '',
  });

  const onCardClick = useCallback(
    (patient: PatientType) => {
      // 首页点进来直接切换默认就诊人
      if (pageRoute) {
        setDefaultPatientInfo(patient);
        redirectTo({
          url: `${pageRoute}?patientId=${patient?.patientId}`,
        });
      } else {
        navigateTo({
          url: `/pages2/usercenter/user-info/index?patientId=${patient?.patientId}`,
        });
      }
    },
    [pageRoute, setDefaultPatientInfo],
  );

  usePageEvent('onShow', () => {
    getPatientList();
    setNavigationBar({
      title: '就诊人列表',
    });
  });
  return (
    <Form className={styles.userlist} form={form}>
      {bindPatientList?.length >= 1 &&
        bindPatientList.map((patient) => (
          <Space
            className={styles.card}
            key={patient.patientId}
            onTap={() => onCardClick(patient)}
            vertical
          >
            <Space justify="space-between" alignItems="center">
              <FormItem
                label={patient?.patientName}
                labelWidth="3.75em"
                colon={false}
                className={styles['card__title']}
              />
            </Space>
            <View className={styles['card__subtitle']}>
              NO.{patient?.patCardNo}
            </View>
            <Space justify="space-between" alignItems="flex-end">
              <Space vertical>
                <Space className={styles['card__text']}>
                  <FormItem label="手机号" labelWidth={'4em'} />
                  {patient?.patientMobile}
                </Space>
                <Space>
                  <FormItem
                    label={
                      IDTYPES.find(
                        (item) => item.dictKey === String(patient?.idType),
                      )?.dictValue + '号' || '身份证号'
                    }
                    labelWidth={'4em'}
                  />
                  {patient?.idNo}
                </Space>
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
                  content={patient.patCardNo || ''}
                  className={styles.qrcodeImg}
                />
              </Space>
            </Space>

            {patient.isDefault === 1 && (
              <Space
                justify="center"
                alignItems="center"
                className={styles.defaultTag}
              >
                默认就诊人
              </Space>
            )}
          </Space>
        ))}

      {bindPatientList?.length < 5 && (
        <Shadow card>
          <Space
            justify="flex-start"
            className={styles.add}
            onTap={() =>
              navigateTo({
                url: '/pages2/usercenter/add-user/index',
              })
            }
          >
            <Space className={styles.addWrap} />
            <Space vertical justify="center" className={styles.addItem}>
              <View className={styles['add__title']}>添加就诊人</View>
              <View className={styles['add_subtitle']}>
                {`您还可添加 ${5 - bindPatientList.length} 人`}
              </View>
            </Space>
          </Space>
        </Shadow>
      )}

      <Tip
        className={styles.tip}
        items={[
          <View key={'tip'} className={styles.tipText}>
            一个账号
            <Text style={{ color: THEME_COLOR2 }}>最多只能五位就诊人</Text>
            ，如果已有五位就诊人，则需要删除以后才能绑定新的就诊人。
          </View>,
        ]}
      />

      <QrCodeModal
        show={show}
        name={`${selectPatient?.patientName} | ${selectPatient?.patCardNo}`}
        content={selectPatient?.patCardNo}
        close={() => setShow(false)}
      />
    </Form>
  );
});
