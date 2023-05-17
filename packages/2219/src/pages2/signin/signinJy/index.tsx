import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image } from 'remax/one';
import styles from './index.less';
import { Tip } from '@kqinfo/ui';
import useGeolocation from '../signin/useGeolocation';
import { JyListItem, SigninResp, useApi } from '../apis';
import Dots from 'commonHis/src/components/dots';
import { getLocation } from 'remax/ali';
import { useQuery } from 'remax';
import useCommonApi from '@/apis/common';
import { IMAGE_DOMIN } from '@/config/constant';
import storage from '@/utils/storage';

export default () => {
  const { beaconsRef, isBtFail } = useGeolocation();
  const { no, oldSignIn } = useQuery();
  const { data: config } = useApi.医院签到配置({
    params: { districtCode: 'ZY00000002', hisId: '2219' },
  });
  const openId = useMemo(() => {
    return storage.get('openid') || '';
  }, []);
  const signinType = useMemo(() => {
    return config?.data?.bluetoothStatus;
    // return 1;
  }, [config]); // 1是蓝牙签到。0是GPS签到

  // useEffect(() => {
  //   getAuthCode({
  //     success: async (result: my.IGetAuthCodeSuccessResult) => {
  //       const res = await useCommonApi.透传字段.request({
  //         //获取支付宝小程序的鉴权信息
  //         transformCode: 'KQ00066',
  //         authToken: String(result.authCode),
  //       });
  //       setOpenId(res?.data?.userId || '');
  //     },
  //   });
  // }, []);

  const [signIn] = useState<JyListItem | undefined>(() => {
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
        value: signIn.patName,
      },
      {
        key: 'name2',
        label: '缴费单',
        value: signIn.orderId,
      },
      {
        key: 'name3',
        label: '就诊科室',
        value: signIn.deptName,
      },
      {
        key: 'name4',
        label: '主治医生',
        value: `${signIn.doctorName}`,
      },
      {
        key: 'name5',
        label: '缴费单时间',
        value: `${signIn.createTime}`,
      },
      {
        key: 'name5',
        label: '签到位置',
        value: `${signIn.visitPosition}`,
      },
    ];
  }, [signIn]);

  const [stop, setStop] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const [resp, setResp] = useState<SigninResp>();

  useEffect(() => {
    if (!signIn || !openId || stop) {
      console.log('return', !signIn, !openId, stop);
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(async () => {
      let params;
      let res: any;
      if (signinType) {
        if (!beaconsRef.current.length) {
          return;
        }
        params = {
          blueTooth: {
            sectionName: signIn.hospitalCode, // 院区名称（bb,sqs）,
            deptName: signIn.deptName,
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
          patId: no,
          // dev: '1',
          // position: Number(config?.data?.districtCode)
          position: 1,
        };
        res = await useCommonApi.透传字段.request({
          // todo 蓝牙检验签到
          transformCode: 'KQ00019',
          ...params,
        });
        if ([0, -10, -1].includes(res.code)) {
          setStop(true);
        }
        setResp(res);
      } else {
        getLocation({
          async success(r) {
            params = {
              GPS: {
                sectionName: signIn.hospitalCode,
                userLat: String(r.latitude),
                userLng: String(r.longitude),
                districtLng: config?.data?.districtLng,
                districtLat: config?.data?.districtLat,
                signInRange: String(config?.data?.signInRange),
              },
              signIn,
              patId: no,
            };
            res = await useCommonApi.透传字段.request({
              // todo gps检验签到
              transformCode: 'KQ00020',
              ...params,
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
  }, [signIn, openId, stop, beaconsRef, signinType, no, config]);

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
        title: (
          <View>
            位置搜索中
            <Dots />
          </View>
        ),
        tips: '签到失败，请前往分诊处处理！',
      };
    }
    return {
      tag: '未签到',
      title: '位置搜索中..',
      tips: ' 您还未到达预约科室签到地点，到达后系统将自动签到（如您已到达预约科室未自动签到，请咨询 分诊处）',
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
            '1、为保证定位准确，请开启手机蓝牙功能',
            <View key="2">
              <Text>
                2、请根据签到时间至少提前10分钟到科室指定地点签到，未按时签到患者将调整到当前时间医生队列最后；
              </Text>
              <Text style={{ color: '#D95E38' }}>
                超过签到时间30分钟以上将无法签到，号源失效，您可以将此号退费，重新预约；
              </Text>
              <Text>签到后过号患者将按当前医生队列顺延2位</Text>
            </View>,
            '3、签到成功后排队显示屏将有您的名字，请在候诊区候诊等待呼叫（如签到成功后未显示您的名字请咨询分诊处）。',
          ]}
        />
      </View>
    </View>
  );
};
