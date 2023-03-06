import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { NoData, Space } from '@kqinfo/ui';
import classNames from 'classnames';
import styles from './index.less';
import useApi, { MicroDept } from '@/apis/microsite';
import { IMAGE_DOMIN } from '@/config/constant';

export default () => {
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '科室分布',
    });
  });

  const [hosList, setHosList] = useState<MicroDept[]>([]);
  const [buildingList, setBuildingList] = useState<MicroDept[]>([]);
  const [floorList, setFloorList] = useState<MicroDept[]>([]);
  const [hosId, setHosId] = useState<number>();
  const [buildingId, setBuildingId] = useState<number>();

  const { data } = useApi.科室分布目录层级({
    initValue: {
      data: {},
    },
  });

  useEffect(() => {
    if (data?.data?.length) {
      setHosList(data?.data || []);
      setHosId(data?.data[0].id);
      if (data?.data[0].children?.length) {
        setBuildingList(data?.data[0].children);
        setBuildingId(data?.data[0].children[0].id);
        if (data?.data[0].children[0].children.length) {
          setFloorList(data?.data[0].children[0].children);
        }
      }
    }
  }, [data?.data]);

  return (
    <View>
      {hosList?.length > 0 && buildingList?.length > 0 ? (
        <>
          <View className={styles.header}>
            {(hosList || []).map((item) => {
              return (
                <View key={item.id} className={styles.headerItem}>
                  <Text
                    className={classNames(styles.headerItemText, {
                      [styles.headerItemTextSelect]: hosId === item.id,
                    })}
                    onTap={() => {
                      setHosId(item.id);
                      setBuildingList(item.children || []);
                      if (item.children.length) {
                        setBuildingId(item.children[0].id);
                        setFloorList(item.children[0].children || []);
                      } else {
                        setBuildingId(undefined);
                        setFloorList([]);
                      }
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              );
            })}
          </View>
          <Space>
            <View className={styles.left}>
              {(buildingList || []).map((item, index) => {
                return (
                  <View
                    onTap={() => {
                      setBuildingId(item.id);
                      setFloorList(item.children);
                    }}
                    className={classNames(styles.leftBox, {
                      [styles.active]: buildingId === item.id,
                    })}
                    key={index}
                  >
                    {item.name}
                    {buildingId === item.id && (
                      <Image
                        className={classNames(styles.buildingBg)}
                        src={`${IMAGE_DOMIN}/microsite/buildingBg.png`}
                      />
                    )}
                  </View>
                );
              })}
            </View>
            <View className={styles.right}>
              {(floorList || []).map((item, index) => {
                return (
                  <View className={styles.rightBox} key={index}>
                    <View className={styles.rightTitle}>{item.name}</View>
                    <View className={styles.rightContent}>{item.depts}</View>
                  </View>
                );
              })}
            </View>
          </Space>
        </>
      ) : (
        <NoData />
      )}
    </View>
  );
};
