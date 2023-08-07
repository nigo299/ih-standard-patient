import React, { useState } from 'react';
import { IMAGE_DOMIN, IS_FEEDBACL } from '@/config/constant';
import {
  Button,
  Icon,
  // Loading,
  PartTitle,
  previewImage,
  ReTextarea,
  showToast,
  Space,
} from '@kqinfo/ui';
import { View, Image, Text, navigateBack } from '@remax/one';
import classNames from 'classnames';
import Form, { Field } from 'rc-field-form';
import useApi from '@/apis/feedback';
import { useUpload } from '@/hooks';
import useGetParams from '@/utils/useGetParams';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import globalState from '@/stores/global';
import styles from '@/pages2/feedback/feedback-add/index.less';
import CustomerReported from '@/components/customerReported';

export default () => {
  const { initWxSDK } = globalState.useContainer();
  const { id, deptName, deptId, doctorName, doctorId } = useGetParams<{
    id: string;
    deptName: string;
    deptId: string;
    doctorName: string;
    doctorId: string;
  }>();
  // const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imgList, setImgList] = useState<string[]>([]);
  const uploader = useUpload();

  const reasons = [
    '服务态度不好',
    '医生回答不及时',
    '系统不稳定',
    '价格不合理',
    '其它',
  ];

  const [selectReason, setSelectReason] = useState('');
  usePageEvent('onShow', () => {
    initWxSDK();
    setNavigationBar({
      title: '意见反馈',
    });
  });
  return (
    <View className={styles.pageFeedbackAdd}>
      {/* {loading && <Loading content="上传中..." />} */}
      <Form form={form}>
        {!id && (
          <View className={styles.pageFeedbackAddTop}>
            <Image
              src={`${IMAGE_DOMIN}/feedback/banner.png`}
              className={styles.feedbackAddBanner}
              mode="widthFix"
            />
            <View className={styles.feedbackAddReason}>
              <PartTitle>请选择原因</PartTitle>
              <View className={styles.feedbackAddReasons}>
                {reasons.map((item, i) => {
                  return (
                    <View
                      className={classNames(styles.feedbackAddReasonItem, {
                        [styles.feedbackAddReasonItem1]: item.length <= 5,
                        [styles.feedbackAddReasonItem2]: item === selectReason,
                      })}
                      key={i}
                      onTap={() => {
                        setSelectReason(item);
                      }}
                    >
                      <Text
                        className={classNames(
                          styles.feedbackAddReasonItemText,
                          {
                            [styles.feedbackAddReasonItemText1]:
                              item === selectReason,
                          },
                        )}
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
        <View
          className={classNames(styles.feedbackAddComplaints, {
            [styles.feedbackAddComplaints1]: id,
          })}
        >
          <PartTitle>{id ? '追加回复' : '投诉或建议'}</PartTitle>
          <View className={styles.feedbackAddComplaintsTextareaBox}>
            <Field
              name="content"
              rules={[
                {
                  required: true,
                  message: id ? '请输入追加回复的内容' : '请输入投诉或建议内容',
                },
              ]}
            >
              <ReTextarea
                className={styles.feedbackAddComplaintsTextarea}
                maxLength={100}
                placeholder={
                  id ? '请输入追加回复的内容' : '请输入投诉或建议内容'
                }
              />
            </Field>
          </View>
        </View>
        <View className={styles.feedbackAddImages}>
          <PartTitle>
            上传图片
            <Text className={styles.feedbackAddImagesSubTitle}>
              （最多5张，每张不超过5M）
            </Text>
          </PartTitle>
          <View className={styles.feedbackAddImagesUpload}>
            <View className={classNames(styles.uploadImg)}>
              {(imgList || []).map((item, index) => (
                <View
                  className={classNames(styles.uploadImgItem, {
                    [styles.uploadImgItemFirst]: index === 0,
                  })}
                  key={index}
                >
                  <Image
                    className={classNames(styles.uploadImgItemImage)}
                    src={item}
                    onTap={() => {
                      previewImage({ urls: [item] });
                    }}
                  />
                  <Icon
                    className={classNames(styles.uploadImgItemDelete)}
                    name="kq-clear2"
                    color="#EA5328"
                    onTap={() => {
                      const temp = [...imgList];
                      temp.splice(index, 1);
                      setImgList([...temp]);
                    }}
                  />
                </View>
              ))}
              {imgList?.length < 5 && (
                <Image
                  src={`${IMAGE_DOMIN}/feedback/upload.png`}
                  mode="aspectFit"
                  className={classNames(styles.uploadImgIcon)}
                  onTap={() => {
                    if (imgList.length >= 5) {
                      showToast({
                        title: '最多只能上传5张图片',
                        icon: 'none',
                      });
                      return;
                    }

                    uploader({
                      maxLength: 5 - (imgList?.length || 0),
                      onStart: () => {
                        // setLoading(true);
                      },
                    }).then((srcs: any) => {
                      // setLoading(false);
                      console.log('上传图片之后', [...imgList, ...srcs]);
                      setImgList([...imgList, ...srcs]);
                    });
                  }}
                />
              )}
            </View>
          </View>
        </View>
        <View
          className={classNames(styles.feedbackAddButton, {
            [styles.feedbackAddButton1]: id,
          })}
        >
          <Button
            type="primary"
            style={{ backgroundColor: '#33abe2', border: 'none' }}
            className={styles.button}
            onTap={() => {
              if (!selectReason && !id) {
                showToast({ title: '请选择原因', icon: 'none' });
                return;
              }
              form
                .validateFields()
                .then((value) => {
                  if (!id) {
                    const params = {
                      complaintsCert: imgList.join(','),
                      complaintsContent: value.content,
                      complaintsReason: selectReason,
                      deptName,
                      deptId,
                      doctorName,
                      doctorId,
                    };
                    useApi.新增意见反馈
                      .request({
                        ...params,
                      })
                      .then(() => {
                        showToast({
                          title: '提交成功',
                        });
                        navigateBack();
                      });
                  } else {
                    const params = {
                      replyUrl: imgList.join(','),
                      replyContent: value.content,
                      complaintsId: parseInt(id),
                      type: 1,
                    };
                    useApi.追加回复
                      .request({
                        ...params,
                      })
                      .then(() => {
                        showToast({
                          title: '提交成功',
                        });
                        navigateBack();
                      });
                  }
                })
                .catch((err) => {
                  showToast({
                    title: err.errorFields[0].errors[0],
                    icon: 'none',
                  });
                });
            }}
          >
            提交
          </Button>
        </View>
      </Form>
      {IS_FEEDBACL && (
        <Space justify={'center'} className={styles.fixedBottom}>
          <CustomerReported
            whereShowCode={id ? 'XJYJFK_DB' : 'ZJHF_DB'}
            isFeed
          />
        </Space>
      )}
    </View>
  );
};
