import React, { useCallback, useMemo, useState } from 'react';
import { View, Image, Text, TapEvent } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import classNames from 'classnames';
import useApi, { WaitpayType } from '@/apis/cloudFlashPay';
import {
  FormItem,
  Form,
  Button,
  showToast,
  Exceed,
  Space,
  Loading,
} from '@kqinfo/ui';
import showModal from '@/utils/showModal';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  IMAGE_DOMIN,
  PLATFORM,
  PAYMENT_SELECTALL,
  PAYMENT_SELECTALL_PAY,
} from '@/config/constant';
import useGetParams from '@/utils/useGetParams';
import { Tip } from '@/components';
import styles from './index.less';
import reportCmPV from '@/alipaylog/reportCmPV';
import storage from '@/utils/storage';
import socialPayAuth from '@/utils/socialPayAuth';
import { useUpdateEffect } from 'ahooks';

export default () => {
  const { patCardNo, patHisNo } = useGetParams<{
    patCardNo: string;
    patientName: string;
    type?: string;
    patHisNo: string;
  }>();
  const [waitOpList, setWaitOpList] = useState<WaitpayType[]>([]);
  const [form] = Form.useForm();
  const [payFlag, setPayFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectList, setSelectList] = useState<string[]>([]);

  const selectAll = useMemo(() => {
    return !(
      selectList.length === 0 || selectList.length !== waitOpList.length
    );
  }, [waitOpList?.length, selectList.length]);
  const handlePay = useCallback(async () => {
    setPayFlag(true);
    let newHisOrdNums = '';
    selectList.map((order) => (newHisOrdNums += `${order},`));
    newHisOrdNums = newHisOrdNums.slice(0, newHisOrdNums.length - 1);
    const { code, data, msg } = await useApi.门诊缴费下单.request({
      hisOrderNo: selectList.join(','),
      ext_patCardNo: patCardNo,
      ext_patCardType: '22',
      payChannel: 'chinaums',
      ext_patHisNo: patHisNo,
      extFields: JSON.stringify({ patHisNo }),
      patHisNo: patHisNo,
      obid: 50171240,
    });

    if (code === 0 && data?.payOrderId) {
      if (PLATFORM === 'web') {
        window.location.href = data?.qrList?.[0]?.qrContent;
      }
    } else {
      showToast({
        icon: 'fail',
        title: msg || '下单失败，请重试!',
      });
    }
    setPayFlag(false);
  }, [patCardNo, patHisNo, selectList]);
  const onSelectAll = useCallback(
    (event: TapEvent, item: WaitpayType) => {
      event.stopPropagation();
      if (PAYMENT_SELECTALL) {
        if (selectList.includes(item.hisOrderNo)) {
          setSelectList((prev) =>
            prev.filter((subItem) => subItem !== item.hisOrderNo),
          );
        } else {
          setSelectList((prev) => [...prev, item.hisOrderNo]);
        }
      } else {
        setSelectList([item.hisOrderNo]);
      }
    },
    [selectList],
  );

  const getWaitOpList = useCallback(async () => {
    setLoading(true);
    const { data, code } = await useApi.门诊待缴费列表查询.request({
      ext_patCardNo: patCardNo,
      ext_patCardType: '22',
      extFields: JSON.stringify({ patHisNo }),
    });
    if (code === 0 && data?.waitOpList?.length >= 1) {
      setWaitOpList(data?.waitOpList);
      if (PAYMENT_SELECTALL_PAY) {
        setSelectList(data?.waitOpList?.map((item) => item.hisOrderNo));
      } else {
        setSelectList([data?.waitOpList?.[0].hisOrderNo]);
      }
    } else if (data?.waitOpList?.length === 0) {
      showModal({
        title: '提示',
        content: '当前就诊人暂无待缴费记录!',
      });
    }
    setLoading(false);
  }, [patCardNo, patHisNo]);
  useUpdateEffect(() => {
    if (process.env.REMAX_APP_PLATFORM === 'app') {
      const href = window.location.href;
      if (href.includes('encData=') && selectList.length >= 1) {
        socialPayAuth(href).then((res) => {
          handlePay(res?.payAuthNo);
        });
      }
    }
  }, [waitOpList]);
  usePageEvent('onShow', (query) => {
    reportCmPV({ title: '门诊缴费', query });
    if (waitOpList.length === 0) {
      getWaitOpList();
    }
    setNavigationBar({
      title: '门诊缴费',
    });
  });
  return (
    <View className={styles.wrap}>
      {loading && waitOpList.length === 0 && <Loading type={'top'} />}
      <View className={styles.list}>
        {waitOpList &&
          waitOpList?.length >= 1 &&
          waitOpList?.map((item) => (
            <View
              key={item.hisOrderNo}
              className={styles.item}
              // onTap={() => {
              //   const url = `/pages2/cloudFlashPay/order-detail/index?hisOrderNo=${
              //     item.hisOrderNo
              //   }&patCardNo=${patCardNo}&deptName=${encodeURIComponent(
              //     item.deptName,
              //   )}&doctorName=${encodeURIComponent(
              //     item.doctorName,
              //   )}&patHisNo=${patHisNo}`;
              //   navigateTo({
              //     url: url,
              //   });
              // }}
            >
              <View className={styles.price}>{`¥${(
                Number(item.totalFee) / 100
              ).toFixed(2)}`}</View>
              <View className={styles.infoWrap}>
                <View
                  className={styles.checkBoxWrap}
                  onTap={(event) =>
                    !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                  }
                >
                  {!PAYMENT_SELECTALL_PAY && (
                    <>
                      {selectList.includes(item.hisOrderNo) ? (
                        <Space
                          justify="center"
                          alignItems="center"
                          className={styles.select}
                        >
                          <Image
                            mode="aspectFit"
                            src={`${IMAGE_DOMIN}/payment/select.png`}
                            className={styles.selectImg}
                          />
                        </Space>
                      ) : (
                        <View className={styles.checkBox} />
                      )}
                    </>
                  )}
                </View>
                <Form className={styles.info} form={form}>
                  <View
                    className={styles.title}
                    onTap={(event) =>
                      !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                    }
                  >
                    {/*{`${item.patientName} ${*/}
                    {/*  item.gender === 'M' ? '男' : '女'*/}
                    {/*} | ${item.age}岁`}*/}
                  </View>
                  <View className={styles.td}>
                    <FormItem
                      label={'开单医生'}
                      labelWidth={'4em'}
                      className={styles.label}
                      onTap={(event) =>
                        !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                      }
                    />
                    <View>{item.doctorName}</View>
                  </View>
                  <View className={styles.td}>
                    <FormItem
                      label="检查项目"
                      labelWidth={'4em'}
                      className={styles.label}
                      onTap={(event) =>
                        !PAYMENT_SELECTALL_PAY && onSelectAll(event, item)
                      }
                    />

                    <Exceed className={styles.payName} clamp={1}>
                      {item.payName || '暂无'}
                    </Exceed>
                  </View>
                </Form>
              </View>
              <View className={styles.arrowWrap}>
                <Image
                  mode="aspectFit"
                  src={`${IMAGE_DOMIN}/payment/arrow.png`}
                  className={styles.arrow}
                />
              </View>
            </View>
          ))}
      </View>

      <View className={styles.tips}>
        <Tip
          items={[
            <View key={'tip'} className={styles.tipText}>
              请仔细核对您本次就医的单据，以免缴错、多缴；
              <Text style={{ color: '#E27854' }}>
                缴费后不支持线上退费，请谨慎操作；
              </Text>
              目前暂不支持医保线上缴费
            </View>,
          ]}
        />
      </View>
      <View className={styles.foot}>
        {PAYMENT_SELECTALL && (
          <View
            className={styles.choose}
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
                className={classNames(styles.select, styles.selectAll)}
              >
                <Image
                  mode="aspectFit"
                  src={`${IMAGE_DOMIN}/payment/select.png`}
                  className={styles.selectImg}
                />
              </Space>
            ) : (
              <View className={classNames(styles.checkBox, styles.mr9)} />
            )}
            全选
          </View>
        )}
        <View
          className={classNames(styles.total, {
            PAYMENT_SELECTALL: [styles.selectToatl],
          })}
        >
          合计￥
          {waitOpList
            ?.reduce((prev, item) => {
              return (prev += selectList.includes(item.hisOrderNo)
                ? Number(item.totalFee) / 100
                : 0);
            }, 0)
            .toFixed(2)}
        </View>
        <Button
          block={false}
          type="primary"
          className={styles.btn}
          onTap={() => {
            storage.set('payment_selectList', JSON.stringify(selectList));
            socialPayAuth().then(() => {
              handlePay();
            });
          }}
          loading={payFlag}
          disabled={
            payFlag || selectList.length === 0 || waitOpList.length === 0
          }
        >
          立即缴费
        </Button>
      </View>
    </View>
  );
};
