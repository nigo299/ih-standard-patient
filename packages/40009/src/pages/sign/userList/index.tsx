import React, { useCallback } from 'react';
import { navigateTo, View } from 'remax/one';
import styles from './index.less';
import patientState from '@/stores/patient';
import signState from '@/stores/sign';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { NoData, Space, Icon, Tip, Modal } from '@kqinfo/ui';
import useApi from '@/apis/common';
import useGetParams from '@/utils/useGetParams';
import { useMd5 } from '@/utils';

export default () => {
  const { refreshTime, md5 } = useGetParams<{
    refreshTime: string;
    md5: string;
  }>();

  const { bindPatientList, getPatientList } = patientState.useContainer();
  const { setSignInfo } = signState.useContainer();

  const { request } = useApi.透传字段({
    needInit: false,
  });

  const getSignList = useCallback(
    (patCardNo: string, name: string, age: string, sex: string) => {
      if (patCardNo) {
        request({
          patCardNo,
          transformCode: 'KQ00068',
        }).then((res) => {
          if (res?.data?.data?.recordList?.length === 0) {
            navigateTo({ url: '/pages/sign/list/index' });
          } else {
            setSignInfo(res?.data?.data?.recordList?.[0]);
            navigateTo({
              url: `/pages/sign/sign/index?name=${name}&age=${age}&sex=${
                sex === 'F' ? '女' : '男'
              }`,
            });
          }
        });
      }
    },
    [request, setSignInfo],
  );

  // useEffect(() => {
  //   if (shouldGet) getPatientList();
  // }, [getPatientList, shouldGet]);

  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '选择就诊人',
    });
    if (md5 && refreshTime) {
      console.log(useMd5(refreshTime), 'useMd5(refreshTime)');
      const newRefreshTime = Number(refreshTime);
      const nowTime = new Date().getTime();
      if (
        md5 !== useMd5(refreshTime) ||
        (nowTime - newRefreshTime) / 1000 > 120
      ) {
        Modal.show({
          title: '提示',
          content: '该二维码已过期，请扫描最新的二维码',
          footer: null,
          maskClosable: false,
        });
      } else {
        getPatientList();
      }
    }
  });

  return (
    <View className={styles.pageUrmUsrLst}>
      <Modal />
      <View>
        {bindPatientList?.length >= 1 &&
          bindPatientList.map((v) => (
            <Space
              className={styles.userItem}
              key={v.id}
              alignItems={'center'}
              justify={'space-between'}
              onTap={() =>
                getSignList(
                  v.patCardNo,
                  v.patientName,
                  String(v.patientAge || '0'),
                  v.patientSex,
                )
              }
            >
              <Space vertical size={20}>
                <View>
                  <span className={styles.userName}>{v.patientName}</span>
                </View>
                <View className={styles.userPatCardNo}>{v.patCardNo}</View>
              </Space>
              <Icon name={'kq-right'} />
            </Space>
          ))}
      </View>
      {bindPatientList?.length === 0 && <NoData />}
      <Tip
        className={styles.tip}
        items={[
          '1.请选择实际就诊开方的就诊人',
          '2.请在支付处方费用后，再进行取药排队',
          '3.若实际就诊人不在就诊人列表中，请通过现场自助终端进行取药排队',
        ]}
      />
    </View>
  );
};
