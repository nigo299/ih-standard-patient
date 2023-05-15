import React, { useMemo } from 'react';
import { View, Image, navigateTo } from 'remax/one';
import { Button, Shadow, Space, Tag, Tip } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import usePatientApi from '@/apis/usercenter';
import useGetParams from '@/utils/useGetParams';
import dayjs from 'dayjs';
import useApi from '@/apis/common';
import styles from './index.less';
import { decrypt } from 'commonHis/src/utils';

export default () => {
  const { patCardNo, patientId, patHisNo } = useGetParams<{
    patCardNo: string;
    patientId: string;
    patHisNo: string;
  }>();
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
    needInit: !!patientId,
  });
  // todo 需要修改
  const { data: ghList } = useApi.透传字段({
    params: {
      transformCode: 'KQ00012',
      hisId: '2219',
      patId: patHisNo,
      patCardNo: patCardNo,
    },
    initValue: { data: { data: [] } },
    needInit: !!patHisNo,
  });
  const { data: jcList } = useApi.透传字段({
    params: {
      transformCode: 'KQ00015',
      hisId: '2219',
      cardNo: patHisNo,
      cardType: '0',
    },
    initValue: {
      data: {
        data: {
          RequestInfoList: [],
        },
      },
    },
    needInit: !!patHisNo,
  });
  const { data: jyList } = useApi.透传字段({
    params: {
      transformCode: 'KQ00018',
      hisId: '2219',
      patId: patHisNo,
      patCardNo: patCardNo,
    },
    initValue: { data: { data: [] } },
    needInit: !!patHisNo,
  });
  const listArr = useMemo(() => {
    const arr: any[] = [];
    ghList?.data?.data?.forEach((item: any) => {
      arr.push({
        ...item,
        type: 'gh',
      });
    });
    jcList?.data?.data?.RequestInfoList?.forEach((item: any) => {
      arr.push({
        ...item,
        type: 'jc',
      });
    });
    jyList?.data?.data?.forEach((item: any) => {
      arr.push({
        ...item,
        type: 'jy',
      });
    });
    return arr;
  }, [ghList, jcList, jyList]);

  const canTap = (item: any) => {
    switch (item.type) {
      case 'jc':
        return ['1', '5'].includes(item?.RequestInfo?.examState + '');
      case 'jy':
        return true;
      case 'gh':
        return ['0', '1'].includes(item?.status + '');
    }
  };

  const selectPath = (item: any) => {
    console.log(encodeURI(JSON.stringify(item)));
    switch (item.type) {
      case 'jc':
        return `pages2/signin/signin/index?oldSignIn=${encodeURI(
          JSON.stringify({
            PatientInfo: jcList?.data?.data?.PatientInfo,
            RequestInfoList: [item],
          }),
        )}`;
      case 'jy':
        return `/pages2/signin/signinJy/index?no=${patHisNo}&oldSignIn=${encodeURI(
          JSON.stringify(item),
        )}`;
      case 'gh':
        return `/pages2/signin/signinReg/index?oldSignIn=${encodeURI(
          JSON.stringify(item),
        )}`;
      default:
        return '';
    }
  };

  // const listArr: any[] = [
  //   {
  //     type: 'gh',
  //     beginTime: '15:00',
  //     endTime: '15:30',
  //     deptName: '增肌课',
  //     doctorName: '十多万',
  //     status: '1',
  //     patGender: '2',
  //     patAge: 22,
  //     scheduleDate: '2022-12-12',
  //     patName: '啊啊啊'
  //   },
  //   {
  //     type: 'gh',
  //     beginTime: '15:00',
  //     endTime: '15:30',
  //     deptName: '增肌课',
  //     doctorName: '十多万',
  //     patGender: '2',
  //     patAge: 22,
  //     scheduleDate: '2022-12-12',
  //     patName: '啊啊啊'
  //   },
  //   {
  //     type: 'jy',
  //     patName: '啊啊啊',
  //     status: '1',
  //     createTime: '2022-12-22 13:12',
  //     deptName: '增肌课',
  //     doctorName: '十多万'
  //   },
  //   {
  //     type: 'jc',
  //     name: '啊啊啊',
  //     age: 22,
  //     sex: '2',
  //     dept: '科室',
  //     RequestInfo: {
  //       examState: '1',
  //       AppointmentInfo: {
  //         appointmentDate: '2201-12-22',
  //         appointmentTime: '16:22'
  //       }
  //     }
  //   },
  //   {
  //     type: 'jc',
  //     name: '啊啊啊',
  //     age: 22,
  //     sex: '2',
  //     dept: '科室',
  //     RequestInfo: {
  //       examState: '8',
  //       AppointmentInfo: {
  //         appointmentDate: '2201-12-22',
  //         appointmentTime: '16:22'
  //       }
  //     }
  //   }
  // ];

  return (
    <View className="page-chosePatient-index">
      <Space
        className={styles.head}
        alignItems={'center'}
        justify={'space-between'}
      >
        <Space alignItems={'center'} size={20}>
          <Image
            src={`${IMAGE_DOMIN}/signin/man.png`}
            className={styles.imgSty}
          />
          {!patCardNo && <Space style={{ color: '#fff' }}>无默认就诊人</Space>}
          <Space vertical size={10}>
            <Space className={styles.nameSty}>
              {decrypt(userInfo?.encryptPatientName || '')}
            </Space>
            <Space className={styles.mobileSty}>{userInfo?.patHisNo}</Space>
          </Space>
        </Space>
        <Button
          className={styles.kqBtn}
          onTap={() => {
            if (patientId) {
              navigateTo({
                url: `/pages2/usercenter/select-user/index?pageRoute=/pages2/signin/list/index`,
              });
            }
          }}
        >
          {patientId ? '切换就诊人 >' : '+ 添加就诊人'}
        </Button>
      </Space>
      <View className="list">
        {listArr.map((item) => {
          return (
            <Shadow key={item.scheduleDate}>
              <div className="item">
                <Space className="ListItem" vertical size={15}>
                  <Space
                    alignItems={'center'}
                    size={15}
                    className={styles.itemName}
                  >
                    {item.type === 'jc' ? item?.name : item.patName}
                    {item.type !== 'jy' && (
                      <Space alignItems={'center'} size={5}>
                        {item.type === 'jc'
                          ? Number(item?.sex) === 1
                            ? '男'
                            : '女'
                          : Number(item?.patGender) === 0
                          ? '女'
                          : '男'}{' '}
                        | {`${item.type === 'jc' ? item?.age : item.patAge}岁`}
                      </Space>
                    )}
                    <Tag color={'#D95E38'} ghost className={styles.tagSty}>
                      {item.type === 'jc'
                        ? '检查签到'
                        : item.type === 'gh'
                        ? '挂号签到'
                        : '检验签到'}
                    </Tag>
                  </Space>
                  <Space alignItems={'center'}>
                    <Space className={styles.itemTitle}>就诊信息：</Space>
                    <Space className={styles.itemContent}>
                      {item.type !== 'jc'
                        ? `${item?.deptName} | ${item?.doctorName}`
                        : item?.dept}
                    </Space>
                  </Space>
                  <Space>
                    <Space className={styles.itemTitle}>
                      {item.type === 'gh' ? '签到时间' : '开单时间'}：
                    </Space>
                    {item.type === 'gh' && (
                      <Space className={styles.itemContent}>
                        {/*{`${item?.scheduleDate} ${item?.beginTime}~${item?.endTime}`}*/}
                        {`${item?.scheduleDate} ${item?.beginTime}`}
                      </Space>
                    )}
                    {item.type === 'jy' && (
                      <Space className={styles.itemContent}>
                        {item?.createTime}
                      </Space>
                    )}
                    {item.type === 'jc' && (
                      <Space className={styles.itemContent}>
                        {`${dayjs(
                          item?.RequestInfo?.AppointmentInfo?.appointmentDate,
                        ).format('YYYY-MM-DD')}
                        ${item?.RequestInfo?.AppointmentInfo?.appointmentTime}`}
                      </Space>
                    )}
                  </Space>
                  {item.type !== 'jc' && item?.visitPosition && (
                    <Space>
                      <Space className={styles.itemTitle}>签到位置：</Space>
                      <Space className={styles.itemContent}>
                        {item?.visitPosition}
                      </Space>
                    </Space>
                  )}
                </Space>
                {canTap(item) && (
                  <div className="weapp">
                    <Tag
                      className="btn"
                      onTap={() => {
                        navigateTo({ url: selectPath(item) });
                      }}
                    >
                      去签到
                    </Tag>
                  </div>
                )}
                {!canTap(item) && (
                  <div className="weapp">
                    <Tag color={'#999999'}>
                      {item.type === 'jc'
                        ? '已签到'
                        : item?.status === '4'
                        ? '已取消'
                        : '已签到'}
                    </Tag>
                  </div>
                )}
              </div>
            </Shadow>
          );
        })}
      </View>
      <Tip
        style={{
          paddingLeft: '10px',
        }}
        title="温馨提示"
        items={['1.请选择实际预约就诊人', '2.请在规定的时间内进行签到']}
      />
    </View>
  );
};
