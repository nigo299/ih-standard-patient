import React from 'react';
import { View, navigateTo, navigateBack, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Button, Form, FormItem, PartTitle } from '@kqinfo/ui';
import useApi from '@/apis/usercenter';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';
import { WhiteSpace, Tip } from '@/components';
import { IDTYPES, IMAGE_DOMIN } from '@/config/constant';
import { PatGender } from '@/config/dict';
export default () => {
  const { patientId } = useGetParams<{ patientId: string }>();
  const [form] = Form.useForm();
  const {
    request,
    data: { data: userInfo },
  } = useApi.查询就诊人详情({
    initValue: {
      data: { data: {} },
    },
    params: {
      patientId,
      idFullTransFlag: '1',
    },
  });
  usePageEvent('onShow', () => {
    if (patientId) {
      request();
    }
    setNavigationBar({
      title: '修改个人信息',
    });
  });
  return (
    <View className={styles.page}>
      <PartTitle bold>就诊人信息</PartTitle>
      <WhiteSpace />
      <Form form={form}>
        <Form
          cell
          labelWidth="4em"
          requiredMark={false}
          childrenCls={styles.children}
          labelCls={styles.label}
        >
          <FormItem
            label={'姓名'}
            name="patientName"
            className={styles.disabled}
          >
            <View>{userInfo?.patientName}</View>
          </FormItem>
          <FormItem
            label={'证件类型'}
            name="parentIdType"
            className={styles.disabled}
          >
            <View>
              {IDTYPES.find((item) => item.dictKey === String(userInfo?.idType))
                ?.dictValue || '身份证'}
            </View>
          </FormItem>
          <FormItem
            label={
              IDTYPES.find((item) => item.dictKey === String(userInfo?.idType))
                ?.dictValue + '号' || '身份证号'
            }
            name="idNo"
            className={styles.disabled}
          >
            <View>{userInfo?.idNo}</View>
          </FormItem>
        </Form>
        <WhiteSpace />

        <Form
          cell
          labelWidth="4em"
          requiredMark={false}
          childrenCls={styles.children}
          labelCls={styles.label}
        >
          <FormItem label={'出生日期'} name="birthday">
            <View>{userInfo?.birthday?.slice(0, 10)}</View>
          </FormItem>
          <FormItem label={'性别'} name="sex">
            <View>{PatGender[userInfo?.patientSex] || ''}</View>
          </FormItem>
          <FormItem
            label={'手机号'}
            name="patientMobile"
            childrenCls={styles.children2}
            after={
              <Image
                src={`${IMAGE_DOMIN}/usercenter/right.png`}
                className={styles.icon}
              />
            }
            onTap={() =>
              navigateTo({
                url: `/pages2/usercenter/revise-user-phone/index?patientId=${patientId}`,
              })
            }
          >
            <View>{userInfo.patientMobile}</View>
          </FormItem>
          <FormItem
            label={'地址'}
            name="patientAddress"
            childrenCls={styles.children2}
            after={
              <Image
                src={`${IMAGE_DOMIN}/usercenter/right.png`}
                className={styles.icon}
              />
            }
            onTap={() =>
              navigateTo({
                url: `/pages2/usercenter/revise-user-address/index?patientId=${patientId}&patientAddress=${
                  userInfo?.patientAddress || ''
                }`,
              })
            }
          >
            <View>{userInfo?.patientAddress || '暂无'}</View>
          </FormItem>
        </Form>

        {userInfo?.parentIdNo && (
          <>
            <PartTitle bold className={styles.partTitle}>
              监护人信息
            </PartTitle>
            <Form
              cell
              labelWidth="4em"
              requiredMark={false}
              childrenCls={styles.children}
              labelCls={styles.label}
            >
              <FormItem
                label={'姓名'}
                name="parentName"
                className={styles.disabled}
              >
                <View>{userInfo?.parentName}</View>
              </FormItem>
              <FormItem
                label={'证件类型'}
                name="parentIdType"
                className={styles.disabled}
              >
                <View>
                  {IDTYPES.find(
                    (item) => item.dictKey === String(userInfo?.parentIdType),
                  )?.dictValue || '身份证'}
                </View>
              </FormItem>
              <FormItem
                label={
                  IDTYPES.find(
                    (item) => item.dictKey === String(userInfo?.parentIdType),
                  )?.dictValue + '号' || '身份证号'
                }
                name="parentIdNo"
                className={styles.disabled}
              >
                <View>{userInfo?.parentIdNo}</View>
              </FormItem>
            </Form>
          </>
        )}
        <Tip
          className={styles.tip}
          items={[
            <View key={'tip'} className={styles.tipText}>
              <View>1.手机号、地址可修改</View>
              <View>2.手机号修改次数90天内不可超过3次</View>
            </View>,
          ]}
        />
        <Button
          type="primary"
          bold
          className={styles.button}
          onTap={() => navigateBack()}
        >
          提交
        </Button>
      </Form>
    </View>
  );
};
