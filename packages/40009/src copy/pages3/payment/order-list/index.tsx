import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, Text, redirectTo, navigateTo, TapEvent } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import classNames from 'classnames';
import useApi, { WaitpayType } from '@/apis/payment';
import { NoDataOld, SwitchPatient } from '@/components';
import usePayApi from '@/apis/pay';
import { FormItem, Button, Space, showToast } from '@kqinfo/ui';
import payState from '@/stores/pay';
import patientState from '@/stores/patient';
import setNavigationBar from '@/utils/setNavigationBar';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import { returnUrl } from '@/utils';
import useGetParams from '@/utils/useGetParams';
import styles from './index.less';

export default () => {
  const {
    defaultPatientInfo: { patientName, patCardNo, patientId: defaPatientId },
  } = patientState.useContainer();
  const { setOrderInfo } = payState.useContainer();
  const { patientId } = useGetParams<{ patientId: string }>();
  const [waitOpList, setWaitOpList] = useState<WaitpayType[]>([]);
  const [payFlag, setPayFlag] = useState(false);
  const [selectList, setSelectList] = useState<string[]>([]);
  const selectAll = useMemo(() => {
    if (selectList.length === 0 || selectList.length !== waitOpList.length) {
      return false;
    }
    return true;
  }, [waitOpList?.length, selectList.length]);
  const handlePay = useCallback(async () => {
    setPayFlag(true);
    let newHisOrdNums = '';
    selectList.map((order) => (newHisOrdNums += `${order},`));
    newHisOrdNums = newHisOrdNums.slice(0, newHisOrdNums.length - 1);
    const { code, data, msg } = await useApi.创建门诊缴费订单.request({
      patientId: defaPatientId || patientId,
      deptName: waitOpList[0].deptName,
      doctorName: waitOpList[0].doctorName,
      createDate: waitOpList[0].date,
      hisOrderNo: newHisOrdNums,
    });
    if (code === 0 && data?.payOrderId) {
      if (PLATFORM === 'web') {
        // H5 支付逻辑
        const result = await usePayApi.h5支付下单.request({
          orderId: data.payOrderId,
          callbackUrl: `${returnUrl()}#/pages/waiting/index?bizType=MZJF&orderId=${
            data.orderId
          }`,
        });
        if (result.code === 0 && result.data) {
          window.location.href = result.data;
        }
      } else {
        // 小程序收银台
        setOrderInfo({
          bizType: 'MZJF',
          hisName: data?.hisName,
          deptName: data?.deptName,
          doctorName: data?.doctorName,
          patientName: `${patientName} | ${
            waitOpList[0].gender === 'M' ? '男' : '女'
          } | ${waitOpList[0].age || '未知'}岁`,
          patCardNo,
          totalFee: data.totalFee,
          orderId: data.orderId,
          payOrderId: data.payOrderId,
        });
        navigateTo({
          url: '/pages/pay/index',
        });
      }
    } else {
      showToast({
        title: msg || '下单失败，请重试!',
        icon: 'fail',
      });
    }

    setPayFlag(false);
  }, [
    defaPatientId,
    patCardNo,
    patientId,
    patientName,
    selectList,
    setOrderInfo,
    waitOpList,
  ]);
  const onSelectAll = useCallback(
    (event: TapEvent, item: WaitpayType) => {
      event.stopPropagation();
      if (selectList.includes(item.hisOrderNo)) {
        setSelectList((prev) =>
          prev.filter((subItem) => subItem !== item.hisOrderNo),
        );
      } else {
        setSelectList((prev) => [...prev, item.hisOrderNo]);
      }
    },
    [selectList],
  );
  const getWaitOpList = useCallback(async () => {
    const { data, code } = await useApi.查询门诊待缴费列表.request({
      patientId: defaPatientId || patientId,
    });
    if (code === 0 && data?.length >= 1) {
      setWaitOpList(data);
      setSelectList(data?.map((item) => item.hisOrderNo));
    } else {
      showToast({
        icon: 'none',
        title: '当前就诊人暂无待缴费记录, 请重新选择就诊人!',
      });
    }
  }, [defaPatientId, patientId]);
  usePageEvent('onShow', () => {
    if (!defaPatientId && !patientId) {
      redirectTo({
        url: '/pages3/usercenter/user-list/index?pageRoute=/pages3/payment/order-list/index',
      });
    }
    if (waitOpList.length === 0) {
      getWaitOpList();
    }
    // setSelectList([]);
    setNavigationBar({
      title: '门诊缴费',
    });
  });
  return (
    <View className={styles.page}>
      <SwitchPatient
        patientName={patientName}
        redirectUrl="/pages3/usercenter/select-user/index?pageRoute=/pages3/payment/order-list/index"
      />
      <View className={styles.items}>
        {waitOpList && waitOpList?.length >= 1 ? (
          waitOpList?.map((item) => (
            <Space
              key={item.hisOrderNo}
              className={styles.item}
              justify="space-between"
              alignItems="center"
              onTap={() => {
                navigateTo({
                  url: `/pages3/payment/order-item/index?hisOrderNo=${encodeURIComponent(
                    item.hisOrderNo,
                  )}&deptName=${item.deptName}&doctorName=${
                    item.doctorName
                  }&patientName=${patientName}&patientId=${
                    defaPatientId || patientId
                  }&patCardNo=${patCardNo}`,
                });
              }}
            >
              <Space justify="flex-start" alignItems="center">
                <View
                  className={styles.checkBoxWrap}
                  onTap={(event) => onSelectAll(event, item)}
                >
                  {selectList.includes(item.hisOrderNo) ? (
                    <Space
                      justify="center"
                      alignItems="center"
                      className={styles.checkBoxActive}
                    >
                      <Image
                        mode="aspectFit"
                        src={`${IMAGE_DOMIN}/payment/select-old.png`}
                        className={styles.checkImg}
                      />
                    </Space>
                  ) : (
                    <View className={styles.checkBox} />
                  )}
                </View>
                <Space vertical size={30}>
                  <Space alignItems="center">
                    <FormItem
                      label={'就诊医生'}
                      labelWidth={'4em'}
                      className={styles.label}
                      labelCls={styles.label}
                      onTap={(event) => onSelectAll(event, item)}
                    />
                    <View className={styles.itemText}>{item.doctorName}</View>
                  </Space>

                  <Space alignItems="center">
                    <FormItem
                      label={'检查项目'}
                      labelWidth={'4em'}
                      className={styles.label}
                      labelCls={styles.label}
                      onTap={(event) => onSelectAll(event, item)}
                    />
                    <View className={styles.itemText}>
                      {item.deptName || '暂无'}
                    </View>
                  </Space>
                  <Space alignItems="center">
                    <FormItem
                      label={'时间'}
                      labelWidth={'4em'}
                      className={styles.label}
                      labelCls={styles.label}
                      onTap={(event) => onSelectAll(event, item)}
                    />
                    <View className={styles.itemText}>
                      {item.date || '暂无'}
                    </View>
                  </Space>
                  <Space alignItems="center">
                    <FormItem
                      label={'缴费金额'}
                      labelWidth={'4em'}
                      className={styles.label}
                      labelCls={styles.label}
                      onTap={(event) => onSelectAll(event, item)}
                    />
                    <View className={styles.price}>
                      ¥{(Number(item.totalFee) / 100).toFixed(2)}
                    </View>
                  </Space>
                </Space>
              </Space>
              <View className={styles.arrowWrap}>
                <Image
                  mode="aspectFit"
                  src={`${IMAGE_DOMIN}/payment/arrow.png`}
                  className={styles.arrow}
                />
              </View>
            </Space>
          ))
        ) : (
          <NoDataOld />
        )}
      </View>
      <View className={styles.tip}>
        <View className={styles.tipTitle}>温馨提示：</View>
        <View className={styles.tipContent}>
          请仔细核对您本次就医的单据，以免缴错、多缴；
          <Text className={styles.address}>缴费后不支持线上退费，</Text>
          请谨慎操作；目前
          <Text className={styles.address}>暂不支持医保在线结算</Text>
        </View>
        <Space className={styles.total} justify="center">
          合计金额：￥
          {waitOpList
            ?.reduce((prev, item) => {
              return (prev += selectList.includes(item.hisOrderNo)
                ? Number(item.totalFee) / 100
                : 0);
            }, 0)
            .toFixed(2)}
        </Space>
      </View>
      <Space
        className={styles.foot}
        justify="space-between"
        alignItems="center"
      >
        <Space
          className={styles.choose}
          alignItems="center"
          onTap={() => {
            if (selectList.length === waitOpList?.length) {
              setSelectList([]);
            } else {
              setSelectList(waitOpList?.map((item) => item.hisOrderNo));
            }
          }}
        >
          {selectAll ? (
            <Space
              justify="center"
              alignItems="center"
              className={classNames(styles.checkBoxActive, styles.mr9)}
            >
              <Image
                mode="aspectFit"
                src={`${IMAGE_DOMIN}/payment/select-old.png`}
                className={styles.checkImg}
              />
            </Space>
          ) : (
            <View className={classNames(styles.checkBox, styles.mr9)} />
          )}
          全选
        </Space>
        <Button
          type="primary"
          className={styles.btn}
          onTap={handlePay}
          block={false}
          elderly
          loading={payFlag}
          disabled={payFlag || selectList.length === 0}
        >
          立即缴费
        </Button>
      </Space>
    </View>
  );
};
