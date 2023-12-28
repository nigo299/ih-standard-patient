import React from 'react';
import { Tab } from '@kqinfo/ui';

type RestProps = {
  current?: string | number | undefined;
  tabIndex: string | number;
  patCardNo?: string;
  onChange?: ((current: string | number) => void) | undefined;
  setTabIndex: (tabIndex: string | number) => void;
};

const ReportTab: React.FC<RestProps> = ({ tabIndex, setTabIndex }) => {
  return (
    <Tab
      current={tabIndex}
      type={'card'}
      onChange={setTabIndex}
      tabs={[
        { content: '检验报告', index: 1 },
        // { content: '检查报告', index: 2 },
      ]}
    />
  );
};

export default ReportTab;
