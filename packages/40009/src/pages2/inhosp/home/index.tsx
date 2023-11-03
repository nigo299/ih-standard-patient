import React, { useCallback, useState } from 'react';
import { View, Image, navigateTo, navigateBack, redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Space,
  FormItem,
  Form,
  Shadow,
  BackgroundImg,
  Icon,
  showToast,
  ColorText,
} from '@kqinfo/ui';
import showModal from '@/utils/showModal';
import inhospState from '@/stores/inhosp';
import patientState from '@/stores/patient';
import { IMAGE_DOMIN } from '@/config/constant';
import useApi, { InhospPatientType } from '@/apis/inhosp';
import classNames from 'classnames';
import useGetParams from '@/utils/useGetParams';
import styles from 'commonHis/src/pages2/inhosp/home/index.less';
import reportCmPV from '@/alipaylog/reportCmPV';
import { reLaunchUrl } from '@/utils';

export default () => {
  const {
    defaultPatientInfo: { patientId: defaPatientId },
  } = patientState.useContainer();
  const { patientId } = useGetParams<{ patientId: string }>();
  const { setInhospPatientInfo } = inhospState.useContainer();
  const [liveData, setLiveData] = useState<InhospPatientType>();
  const [form] = Form.useForm();
  const getInhospPatientInfo = useCallback(async () => {
    const { data, code } = await useApi.查询住院信息
      .request({
        patientId: defaPatientId || patientId,
      })
      .catch((data) => {
        if (data?.data?.data === null) {
          showModal({
            title: '提示',
            content: '未查询到住院信息, 请重新选择就诊人!',
          }).then(({ confirm }) => {
            if (confirm) {
              redirectTo({
                url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/inhosp/home/index',
              });
            } else {
              navigateBack();
            }
          });
        }
      });
    if (code === 0 && data?.patientName) {
      setInhospPatientInfo(data);
      setLiveData(data);
    } else {
      showModal({
        title: '提示',
        content: '未查询到住院信息, 请重新选择就诊人!',
      }).then(({ confirm }) => {
        if (confirm) {
          redirectTo({
            url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/inhosp/home/index',
          });
        } else {
          navigateBack();
        }
      });
    }
  }, [defaPatientId, patientId, setInhospPatientInfo]);
  usePageEvent('onShow', () => {
    reportCmPV({ title: '住院押金' });
    setNavigationBar({
      title: '住院服务',
    });
    if (!defaPatientId && !patientId) {
      showModal({
        title: '提示',
        content: '未查询到患者信息, 请先添加就诊人!',
      }).then(({ confirm }) => {
        if (confirm) {
          navigateTo({
            url: '/pages2/usercenter/add-user/index?pageRoute=/pages2/inhosp/home/index',
          });
        } else {
          reLaunchUrl('/pages/home/index');
        }
      });
      return;
    }
    getInhospPatientInfo();
  });

  return (
    <View className={styles.page}>
      <Space className={styles.wrap} vertical>
        <View className={styles.banner} />
        <BackgroundImg
          className={styles.card}
          img={`${IMAGE_DOMIN}/inhosp/kqbj.png`}
        >
          <View className={styles.inner}>
            <Space
              className={styles.avatars}
              justify="center"
              alignItems="center"
            >
              <Image
                src={`${IMAGE_DOMIN}/inhosp/avatar.png`}
                mode="aspectFit"
                className={styles.avatar}
              />
            </Space>
            <View className={classNames(styles.userInfo, styles.ml)}>
              {liveData?.patientName || '未知'}
              <Space
                onTap={() => {
                  redirectTo({
                    url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/inhosp/home/index',
                  });
                }}
                className={styles.qh}
                justify="center"
                alignItems="center"
              >
                <Image
                  src={`${IMAGE_DOMIN}/inhosp/qh.png`}
                  mode="aspectFit"
                  className={styles.change}
                />
              </Space>
            </View>
            <View className={classNames(styles.userInfo)}>
              住院号：{liveData?.admissionNum}
            </View>
            <Space className={styles.flex} alignItems={'flex-end'}>
              <Space
                vertical
                alignItems={'center'}
                justify={'center'}
                style={{ flex: 1 }}
                size={20}
              >
                <View className={styles.count}>
                  {(Number(liveData?.totalFee || 0) / 100).toFixed(2)}
                </View>
                <View className={styles.desc}>花费总费</View>
              </Space>
              <View className={styles.line} />
              <Space
                vertical
                alignItems={'center'}
                justify={'center'}
                style={{ flex: 1 }}
                size={20}
              >
                <View className={styles.count}>
                  {(Number(liveData?.balance || 0) / 100).toFixed(2)}
                </View>
                <View className={styles.desc}>押金余额</View>
              </Space>
            </Space>
          </View>
        </BackgroundImg>
        <Form form={form}>
          <Space vertical size={25}>
            <Shadow card>
              <FormItem
                className={styles.formItem}
                label={'病床号'}
                labelWidth={'4em'}
                cell
              >
                <ColorText fontWeight={600} className={styles.itemCell}>
                  {liveData?.bedNo || '暂无'}
                </ColorText>
              </FormItem>
            </Shadow>
            <Shadow card>
              <FormItem
                className={styles.formItem}
                label={'住院科室'}
                labelWidth={'4em'}
                cell
              >
                <ColorText fontWeight={600} className={styles.itemCell}>
                  {liveData?.deptName || '暂无'}
                </ColorText>
              </FormItem>
            </Shadow>
            <Shadow card>
              <FormItem
                className={styles.formItem}
                label={'押金预缴'}
                labelWidth={'4em'}
                cell
                after={<Icon name={'kq-right'} color={'#666'} />}
                onTap={() => {
                  if (liveData?.status !== '1') {
                    showToast({
                      icon: 'none',
                      title: '您不是住院病人!',
                    }).then(() => navigateBack());
                    return;
                  }
                  navigateTo({
                    url: `/pages2/inhosp/deposit/index?patientId=${
                      defaPatientId || patientId
                    }`,
                  });
                }}
              />
            </Shadow>
            <Shadow card>
              <FormItem
                className={styles.formItem}
                label={'住院费用清单'}
                cell
                after={<Icon name={'kq-right'} color={'#666'} />}
                onTap={() => {
                  if (liveData?.status !== '1') {
                    showToast({
                      icon: 'none',
                      title: '您不是住院病人!',
                    }).then(() => navigateBack());
                    return;
                  }
                  navigateTo({
                    url: `/pages2/inhosp/inventory/index?patientId=${
                      defaPatientId || patientId
                    }`,
                  });
                }}
              />
            </Shadow>
            <Shadow card>
              <FormItem
                className={styles.formItem}
                label={'住院评价(如您遇到问题请告诉我们)'}
                cell
                after={<Icon name={'kq-right'} color={'#666'} />}
                onTap={() => {
                  if (liveData?.status !== '1') {
                    showToast({
                      icon: 'none',
                      title: '您不是住院病人!',
                    }).then(() => navigateBack());
                    return;
                  }
                  window.location.href =
                    'https://cqkuanren.wjx.cn/vm/QgdlW0f.aspx';
                }}
              />
            </Shadow>
          </Space>
        </Form>
      </Space>
    </View>
  );
};
