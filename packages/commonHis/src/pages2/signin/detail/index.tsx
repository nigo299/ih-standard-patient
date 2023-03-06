import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Tip } from '@kqinfo/ui';
import { View, Image, Text } from 'remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import cls from 'classnames';
import styles from './index.less';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import useGetParams from '@/utils/useGetParams';
import dayjs from 'dayjs';
// import useApi from '@/apis/common';
import { 发起预约签到, 待签到列表查询 } from '@/apis/sign';
import globalStore from '@/stores/global';
//1：未支付未签到 0：已支付未签到 2：已签到未接诊 3：已接诊 4：已取消)
const wx = require('weixin-js-sdk');

const StatusMap = {
  success: [2, 3],
  waitSign: [1, 0],
  cancel: [4],
};
export default () => {
  const signRequestTimer = useRef<NodeJS.Timeout>();
  const [signRequestCount, setSignRequestCount] = useState(0);
  const [signStatus, setSignStatus] = useState(0);
  const { hisOrdNum, patCardNo, patName, doctorName, districtCode } =
    useGetParams<{
      hisOrdNum: string;
      patCardNo: string;
      patName: string;
      doctorName: string;
      payTime: string;
      districtCode: string;
    }>();
  const { initWxSDK, initWechat } = globalStore.useContainer();
  // 发起预约签到;
  const { request: sendSignRequest } = 发起预约签到({ needInit: false });
  const { request: waitSignListRequest } = 待签到列表查询({
    params: {
      signFeatures: '1', //1 挂号，2 检查，3 检验
      patId: patCardNo, //病人id 挂号功能、检验功能 必传
      // deptCode?: string;
      // doctorCode?: string;
      cardType: '21', //卡类型。检查功能
      cardNo: patCardNo, //cardNo 卡号码。检查功能
      // currentStateList?: string; //要查询的当前状态（-1：已作废，0-已开立，1-已预约，2-已登记，3-已检查，4-报告已完成）。检查功能
      // stateResult?: string; //状态编码。检查功能
    },
    initValue: {
      data: [],
    },
    needInit: !!patCardNo,
  });

  const infoList = useMemo(
    () => [
      {
        label: '就诊人',
        value: `${patName} ${patCardNo}`,
      },
      {
        label: '检查科室医生',
        value: `${doctorName || ''}`,
      },
      {
        label: '签到时间',
        value: dayjs().format('YYYY-MM-DD'),
      },
      // {
      //   label: '检查位置',
      //   value: location || '',
      // },
    ],
    [doctorName, patCardNo, patName],
  );

  usePageEvent('onShow', () => {
    initWxSDK();
    setNavigationBar({
      title: '签到详情',
    });
  });

  usePageEvent('onHide', () => {
    signRequestTimer.current && window.clearTimeout(Number(signRequestTimer));
    setSignRequestCount(0);
  });
  const getNewSignStatus = useCallback(async () => {
    const dataRes = await waitSignListRequest();
    const findData = dataRes.data.find((d) => d.hisOrdNum === hisOrdNum);
    // "status": "挂号状态(1：未支付未签到 0：已支付未签到 2：已签到未接诊 3：已接诊 4：已取消)"
    const signStatusFlag = findData?.status || 0;
    if (StatusMap.waitSign.includes(signStatusFlag)) {
      signRequestTimer.current = setTimeout(() => {
        // startSign();
        setSignRequestCount(new Date().getTime());
      }, 1500);
    }
    setSignStatus(signStatusFlag);
  }, [waitSignListRequest, hisOrdNum]);
  const startSign = useCallback(() => {
    if (
      StatusMap.cancel.includes(signStatus) ||
      StatusMap.success.includes(signStatus)
    ) {
      return;
    }
    console.log(123);
    // initWxSDK()
    //   .then(() => {
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的 gps 坐标，如果要返回直接给 openLocation 用的火星坐标，可传入'gcj02'
      success: function (res: { longitude: string; latitude: string }) {
        // const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        // const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        // const speed = res.speed; // 速度，以米/每秒计
        // const accuracy = res.accuracy; // 位置精度
        console.log('getLocation-success', res);
        sendSignRequest({
          signFeatures: '1', //1 挂号，2 检查，3 检验
          signType: '2', //2=定位 1=蓝牙
          districtCode: districtCode || '40064001', //院区编码=未设计待定
          // deptCode?: string;
          // doctorCode?: string;
          hisOrdNum: hisOrdNum, //卡类型。检查功能
          lng: res.longitude + '', //经度
          lat: res.latitude + '', //维度
        })
          .then(() => {
            getNewSignStatus();
          })
          .catch(() => {
            signRequestTimer.current = setTimeout(() => {
              setSignRequestCount(new Date().getTime());
            }, 1500);
          });
      },
      fail: function (res: any) {
        console.log('getLocation-fail', res);
        signRequestTimer.current = setTimeout(() => {
          setSignRequestCount(new Date().getTime());
        }, 1500);
      },
      // });
    });
  }, [signStatus, sendSignRequest, districtCode, hisOrdNum, getNewSignStatus]);

  useEffect(() => {
    if (initWechat) {
      startSign();
    }
  }, [initWechat, startSign]);

  useEffect(() => {
    if (signRequestCount) {
      startSign();
    }
  }, [signRequestCount, startSign]);
  return (
    <View className={styles.page}>
      <View className={styles.top}>
        <Image
          className={styles.banner}
          src={`${IMAGE_DOMIN}/signin/topBg.png`}
          mode="aspectFit"
        />
        <View className={styles.pannel}>
          <View className={cls(styles.status)}>
            {/* {status === StatusMap.searching && (
              <>
                <View className={styles.searchTitle}>位置搜索中...</View>
                <View className={styles.searchText}>
                  您还未到底医院，到达后系统自动签到
                </View>
                <View className={styles.searchText}>
                  （如您已到达未自动签到，请咨询分诊处）
                </View>
              </>
            )} */}
            {StatusMap.success.includes(signStatus) && (
              <>
                <Image
                  className={styles.statusImg}
                  src={`${IMAGE_DOMIN}/signin/success.png`}
                />
                <View className={styles.successText}>签到成功</View>
              </>
            )}
            {StatusMap.waitSign.includes(signStatus) && (
              <>
                <Image
                  className={styles.statusImg}
                  src={`${IMAGE_DOMIN}/signin/fail.png`}
                />
                <View className={styles.failText}>等待签到中...</View>
              </>
            )}
            {StatusMap.cancel.includes(signStatus) && (
              <>
                <Image
                  className={styles.statusImg}
                  src={`${IMAGE_DOMIN}/signin/fail.png`}
                />
                <View className={styles.failText}>已取消...</View>
              </>
            )}
          </View>
          <View className={styles.title}>本次预约记录</View>
          <View className={styles.list}>
            {infoList.map((item) => (
              <View key={item.label} className={styles.item}>
                <View className={styles.label}>
                  {item?.label?.split('').map((w) => (
                    <View key={w}>{w}</View>
                  ))}
                </View>
                <View className={styles.value}>{item.value}</View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View className={styles.tips}>
        <Tip
          iconCls={styles.iconCls}
          iconColor={'#FF8867'}
          items={[
            <View key={1} className={styles.itemCls}>
              1、为保证定位准确，请开启手机定位功能
            </View>,
            <View key={2} className={styles.itemCls}>
              2、
              <Text className={styles.important}>
                请提前就诊时间30分钟到院签到；
              </Text>
              若超过就诊开始时间视为超时签到，签到后患者将按当前医生队列末尾；
              <Text className={styles.important}>
                上午签到终止时间为12:00，下午签到终止时间为18:00。超过签到终止时间无法签到，
              </Text>
              视为号源作废，患者可到 线下窗口进行退费。
            </View>,
            <View key={3} className={styles.itemCls}>
              3、签到成功后排队显示屏将有您的名字，请在候诊区候诊等待呼叫（如签到成功后未显示您的名字请咨询分诊处）
            </View>,
          ]}
        />
      </View>
    </View>
  );
};
