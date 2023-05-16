import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Image } from 'remax/one';
import styles from './index.less';
import { Tip } from '@kqinfo/ui';
import useGeolocation from './useGeolocation';
import useCommonApi from '@/apis/common';
import Dots from 'commonHis/src/components/dots';
import { getAuthCode, getLocation } from 'remax/ali';
import { useApi, PatientInfo, RequestInfoListItem, SigninResp } from '../apis';
import useGetParams from 'commonHis/src/utils/useGetParams';
import { IMAGE_DOMIN } from '@/config/constant';

export default () => {
  const { beaconsRef, isBtFail } = useGeolocation();
  const { oldSignIn } = useGetParams<{
    oldSignIn: string;
  }>();

  const [openId, setOpenId] = useState('');
  const { data: config } = useApi.医院签到配置({
    params: { districtCode: 'ZY00000002', hisId: '2219' },
  });
  const signinType = useMemo(() => {
    return config?.data?.bluetoothStatus;
    // return 1;
  }, [config]); // 1是蓝牙签到。0是GPS签到

  useEffect(() => {
    getAuthCode({
      success: async (result: my.IGetAuthCodeSuccessResult) => {
        const res = await useCommonApi.透传字段.request({
          //获取支付宝小程序的鉴权信息
          transformCode: 'KQ00066',
          authToken: String(result.authCode),
        });
        setOpenId(res?.data?.userId || '');
      },
    });
  }, []);

  const [signIn] = useState<
    | { PatientInfo: PatientInfo; RequestInfoList: RequestInfoListItem[] }
    | undefined
  >(() => {
    try {
      // const str = storage.get('signIn') || '';
      // return JSON.parse(typeof str === 'string' ? str : String(str));
      return JSON.parse(
        decodeURI(typeof oldSignIn === 'string' ? oldSignIn : ''),
      );
    } catch (error) {
      // nothing
    }
  });

  const info = useMemo(() => {
    if (!signIn) {
      return [];
    }
    return [
      {
        key: 'name1',
        label: '就诊人',
        value: `${signIn.PatientInfo.name} ${signIn.PatientInfo.patientID}`,
      },
      {
        key: 'name3',
        label: '检查项目',
        value: signIn.RequestInfoList[0].RequestInfo.defaultModality,
      },
      {
        key: 'name5',
        label: '签到时间',
        value: `${signIn.RequestInfoList[0].RequestInfo.AppointmentInfo.appointmentDate} ${signIn.RequestInfoList[0].RequestInfo.AppointmentInfo.appointmentTime}`,
      },
      {
        key: 'name6',
        label: '打卡位置',
        value: signIn.RequestInfoList[0].dept,
      },
    ];
  }, [signIn]);

  const [stop, setStop] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const [resp, setResp] = useState<SigninResp>();

  useEffect(() => {
    if (!signIn || !openId || stop) {
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(async () => {
      let param;
      let res: any;
      if (signinType) {
        if (!beaconsRef.current.length) {
          return;
        }
        param = {
          blueTooth: {
            sectionName: 'bb', // 院区名称（bb,sqs）,
            deptName: signIn.RequestInfoList[0].RequestInfo.execDepartmentName,
            // deptName: '签到围栏',
            deviceId: openId,
            // deviceId: 'oRG8p40qVrlE3ZDURV-9FT0pfbm4',
            did: beaconsRef.current,
            // did: [{ id: '00004E26F0ED', rssi: -65 }],
            map: [
              { value: '1918FC80B1113441A9ACB1001C2FE510', key: '0000' },
              { value: 'FDA50693A4E24FB1AFCFC6EB07647825', key: '0001' },
            ],
          },
          signIn,
        };
        res = await useCommonApi.透传字段.request({
          // todo 蓝牙检查签到
          transformCode: 'KQ00016',
          ...param,
        });
        if ([0, -10, -1].includes(res.code)) {
          setStop(true);
        }
        setResp(res);
      } else {
        await getLocation({
          async success(r) {
            param = {
              GPS: {
                sectionName: 'bb',
                userLng: String(r.longitude),
                userLat: String(r.latitude),
                districtLng: config?.data?.districtLng,
                districtLat: config?.data?.districtLat,
                signInRange: String(config?.data?.signInRange),
              },
              signIn,
              // dev: '1'
            };
            res = res = await useCommonApi.透传字段.request({
              // todo GPS检查签到
              transformCode: 'KQ00017',
              ...param,
            });
            if ([0, -10, -1].includes(res.code)) {
              setStop(true);
            }
            setResp(res);
          },
        });
      }
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [signIn, openId, stop, beaconsRef, signinType, config]);

  const bordInfo = useMemo(() => {
    if (isBtFail) {
      return {
        tag: '蓝牙未开启',
        title: (
          <View>
            位置搜索中
            <Dots />
          </View>
        ),
        tips: '请打开蓝牙搜索位置',
      };
    }
    if (!resp) {
      return {
        tag: '未签到',
        title: (
          <View>
            位置搜索中
            <Dots />
          </View>
        ),
        tips: ' 您还未到达预约科室签到地点，到达后系统将自动签到（如您已到达预约科室未自动签到，请咨询 分诊处）',
      };
    }
    if (resp.code === 0) {
      return {
        tag: '',
        title: '签到成功',
        tips: '',
      };
    }
    if (resp.code === -10 || resp.code === -1) {
      return {
        tag: '',
        title: '签到失败',
        tips: '签到失败，请前往分诊处处理！',
      };
    }
    return {
      tag: '未签到',
      title: (
        <View>
          位置搜索中
          <Dots />
        </View>
      ),
      tips: ' 您还未到达预约科室签到地点，到达后系统将自动签到（如您已到达预约科室未自动签到，请咨询分诊处）',
    };
  }, [isBtFail, resp]);
  return (
    <View className={styles.page}>
      <View className={styles.banner}>
        <Image
          className={styles.bannerImage}
          src={`${IMAGE_DOMIN}/signin/banner@2x.png`}
          mode="aspectFit"
        />
      </View>
      <View className={styles.board}>
        <Image
          className={styles.boardImage}
          src={`${IMAGE_DOMIN}/signin/dzgl@2x.png`}
          mode="aspectFit"
        />
        <View className={styles.boardInfo}>
          <View className={styles.boardInfoTitle}>
            {bordInfo.tag && (
              <View className={styles.boardInfoTitleTag}>{bordInfo.tag}</View>
            )}
            <View className={styles.boardInfoTitleText}>{bordInfo.title}</View>
          </View>
          <View className={styles.boardInfoTips}>{bordInfo.tips}</View>
        </View>
        <Image
          className={styles.boardPin}
          src={`${IMAGE_DOMIN}/signin/xj@2x.png`}
          mode="aspectFit"
        />
      </View>

      {signIn && (
        <View className={styles.info}>
          <View className={styles.infoTitle}>
            <Image
              className={styles.infotitleImg}
              src={`${IMAGE_DOMIN}/signin/jzrjl@2x.png`}
              mode="aspectFit"
            />
            <View className={styles.infotitleText}>您的预约记录</View>
          </View>
          {info.map((item) => {
            return (
              <View className={styles.infoItem} key={item.key}>
                <View className={styles.infoItemLabel}>
                  {item.label.split('').map((char) => {
                    return <View key={char}>{char}</View>;
                  })}
                </View>
                <View className={styles.infoItemGap}>:</View>
                <View className={styles.infoItemValue}>{item.value}</View>
              </View>
            );
          })}
        </View>
      )}

      {!signIn && (
        <View className={styles.info}>
          <View className={styles.infoTitle}>
            <Image
              className={styles.infotitleImg}
              src={`${IMAGE_DOMIN}/signin/jzrjl@2x.png`}
              mode="aspectFit"
            />
            <View className={styles.infotitleText}>您的预约记录</View>
          </View>
          <View className={styles.infoErrorTips}>
            <View className={styles.infoErrorTips1}>获取信息失败</View>
            <View className={styles.infoErrorTips2}>关闭小程序</View>
            <View className={styles.infoErrorTips3}>
              重新点击我院微信公众号“就诊服务” 的“院内签到”按钮
            </View>
          </View>
        </View>
      )}
      <View className={styles.tips}>
        <Tip
          items={[
            '1、为保证定位准确，请开启手机蓝牙功能。',
            '2、签到成功后排队显示屏上会显示您的名字，请在候诊区等待呼叫，如果显示屏上没有您的名字，请确认您的检查楼层、位置是否正确，到正确的楼层去排队。',
            '3、签到后注意屏幕呼叫摄片，一旦过号会排到队列最后，且不会自动恢复排队，请联系摄片技师恢复排队。',
          ]}
        />
      </View>
    </View>
  );
};
