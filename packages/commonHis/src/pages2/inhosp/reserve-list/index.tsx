import React, { useState } from 'react';
import { View, navigateTo, Text, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { IMAGE_DOMIN } from '@/config/constant';
import { Space, NoData, Shadow, FormItem, Exceed, Button } from '@kqinfo/ui';
import { WhiteSpace } from '@/components';
import classNames from 'classnames';
import useApi from '@/apis/inhosp';
import styles from './index.less';
import { formDate } from '@/utils';
import dayjs from 'dayjs';
// import CustomerReported from '@/components/customerReported';
interface OrderType {
  id: string;
  patientName: string;
  patName: string;
  patCardNo: string;
  status: 'SUCCESS' | 'CANCEL' | 'WAITE';
  deptName: string;
  diseaseLevel: number;
  regDate: string;
  createTime: string;
}

const statusMap: { [key in OrderType['status']]: string } = {
  SUCCESS: '成功',
  CANCEL: '取消',
  WAITE: '待审核',
};

const diseaseLevelMap: { [key: number]: string } = {
  0: '一般',
  1: '严重',
};
export default () => {
  const [outpatientList, setOutPatientList] = useState<OrderType[]>([]);
  usePageEvent('onShow', async () => {
    setNavigationBar({
      title: '住院预约记录',
    });
    const { data } = await useApi.查询住院预约记录列表.request();
    setOutPatientList(data?.recordList || []);
  });

  return (
    <View className={styles.paymented}>
      {outpatientList?.length >= 1 &&
        outpatientList.map(
          (order: OrderType, index: number) =>
            order.status.toLocaleUpperCase() !== 'U' && (
              <React.Fragment key={index}>
                <Shadow card key={order.id}>
                  <Space
                    justify="center"
                    vertical
                    className={styles.item}
                    onTap={() =>
                      navigateTo({
                        url: `/pages2/inhosp/reserve-detail/index?id=${order.id}`,
                      })
                    }
                  >
                    <Image
                      src={`${IMAGE_DOMIN}/inhosp/arrow.svg`}
                      className={styles.arrow}
                    />

                    <Space
                      justify="space-between"
                      alignItems="center"
                      className={styles.lineHeight}
                    >
                      <Space alignItems="center" className={styles.name}>
                        <FormItem
                          label={order?.patientName}
                          labelWidth="4em"
                          colon={false}
                        />
                        <View
                          className={styles.name2}
                        >{`${order.patName} | ${order.patCardNo}`}</View>
                      </Space>
                      <Space
                        alignItems="center"
                        className={classNames(styles.payTitle)}
                      >
                        {statusMap[order.status as keyof typeof statusMap]}
                      </Space>
                    </Space>
                    <Space alignItems="center" className={styles.lineHeight}>
                      <Space
                        alignItems="center"
                        className={(styles.title, styles.deptTitle)}
                      >
                        {`入院科室 :`}
                        <Exceed
                          className={classNames(styles.deptName, styles.text)}
                          clamp={1}
                        >
                          {order.deptName}
                        </Exceed>
                      </Space>
                      <Space
                        alignItems="center"
                        className={(styles.title, styles.deptTitle)}
                      >
                        {`病情分级 :`}
                        <Exceed
                          className={classNames(styles.deptName, styles.text)}
                          clamp={1}
                        >
                          {diseaseLevelMap[order.diseaseLevel]}
                        </Exceed>
                      </Space>
                    </Space>
                    <Space className={styles.title}>
                      {`预约入院时间 :`}
                      <Text className={styles.text}>
                        {dayjs(order.regDate).format('YYYY-MM-DD')}
                      </Text>
                    </Space>
                    <Space className={styles.title}>
                      {`申请时间 :`}
                      <Text className={styles.text}>
                        {formDate(order.createTime)}
                      </Text>
                    </Space>
                  </Space>
                </Shadow>

                <WhiteSpace />
              </React.Fragment>
            ),
        )}
      <View className={classNames(styles.button)}>
        <Button
          type="primary"
          onTap={() =>
            navigateTo({
              url: `/pages2/usercenter/select-user/index?pageRoute=/pages2/inhosp/reserve-add/index`,
            })
          }
        >
          新增住院预约
        </Button>
      </View>
      <NoData />
    </View>
  );
};
