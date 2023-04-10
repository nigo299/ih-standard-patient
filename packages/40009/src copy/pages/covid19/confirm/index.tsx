import React from 'react';
import styles from './index.less';
import {
  Image,
  PartTitle,
  Space,
  Form,
  FormItem,
  Shadow,
  Button,
  Fixed,
  Loading,
  showToast,
} from '@kqinfo/ui';
import { useTitle } from 'parsec-hooks';
import api from '../api';
import { navigateTo, Text } from 'remax/one';
import useGetParams from '@/utils/useGetParams';
import showModal from '@/utils/showModal';
import usePaymentApi from '@/apis/payment';
import { IMAGE_DOMIN } from '@/config/constant';

export default () => {
  useTitle('核酸检测开单');
  const [form] = Form.useForm();
  const { patientId, itemID, itemName, price, name, no } = useGetParams<{
    patientId: string;
    itemID: string;
    itemName: string;
    price: string;
    name: string;
    no: string;
  }>();
  const { request, loading: orderLoading } = api.核酸开单({
    needInit: false,
    params: {
      patCardType: '21',
      patCardNo: no,
      itemID: itemID,
      // patName: decodeURIComponent(name),
    },
  });

  return (
    <Space vertical>
      {orderLoading && <Loading />}
      <Image src={`${IMAGE_DOMIN}/covid19/bc.png`} className={styles.imgCls} />
      <Space vertical className={styles.container} size={30}>
        <Space vertical size={20}>
          <PartTitle>基本信息</PartTitle>
          <Shadow>
            <Form
              form={form}
              cell
              values={{
                name: decodeURIComponent(name),
                // deptName: '暂无',
                // campus: '暂无',
              }}
              readOnly
            >
              <FormItem label={'就诊人'} name={'name'} />
              {/*<FormItem label={'执行科室'} name={'deptName'} />*/}
              {/*<FormItem label={'就诊院区'} name={'campus'} />*/}
            </Form>
          </Shadow>
        </Space>
        <Space vertical size={20}>
          <PartTitle>费用信息</PartTitle>
          <Shadow>
            <Space vertical>
              <Form
                form={form}
                cell
                style={{
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                values={{
                  pirce: '￥' + (Number(price || 0) / 100)?.toFixed(2),
                }}
                readOnly
              >
                <FormItem label={decodeURIComponent(itemName)} name={'pirce'} />
              </Form>
              <Space flex={1} justify={'flex-end'} className={styles.priceCls}>
                合计：￥{(Number(price || 0) / 100)?.toFixed(2)}
              </Space>
            </Space>
          </Shadow>
        </Space>
      </Space>
      <Fixed>
        <Space
          className={styles.footer}
          alignItems={'center'}
          justify={'space-between'}
        >
          <Space style={{ marginLeft: 20 }}>
            实付金额
            <Text style={{ color: '#FF0000' }}>
              {(Number(price || 0) / 100)?.toFixed(2)}
            </Text>
          </Space>
          <Button
            type={'primary'}
            className={styles.btn}
            onTap={() => {
              request().then((res: any) => {
                if (res?.data?.data?.resultCode === '0') {
                  showModal({
                    content: '核酸开单成功，是否前往缴费',
                  }).then(({ confirm }) => {
                    if (confirm) {
                      navigateTo({
                        url: `/pages2/payment/order-list/index?patientId=${patientId}&patCardNo=${no}`,
                      });
                    }
                  });
                } else {
                  usePaymentApi.查询门诊待缴费列表
                    .request({
                      patientId: patientId,
                    })
                    .then((res) => {
                      if (res.data.length > 0) {
                        showModal({
                          content: '您已有核酸开单记录, 请前往付费',
                        }).then(({ confirm }) => {
                          if (confirm) {
                            navigateTo({
                              url: `/pages2/payment/order-list/index?patientId=${patientId}&patCardNo=${no}`,
                            });
                          }
                        });
                      } else {
                        showToast({
                          title: '核酸自助开单失败，请稍后重试',
                        });
                      }
                    });
                }
              });
            }}
          >
            确定
          </Button>
        </Space>
      </Fixed>
    </Space>
  );
};
