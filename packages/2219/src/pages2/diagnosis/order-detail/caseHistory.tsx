import React from 'react';
import { Space, useTitle } from '@kqinfo/ui';
import styles from './index.less';
import useCaseHisState from './useCaseHisState';
export default () => {
  const [CaseHis] = useCaseHisState();

  useTitle('门诊病历');
  return (
    <Space className={styles.page1} vertical size={20}>
      {[
        { title: '主诉', content: CaseHis?.mainNarration || '暂无' },
        { title: '现病史', content: CaseHis?.nowHistory || '暂无' },
        { title: '既往史', content: CaseHis?.pastHistory || '暂无' },
        { title: '体格检查', content: CaseHis?.examInfo || '暂无' },
        { title: '诊断', content: CaseHis?.diagnosis || '暂无' },
        { title: '诊疗意见', content: CaseHis?.opinions || '暂无' },
      ].map((item, index) => {
        return (
          <Space className={styles.card} flexWrap={'wrap'} key={index}>
            <Space className={styles.cardHead}>{item.title}:</Space>
            {item.content}
          </Space>
        );
      })}
    </Space>
  );
};
