import React from 'react';
import { Tab } from '@kqinfo/ui';
// import { encryptDes } from 'commonHis/src/utils';
import { navigateTo } from 'remax/one';

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
          navigateTo({
            url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/imageCloud/index',
          });
        } else {
          setTabIndex(v);
        }
      }}
      tabs={[
        { content: '检验报告', index: 1 },
        // { content: '检查报告', index: 2 },
        { content: '检查影像', index: 3 },
      ]}
    />
  );
};

export default ReportTab;
