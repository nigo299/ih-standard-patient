import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, Text } from 'remax/one';
import {
  DropDownMenu,
  DropDownMenuItem,
  List,
  Shadow,
  Space,
  useTitle,
} from '@kqinfo/ui';
import styles from './index.less';
import useApi, { ApplySource } from '@/apis/mdt';
import { IMAGE_DOMIN } from '@/config/constant';
import Label from '@/components/label';
import Status from './components/Status';
import patientState from '@/stores/patient';
import { PatGender } from '@/config/dict';
import dayjs from 'dayjs';
import { usePageEvent } from 'remax/macro';
import storage from '@/utils/storage';
export default () => {
  useTitle('预约记录');
  const {
    defaultPatientInfo: { patientId },
    originalBindPatientList,
    getPatientList,
  } = patientState.useContainer();
  usePageEvent('onShow', () => {
    getPatientList();
  });
  const [selectUser, setSelectUser] = useState(patientId);
  console.log('originalBindPatientList', originalBindPatientList);
  const { data: mdtStauts, loading } = useApi.线下MDT状态({
    initValue: {
      data: { data: {} },
    },
    needInit: true,
  });
  const options1 = useMemo(
    () =>
      (originalBindPatientList || []).map((item) => {
        return {
          text: item.patientName,
          value: item.patientId,
        };
      }),
    [originalBindPatientList],
  );
  const options2 = useMemo(
    () =>
      (mdtStauts?.data?.MdtOfflineStateEnum || []).map((item) => {
        return {
          text: item.desc,
          value: item.name,
        };
      }),
    [mdtStauts.data.MdtOfflineStateEnum],
  );
  const [selectState, setSelectState] = useState(options2?.[0]?.value);
  const getDoctorList = useCallback(
    (page, limit) => {
      return useApi.分页查询线下MDT列表
        .request({
          patientId: selectUser,
          mdtState: selectState,
          pageNum: page,
          numPerPage: limit,
        })
        .then((data) => {
          return {
            list: data.data?.recordList,
            pageNum: data.data?.currentPage,
            pageSize: data?.data?.numPerPage,
            total: data?.data?.totalCount || 0,
          };
        });
    },
    [selectState, selectUser],
  );
  return (
    <View className={styles.page}>
      <DropDownMenu showModal={false}>
        <DropDownMenuItem
          title="就诊人"
          value={selectUser}
          onChange={setSelectUser}
          options={options1}
        />
        <DropDownMenuItem
          title="会诊状态"
          options={options2}
          value={selectState}
          onChange={setSelectState}
        />
      </DropDownMenu>
      <View className={styles.warp}>
        <List
          getList={getDoctorList}
          renderItem={(item: any) => {
            console.log('item', item);
            return (
              <Shadow key={item.doctorId}>
                <Space className={styles.item} alignItems="center" size={20}>
                  <Space className={styles.status}>
                    <Image
                      src={`${IMAGE_DOMIN}/mdt/status.png`}
                      className={styles.icon}
                    />
                    <Text className={styles.statusTxt}>
                      {
                        (mdtStauts?.data?.MdtOfflineApplySourceEnum || []).find(
                          (obj) => obj.name === item?.applySource,
                        )?.desc
                      }
                    </Text>
                  </Space>
                  <Space vertical flex={1}>
                    <View className={styles.itemTitle}>
                      {item?.diseaseType}
                    </View>
                    <View className={styles.itemdesc}>
                      {item?.patName} {PatGender[item?.patSex]} {item.patAgeStr}
                    </View>
                    {[
                      { text: '患者ID', value: item.patientId },
                      {
                        text: '申请时间',
                        value: item.createTime
                          ? dayjs(item?.createTime).format('YYYY-MM-DD')
                          : '-',
                      },
                      { text: '会诊方式', value: '1' },
                    ].map((obj, index) => (
                      <Space className={styles.itemdesc} key={index}>
                        <Label key={index}>{obj.text}</Label>
                        <Space
                          flex={1}
                          flexWrap="wrap"
                          className={styles.value}
                        >
                          {obj.value}
                        </Space>
                      </Space>
                    ))}
                  </Space>
                  <Status status={item.mdtState} />
                </Space>
              </Shadow>
            );
          }}
        />
      </View>
    </View>
  );
};
