import React from 'react';
import { Tab } from '@kqinfo/ui';
import {reportCheckTabs} from '@/config/constant'
type RestProps = {
  patCardNo?: string;
  current?: string | number | undefined;
  tabIndex?: string | number;
  patHisNo?: string;
  onChange?: ((current: string | number) => void) | undefined;
  setTabIndex: (tabIndex: string | number) => void;
};

const ReportTab: React.FC<RestProps> = ({
  tabIndex,
  setTabIndex,
  patHisNo,
}) => {
  return (
    <Tab
      current={tabIndex}
      type={'card'}
      onChange={(v) => {
        if (v === 3) {
          window.location.href = `http://www.cqdent.com:9077/pad/index.html#/examRecordList?username=doctor&pwd=DJpacs@#2022$&patientId=${patHisNo}`;
        } else {
          setTabIndex(v);
        }
      }}
      tabs={reportCheckTabs}
    />
  );
};

export default ReportTab;
