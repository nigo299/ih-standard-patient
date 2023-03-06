import React, { useCallback, useState } from 'react';
import { View, Image, Text, redirectTo, navigateTo } from '@remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { IMAGE_DOMIN } from '@/config/constant';
import { Space, showToast } from '@kqinfo/ui';
import styles from './index.less';
import inhospState from '@/stores/inhosp';
import patientState from '@/stores/patient';
import useApi, { InhospPatientType } from '@/apis/inhosp';
import useGetParams from '@/utils/useGetParams';

export default () => {
  const {
    defaultPatientInfo: { patientId: defaPatientId },
  } = patientState.useContainer();
  const { patientId } = useGetParams<{ patientId: string }>();
  const { setInhospPatientInfo } = inhospState.useContainer();
  const [liveData, setLiveData] = useState<InhospPatientType>();
  const getInhospPatientInfo = useCallback(async () => {
    const { data, code } = await useApi.查询住院信息.request({
      patientId: defaPatientId || patientId,
    });
    if (code === 0 && data.patientName) {
      setInhospPatientInfo(data);
      setLiveData(data);
    } else {
      showToast({
        icon: 'none',
        title: '未查询到住院信息, 请重新选择就诊人!',
      });
    }
  }, [defaPatientId, patientId, setInhospPatientInfo]);
  usePageEvent('onShow', () => {
    if (!defaPatientId && !patientId) {
      redirectTo({
        url: '/pages3/usercenter/select-user/index?pageRoute=/pages3/inhosp/home/index&jumpPage=home',
      });
    }
    getInhospPatientInfo();
    setNavigationBar({
      title: '住院服务',
    });
  });
  return (
    <View className={styles.main}>
      <View className={styles.top} />
      <View className={styles.box}>
        <View className={styles.content}>
          <View className={styles.user}>
            <View className={styles.avatar}>
              <Image
                className={styles.avatarImg}
                src={`${IMAGE_DOMIN}/inhosp/jzr.png`}
              />
            </View>
            <View className={styles.titleBox}>
              <View className={styles.userName}>
                {liveData?.patientName || '未知'}
              </View>
              <View className={styles.titleContent}>
                <View className={styles.titleLabel}>住院号：</View>
                <View className={styles.titleName}>
                  {liveData?.admissionNum}
                </View>
              </View>
              <View className={styles.titleContent}>
                <View className={styles.titleLabel}>
                  科&nbsp;&nbsp;&nbsp;室：
                </View>
                <View className={styles.titleName}>{liveData?.deptName}</View>
              </View>
            </View>
          </View>
          <View className={styles.mainContent}>
            <Space size={20}>
              <View className={styles.mainBox}>
                <Space size={44} vertical alignItems="center">
                  <Text className={styles.mainLeftTitle}>
                    {liveData?.bedNo || '暂无'}
                  </Text>
                  <Text className={styles.mainLeftName}>病床号</Text>
                </Space>
              </View>
              <View style={{ flex: 1 }}>
                <Space size={20} vertical>
                  <View className={styles.mainRightBox}>
                    <Space
                      size={16}
                      alignItems={'center'}
                      vertical
                      justify="center"
                    >
                      <Text className={styles.mainRightTitle}>
                        ¥{(Number(liveData?.totalFee || 0) / 100).toFixed(2)}
                      </Text>
                      <Text className={styles.mainRightName}>花费总额(元)</Text>
                    </Space>
                  </View>
                  <View className={styles.mainRightBox}>
                    <Space
                      size={16}
                      alignItems={'center'}
                      vertical
                      justify="center"
                    >
                      <Text className={styles.mainRightTitle}>
                        ¥{(Number(liveData?.balance || 0) / 100).toFixed(2)}
                      </Text>
                      <Text className={styles.mainRightName}>押金余额(元)</Text>
                    </Space>
                  </View>
                </Space>
              </View>
            </Space>
          </View>
          <View
            className={styles.btn}
            onTap={() => {
              if (liveData?.status !== '1') {
                showToast({
                  icon: 'none',
                  title: '您不是住院病人!',
                });
                return;
              }
              navigateTo({
                url: `/pages3/inhosp/deposit/index?`,
              });
            }}
          >
            押金预缴
          </View>
        </View>
        <View className={styles.bottom}>
          <Space size={20} justify={'center'}>
            <View className={styles.bottomBox}>
              <Space
                vertical
                size={46}
                alignItems={'center'}
                justify={'center'}
              >
                <Text className={styles.bottomTitle}>住院费用清单</Text>
                <View
                  className={styles.bottomBtn}
                  onTap={() => {
                    if (!liveData?.patientName) {
                      showToast({
                        icon: 'none',
                        title: '您不是住院病人!',
                      });
                      return;
                    }
                    navigateTo({
                      url: '/pages3/inhosp/inventory/index',
                    });
                  }}
                >
                  点击查看
                </View>
              </Space>
            </View>
            <View className={styles.bottomBox}>
              <Space
                vertical
                size={46}
                alignItems={'center'}
                justify={'center'}
              >
                <Text className={styles.bottomTitle}>住院缴费记录</Text>
                <View
                  className={styles.bottomBtn}
                  onTap={() => {
                    if (!liveData?.patientName) {
                      showToast({
                        icon: 'none',
                        title: '您不是住院病人!',
                      });
                      return;
                    }
                    navigateTo({
                      url: '/pages3/inhosp/order-list/index',
                    });
                  }}
                >
                  点击查看
                </View>
              </Space>
            </View>
          </Space>
        </View>
        <View
          className={styles.changeBtn}
          onTap={() =>
            redirectTo({
              url: '/pages3/usercenter/select-user/index?pageRoute=/pages3/inhosp/home/index',
            })
          }
        >
          <Image
            src={`${IMAGE_DOMIN}/home/switch-old.png`}
            className={styles.switchImg}
            mode="aspectFit"
          />
          <Text>切换就诊人</Text>
        </View>
      </View>
    </View>
  );
};
