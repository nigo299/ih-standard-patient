import React, { useMemo, useState } from 'react';
import {
  Space,
  useTitle,
  PartTitle,
  NoData,
  Rotate,
  Icon,
  Fold,
} from '@kqinfo/ui';
import styles from './index.less';
import usePreScptState from './usePreScptState';
import useGetParams from '@/utils/useGetParams';

const ExpandView = ({
  title = '',
  data,
}: {
  title: string;
  data: any | any[];
}) => {
  const [show, setShow] = useState(false);
  const ItemBox = useMemo(() => {
    if (!data || data.length === 0) {
      return <NoData />;
    }
    return (data || []).map(
      (
        item: {
          drugType: string; //药品类型
          drugName: string; //药品名称
          drugSpec: string; //规格
          drugNum: string; //数量
          useMethod: string; //用法
          dosage: string; //用量
          dosageUnit: string; //用量单位
          medicalType: string; //医保类型
        },
        index: number,
      ) => {
        return (
          <Space
            className={styles.chdItem}
            key={index}
            alignItems={'center'}
            justify={'space-between'}
            size={20}
          >
            <Space flex={1} vertical size={20}>
              <Space className={styles.chdItemHead} flexWrap={'wrap'}>
                {item.drugName || '-'}
              </Space>
              <Space className={styles.chdItemDesc} flexWrap={'wrap'}>
                {item.drugSpec || '-'}
              </Space>
            </Space>
            <Space>
              {item.useMethod}
              {item.dosage}
            </Space>
          </Space>
        );
      },
    );
  }, [data]);
  return (
    <>
      <PartTitle
        full
        className={styles.itemHead}
        action={
          <Space flex={1} onTap={() => setShow(!show)} justify={'flex-end'}>
            <Rotate run={show} angle={180}>
              <Icon name={'kq-down'} size={24} />
            </Rotate>
          </Space>
        }
      >
        {title}
      </PartTitle>
      <Fold folded={!show}>{ItemBox}</Fold>
    </>
  );
};
export default () => {
  const { type } = useGetParams<{
    type: string;
  }>();
  const [preScpt] = usePreScptState();
  useTitle(type === 'LONG' ? '长期医嘱' : '短期医嘱');
  const listData = useMemo(() => {
    if (type === 'LONG') {
      return (preScpt?.prescription || []).filter(
        (item) => item.prescriptionType === 'LONG',
      );
    }
    if (type === 'SHORT') {
      return (preScpt?.prescription || []).filter(
        (item) => item.prescriptionType === 'SHORT',
      );
    }
    return [];
  }, [preScpt?.prescription, type]);
  return (
    <Space vertical className={styles.page} size={20}>
      {listData.map((item, index) => {
        return (
          <ExpandView
            title={item.createTime}
            data={item.prescDetail || []}
            key={index}
          />
        );
      })}
      {listData.length === 0 && <NoData />}
    </Space>
  );
};
