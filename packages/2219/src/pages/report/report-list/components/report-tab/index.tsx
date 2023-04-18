import React from 'react';
import { Tab } from '@kqinfo/ui';

type RestProps = {
  patCardNo?: string;
  current?: string | number | undefined;
  tabIndex: string | number;
  onChange?: ((current: string | number) => void) | undefined;
  setTabIndex: (tabIndex: string | number) => void;
};

const ReportTab: React.FC<RestProps> = ({
  tabIndex,
  setTabIndex,
  patCardNo,
}) => {
  return (
    <Tab
      current={tabIndex}
      type={'card'}
      onChange={(v) => {
        if (v === 3) {
          window.location.href = `http://www.cqdent.com:9077/pad/index.html#/examRecordList?username=doctor&pwd=Cqkqyy@2022&patientId=${patCardNo}`;
        } else {
          setTabIndex;
        }
      }}
      tabs={[
        { content: '检验报告', index: 1 },
        { content: '检查报告', index: 2 },
        { content: '检查影像', index: 3 },
      ]}
    />
  );
};

export default ReportTab;