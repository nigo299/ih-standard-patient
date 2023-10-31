import React, { useMemo } from 'react';
import { Space, FormItem, Form, useTitle, PartTitle, Shadow } from '@kqinfo/ui';
import styles from './index.less';
import usePreScptState from './usePreScptState';
export default () => {
  const [preScpt] = usePreScptState();
  const prescription = useMemo(() => {
    return preScpt?.prescription?.[0];
  }, [preScpt?.prescription]);
  const paitentInfo: any[] = useMemo(() => {
    return (
      [
        { title: '处方名称', content: prescription?.prescName },
        { title: '处方名称', content: prescription?.prescName },
        { title: '开单医生', content: prescription?.doctorName },
        { title: '开单科室', content: prescription?.deptName },
        { title: '开单时间', content: prescription?.createTime },
        ...(preScpt?.paitentInfo || []).filter(
          (item) => item.title === '就诊人',
        ),
      ] || []
    );
  }, [
    preScpt.paitentInfo,
    prescription?.createTime,
    prescription?.deptName,
    prescription?.doctorName,
    prescription?.prescName,
  ]);
  useTitle('处方详情');
  return (
    <Form labelStyle={{ color: '#333', fontWeight: 500 }}>
      <Space vertical className={styles.page} size={20}>
        <Space vertical className={styles.topbox} size={20}>
          <PartTitle full>就诊人信息</PartTitle>
          <Form readOnly itemStyle={{ padding: 10 }}>
            {(paitentInfo || []).map((item, index) => {
              return (
                <FormItem label={item.title} key={index}>
                  {item.content}
                </FormItem>
              );
            })}
          </Form>
          <Shadow>
            <Space vertical className={styles.psptBox}>
              {(prescription?.prescDetail || []).map((item, index) => {
                return (
                  <Space
                    className={styles.psptItem}
                    vertical
                    key={index}
                    size={20}
                  >
                    <Space className={styles.psptItemHead}>
                      {item.drugName}
                    </Space>
                    <Space className={styles.psptItemdesc}>
                      <Space flex={1}>规格：{item.drugSpec}</Space>
                      <Space flex={1}>数量：{item.drugNum}</Space>
                    </Space>
                    <Space className={styles.psptItemdesc} flexWrap={'wrap'}>
                      用法用量：{item.useMethod}，{item.dosage}，
                      {item.dosageUnit}
                    </Space>
                  </Space>
                );
              })}
            </Space>
          </Shadow>
        </Space>
      </Space>
    </Form>
  );
};
