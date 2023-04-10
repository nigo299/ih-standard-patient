import React from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { NoDataOld, SwitchPatient, DeptCardOld } from '@/components';
import useApi from '@/apis/register';
import patientState from '@/stores/patient';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';

export default () => {
  const {
    defaultPatientInfo: { patientName, patCardNo },
  } = patientState.useContainer();
  const {
    data: { data: historyData },
  } = useApi.查询历史挂号记录({
    initValue: {
      data: {
        depts: [],
        doctors: [],
      },
    },
    params: {
      patCardNo,
      size: 5,
    },
    needInit: !!patCardNo,
  });
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '历史科室',
    });
  });
  return (
    <View>
      <SwitchPatient
        patientName={patientName}
        redirectUrl="/pages3/usercenter/select-user/index?pageRoute=/pages3/register/history-depts/index"
      />
      <View className={styles.content}>
        {historyData?.depts?.length >= 1 ? (
          historyData.depts.map((doctor) => (
            <DeptCardOld
              key={doctor.name}
              deptImg={`${IMAGE_DOMIN}/register/dept-active-old.png`}
              deptName2={doctor.parentDeptName}
              deptName={doctor.name}
              deptId={doctor.deptId}
            />
          ))
        ) : (
          <NoDataOld />
        )}
      </View>
    </View>
  );
};
