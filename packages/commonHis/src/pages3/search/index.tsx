import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { PartTitle, Search, Button, Space, showToast } from '@kqinfo/ui';
import { DoctorCardOld } from '@/components';
import { NoDataOld } from '@/components';
import { THEME_COLOR } from '@/config/constant';
import useApi from '@/apis/register';
import storage from '@/utils/storage/index';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';
import { useDebounceFn } from 'ahooks';

const getNewArray = (arr: any, size: number) => {
  // size=5，要分割的长度
  const arrNum = Math.ceil(arr.length / size); // Math.ceil()向上取整的方法，用来计算拆分后数组的长度
  let index = 0; // 定义初始索引
  let resIndex = 0; // 用来保存每次拆分的长度
  const result = [];
  while (index < arrNum) {
    result[index] = arr.slice(resIndex, size + resIndex);
    resIndex += size;
    index++;
  }
  return result;
};

export default () => {
  const data = storage.get('search_doctor');
  const { q } = useGetParams<{ q: string }>();
  const {
    request: doctorRequest,
    data: {
      data: { recordList },
    },
  } = useApi.查询科室医生列表({
    initValue: {
      data: {
        recordList: [],
      },
    },
    params: {
      vagueName: q,
    },
    needInit: false,
  });
  const [value, setValue] = useState(q);
  const [searchStorage, setSearchStorage] = useState(
    data ? JSON.parse(data) : [],
  );
  const { run } = useDebounceFn(
    (v) => {
      setValue(v);
      if (v) {
        setValue(v);
        doctorRequest({
          vagueName: v,
        });
        setSearchDoctorData(v);
      }
    },
    {
      wait: 800,
    },
  );
  const setSearchDoctorData = useCallback((v: string) => {
    const data = storage.get('search_doctor');
    const newData = data ? JSON.parse(data) : [];
    newData.push(v);
    storage.set('search_doctor', JSON.stringify(newData));
    setSearchStorage(newData);
  }, []);
  const searStorageMain = useMemo(() => {
    const searchData = [...new Set(searchStorage.reverse())].reverse();
    if (searchStorage.length <= 10) {
      return getNewArray(searchData, 3);
    } else {
      return getNewArray(searchData.slice(-9), 3);
    }
  }, [searchStorage]);
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '搜索',
    });
  });

  return (
    <>
      <Space className={styles.search} alignItems="center">
        <Search
          value={value}
          onConfirm={(v) => {
            if (!v) {
              setValue('');
              // showToast({
              //   icon: 'none',
              //   title: '搜索内容不能为空',
              // });
              return;
            }
            setValue(v);
            doctorRequest({
              vagueName: v,
            });
            setSearchDoctorData(v);
          }}
          onChange={(v) => v && run(v)}
          inputWrapStyle={{ background: '#fff' }}
          btnStyle={{
            background: '#fff',
            color: THEME_COLOR,
          }}
          elderly
          showBtn
          placeholder={'输入医生或者科室名字查询'}
        />
      </Space>
      <View className={styles.content}>
        {recordList.length >= 1 && value ? (
          <View className={styles.wrap}>
            {recordList.map((doctor, index) => (
              <DoctorCardOld
                key={index}
                deptId={doctor.deptId}
                doctorName={doctor.name}
                deptName={doctor.deptName}
                doctorTitle={doctor.level}
                doctorSkill={doctor.specialty}
              />
            ))}
          </View>
        ) : (
          <>
            <PartTitle bold full elderly className={styles.partTitle}>
              搜索历史
            </PartTitle>
            <View className={styles.wrap}>
              {searStorageMain.length >= 1 ? (
                <View>
                  {searStorageMain.map((val: any, num: number) => (
                    <Space key={num} className={styles.items} flexWrap="wrap">
                      {val.map((item: string, index: number) => (
                        <Space
                          justify="center"
                          alignItems="center"
                          flex="auto"
                          key={index}
                          className={styles.item}
                          onTap={() => {
                            setValue(item);
                            doctorRequest({
                              vagueName: item,
                            });
                          }}
                        >
                          {item}
                        </Space>
                      ))}
                    </Space>
                  ))}
                </View>
              ) : (
                <NoDataOld />
              )}
              <View className={styles.button}>
                <Button
                  ghost
                  type="primary"
                  elderly
                  disabled={searchStorage.length === 0}
                  onTap={() => {
                    setValue('');
                    setSearchStorage([]);
                    storage.del('search_doctor');
                    showToast({
                      title: '删除成功',
                      icon: 'success',
                    });
                  }}
                >
                  删除历史
                </Button>
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );
};
