import React from 'react';
import { View, Image, navigateTo, redirectTo } from 'remax/one';
import { Icon, Space } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
// import useApi from '@/apis/common';
import usePatientApi from '@/apis/usercenter';
import useGetParams from '@/utils/useGetParams';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { 待签到列表查询 } from '@/apis/sign';
import styles from './index.less';
import { PatGender } from '@/config/dict';

// interface RecordType {
//   beginTime: string;
//   deptCode: string;
//   deptName: string;
//   doctorCode: string;
//   doctorName: string;
//   endTime: string;
//   nullah_number: string;
//   orderSource: string;
//   patCardNo: string;
//   expectTime: string;
//   patientId: string;
//   payTime: string;
//   regFee: string;
//   scheduleDate: string;
//   status: string;
//   timeFlag: string;
//   checkstatus: string;
//   deptLocation: string;
// }

export default () => {
  const { patCardNo, patientId } = useGetParams<{
    patCardNo: string;
    patientId: string;
  }>();

  // const [bluetooth] = useState('');
  // const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  const {
    // request,
    data: { data },
  } = 待签到列表查询({
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
    // needInit: false,
  });
  const {
    data: { data: userInfo },
  } = usePatientApi.查询就诊人详情({
    initValue: {
      data: { data: {} },
    },
    params: {
      patientId,
      idFullTransFlag: '1',
    },
    // needInit: false,
    needInit: !!patientId,
  });
  // useEffect(() => {
  //   console.log('!patientId || !patCardNo', patientId, patCardNo);
  //   if (!patientId || !patCardNo) {
  //     redirectTo({
  //       url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/signin/list/index',
  //     });
  //   }
  // }, [patCardNo, patientId]);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '签到记录',
    });
    console.log('!patientId || !patCardNo', patientId, patCardNo);
    if (!patientId || !patCardNo) {
      redirectTo({
        url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/signin/list/index',
      });
    }
  });

  return (
    // onTap={() => buletoothEvent()}
    <View className={styles.page}>
      <Space
        justify="space-between"
        alignItems="center"
        className={styles.date}
      >
        <View>{dayjs().format('YYYY年MM月DD日')}</View>
        {/* <Picker
          mode={'date'}
          onChange={(v) => {
            setSelectDate(String(v));
            request({
              transformCode: 'KQ00012',
              patientId: patCardNo,
              date: String(v),
            });
          }}
          start={dayjs().format('YYYY-MM-DD')}
          end={dayjs().add(30, 'day').format('YYYY-MM-DD')}
        >
          {() => (
            <Space
              justify="center"
              alignItems="center"
              className={styles.switch}
            >
              切换日期
            </Space>
          )}
        </Picker> */}
      </Space>
      <View className={styles.list}>
        {data?.map((item) => (
          <View key={item.patId} className={styles.item}>
            <View className={styles.left}>
              <View className={styles.top}>
                <View className={styles.name}>{userInfo?.patientName}</View>
                <View className={styles.sex}>
                  {PatGender[userInfo?.patientSex] || ''}
                </View>
                |<View className={styles.age}>{userInfo?.patientAge}</View>
                <View className={styles.type}>
                  {/* {selectDate === dayjs().format('YYYY-MM-DD')
                    ? '当日挂号'
                    : '预约挂号'} */}
                  当日挂号
                </View>
              </View>
              <View className={styles.info}>
                <View className={styles.label}>就诊信息:</View>
                <View className={styles.val}>{`${item?.doctorName}`}</View>
              </View>
              <View className={styles.info}>
                <View className={styles.label}>就诊时间:</View>
                <View className={styles.val}>{item?.scheduleDate}</View>
              </View>
              <View className={styles.tip}>
                <Icon
                  name={'kq-tip'}
                  size={'18px'}
                  color={'#E181A9'}
                  className={styles.tipIcon}
                />
                <View>如果需要退号，请到线下挂号窗口退号</View>
              </View>
            </View>
            <View
              className={classNames(styles.right, {
                [styles.status2]: item.status === 1,
              })}
              onTap={() => {
                if (item.status === 0) {
                  // signLocation();
                  const url = `/pages2/signin/detail/index?hisOrdNum=${
                    item.hisOrdNum
                  }&patName=${userInfo?.patientName}&doctorName=${
                    item.doctorName
                  }&patCardNo=${userInfo?.patCardNo}&payTime=${
                    item.payTime
                  }&location=${item.deptName}&districtCode=${
                    item.districtCode || ''
                  }`;

                  navigateTo({
                    url,
                  });
                }
              }}
            >
              {item.status === 0 && '立即签到'}
              {item.status === 1 && '已签到'}
            </View>
          </View>
        ))}
      </View>
      {(!data || data?.length === 0) && (
        <View className={styles.noData}>
          <Image
            className={styles.noDataImage}
            src={`${IMAGE_DOMIN}/signin/noData.png`}
            mode="widthFix"
          />
          <View className={styles.noDataText1}>当前没有可签到的记录！</View>
          <View className={styles.noDataText2}>
            若您有今日实际有预约，请前往分诊台进行处理
          </View>
        </View>
      )}
    </View>
  );
};
