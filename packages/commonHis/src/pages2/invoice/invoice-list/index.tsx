import React, { useEffect, useMemo } from 'react';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useCommApi from '@/apis/common';
import { navigateTo, View, Image } from '@remax/one';
import { showLoading, Loading, NoData } from '@kqinfo/ui';
import { HOSPITAL_NAME, IMAGE_DOMIN } from '@/config/constant';
import { decrypt } from '@/utils';
const dicts = {
  '1': '挂号',
  '2': '门诊',
  '3': '住院',
};
export default () => {
  const { patCardNo, idNo, patName } = useGetParams<{
    patCardNo?: string;
    idNo?: string;
    patName?: string;
  }>();
  const { data, loading } = useCommApi.查询电子发票({
    params: {
      patCardNo: patCardNo,
      beginDate: '2021-01-01',
      endDate: '2021-01-01',
      extFields: {
        idNo: decrypt(idNo),
      },
    },
    needInit: !!idNo && !!patCardNo,
  });
  useEffect(() => {
    console.log('data', data);
  }, [data]);
  const dataList = useMemo(() => {
    if (!data?.data?.ebillDataList) return [];
    return data?.data?.ebillDataList?.map((item) => {
      return {
        Bill_no: item?.billNo,
        Bill_settle_date: item?.createTime,
        in_outp_flag: dicts[item.noteType],
        Total_charges: item?.totalAmt / 100,
        Name: decrypt(patName),
        invoiceUrl: item?.pictureNetUrl,
      };
    });
  }, [data?.data?.ebillDataList, patName]);
  return (
    <View className={styles['page-invoiceList']}>
      {loading && <Loading type={'full'} />}

      <View className={styles.list}>
        {/* {!patientId && (
          <View className={styles.noData}>
            暂未查询到发票信息,请稍后再试
            <NoData />
          </View>
        )} */}
        {dataList &&
          dataList?.map((item) => {
            return (
              <View
                key={item.Bill_no}
                className={styles.item}
                onTap={async () => {
                  // showLoading({ title: '加载中' });
                  // const { data } = await useCommApi.发票详情.request({
                  //   billBatchCode: item?.bill_batch_code,
                  //   billNo: item?.bill_no,
                  //   random: item?.bill_random,
                  // });
                  if (item.invoiceUrl) {
                    window.location.href = item?.invoiceUrl;
                  } else {
                    navigateTo({
                      url: `/ordermng/invoiceError`,
                    });
                  }
                }}
              >
                <View className={styles.header}>
                  <View className={styles.name}>
                    <Image
                      src={`${IMAGE_DOMIN}/auth/logo.png`}
                      className={styles.logo}
                    />
                    <View className={styles.text}>{HOSPITAL_NAME}</View>
                  </View>
                  <View className={styles.price}>
                    ￥
                    {item.Total_charges
                      ? parseFloat(item.Total_charges).toFixed(2)
                      : '-'}
                  </View>
                </View>
                <View className={styles.gap} />
                {[
                  { label: '票据类型', value: item.in_outp_flag },
                  {
                    label: '就诊人',
                    value: item.Name,
                  },
                  // { label: '电子票据代码', value: item.Bill_batch_code },
                  { label: '电子票据号码', value: item.Bill_no },
                  // { label: '检验码', value: item.Bill_random },
                  { label: '开票日期', value: item.Bill_settle_date },
                ].map((item, index) => {
                  return (
                    <View className={styles.kv} key={index}>
                      <View className={styles.k}>
                        {item.label.split('').map((x, i) => {
                          return <span key={i}>{x}</span>;
                        })}
                      </View>
                      <View className={styles.v}>{item.value || '-'}</View>
                    </View>
                  );
                })}
                <View className={styles.gap} style={{ marginTop: '2vw' }} />
                <View className={styles.go}>查看</View>
              </View>
            );
          })}
      </View>
    </View>
  );
};
