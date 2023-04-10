import React, { useCallback, useState } from 'react';
import { View, Text, Image, navigateTo, redirectTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Button, showToast, Space, Loading, FormItem } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import useApi from '@/apis/common';
import styles from './index.less';
import patientState from '@/stores/patient';
import { useUpload } from '@/hooks';
import { useUpdateEffect } from 'ahooks';
import { encryptIdNo } from '@/utils';

export default () => {
  const { getPatientList, defaultPatientInfo, setDefaultPatientInfo } =
    patientState.useContainer();
  const uploader = useUpload();
  const [pictureUrls, setPictureUrls] = useState({
    pictureUrl1: '',
    pictureUrl2: '',
  });
  const { request, loading, data } = useApi.透传字段({
    params: {
      transformCode: 'KQ00036',
      patCardNo: defaultPatientInfo.patCardNo,
      pictureUrl1: '',
      pictureUrl2: '',
    },
    needInit: !!defaultPatientInfo.patCardNo,
  });
  const uploadImg = useCallback(
    async (type: '1' | '2') => {
      const result = await uploader({
        maxLength: 1,
      });
      if (result[0]) {
        if (type === '1') {
          setPictureUrls({
            ...pictureUrls,
            pictureUrl1: result[0],
          });
        }
        if (type === '2') {
          setPictureUrls({
            ...pictureUrls,
            pictureUrl2: result[0],
          });
        }
      }
    },
    [pictureUrls, uploader],
  );

  useUpdateEffect(() => {
    if (data?.data?.data?.pictureUrl1 || data?.data?.data?.pictureUrl2) {
      setPictureUrls({
        pictureUrl1: data.data.data.pictureUrl1,
        pictureUrl2: data.data.data.pictureUrl2,
      });
    } else {
      setPictureUrls({
        pictureUrl1: '',
        pictureUrl2: '',
      });
    }
  }, [data]);
  usePageEvent('onShow', async () => {
    if (!defaultPatientInfo?.patientName) {
      getPatientList(false).then((res) => {
        if (res.length === 0) {
          showToast({
            title: '请先添加就诊人!',
            icon: 'none',
          }).then(() => {
            navigateTo({
              url: `/pages2/usercenter/add-user/index`,
            });
          });
        }
      });
    }
    setNavigationBar({
      title: '网约/出租车核酸检测',
    });
  });
  return (
    <View className={styles.page}>
      {loading && <Loading type={'top'} />}
      <Space className={styles.top} alignItems="flex-start">
        <Space alignItems="center">
          <Image
            src={`${IMAGE_DOMIN}/nucleic/logo.png`}
            className={styles.logo}
          />
          <View>网约/出租车核酸检测</View>
        </Space>
      </Space>

      <Space className={styles.content} vertical>
        <Space
          className={styles.comboUser}
          justify="flex-start"
          alignItems="center"
        >
          <Space
            flex="auto"
            alignItems="center"
            justify="space-between"
            onTap={() =>
              redirectTo({
                url: '/pages2/usercenter/select-user/index?pageRoute=/pages2/nucleic/upload/index',
              })
            }
            className={styles.comboUserWrap}
          >
            <Space>
              <Image
                src={`${IMAGE_DOMIN}/nucleic/user.png`}
                className={styles.userImg}
              />

              <Space
                vertical
                size={20}
                className={styles.userName}
                alignItems="flex-start"
              >
                <View>{defaultPatientInfo.patientName || '暂无'}</View>
                <View className={styles.userText}>切换当前就诊人</View>
              </Space>
            </Space>

            <Image
              src={`${IMAGE_DOMIN}/nucleic/down.png`}
              className={styles.downImg}
            />
          </Space>
        </Space>

        <Space vertical className={styles.card}>
          <Space alignItems="center" className={styles.label}>
            <FormItem
              label="姓名"
              labelWidth={'4em'}
              className={styles.labelName}
            />
            <View className={styles.labelValue}>
              {defaultPatientInfo?.parentName}
            </View>
          </Space>
          <Space alignItems="center" className={styles.label}>
            <FormItem
              label="证件号码"
              labelWidth={'4em'}
              className={styles.labelName}
            />
            <View className={styles.labelValue}>
              {defaultPatientInfo?.patientFullIdNo &&
                encryptIdNo(defaultPatientInfo?.patientFullIdNo)}
            </View>
          </Space>
          <View className={styles.cardTip}>
            成人绑卡后只可预约核酸检测号源，现仅支持身份证注册，平台陆续会开放其他证件注册，我院将对您提供的信息严格保密
          </View>
          <Space alignItems="center" className={styles.label}>
            <FormItem
              label="证件类型"
              labelWidth={'4em'}
              className={styles.labelName}
            />
            <View className={styles.labelValue}>道路运营从业资格证</View>
          </Space>

          <Space
            justify="center"
            alignItems="center"
            vertical
            className={styles.cardWrap}
          >
            <Space className={styles.cameraWrap} onTap={() => uploadImg('1')}>
              <Image
                src={pictureUrls.pictureUrl1 || `${IMAGE_DOMIN}/nucleic/zm.png`}
                className={styles.cardImg}
              />
              <Space
                justify="center"
                alignItems="center"
                className={styles.uploadWrap}
              >
                <Image
                  src={
                    pictureUrls.pictureUrl1
                      ? `${IMAGE_DOMIN}/nucleic/success.png`
                      : `${IMAGE_DOMIN}/nucleic/camera.png`
                  }
                  className={styles.uploadImg}
                />
              </Space>
            </Space>
            <Space className={styles.cameraWrap} onTap={() => uploadImg('2')}>
              <Image
                src={pictureUrls.pictureUrl2 || `${IMAGE_DOMIN}/nucleic/bm.png`}
                className={styles.cardImg}
              />
              <Space
                justify="center"
                alignItems="center"
                className={styles.uploadWrap}
              >
                <Image
                  src={
                    pictureUrls.pictureUrl2
                      ? `${IMAGE_DOMIN}/nucleic/success.png`
                      : `${IMAGE_DOMIN}/nucleic/camera.png`
                  }
                  className={styles.uploadImg}
                />
              </Space>
            </Space>
            <View className={styles.cardText}>
              请确保证件类型和实际上传图片一致
            </View>
          </Space>
        </Space>
        <View className={styles.cardWrap2}>
          <Space vertical className={styles.tip}>
            <Space alignItems="center" className={styles.tipTitle}>
              <Image
                src={`${IMAGE_DOMIN}/nucleic/wxts.png`}
                className={styles.tipImg}
              />
              <View>拍摄道路运营从业资格证要求</View>
            </Space>
            <View className={styles.tipText}>
              道路运营人员持有的本人有效运营资格原件；
            </View>
            <View className={styles.tipText}>
              拍摄时确保个人信息页
              <Text className={styles.tipText2}>
                边框完整，字体清晰，亮度均匀。
              </Text>
            </View>
          </Space>

          <Space justify="space-between">
            <Space alignItems="center" vertical>
              <Image
                src={`${IMAGE_DOMIN}/nucleic/bz.png`}
                className={styles.promptImg}
              />
              <View className={styles.promptText}>标准</View>
            </Space>
            <Space alignItems="center" vertical>
              <Image
                src={`${IMAGE_DOMIN}/nucleic/bkqs.png`}
                className={styles.promptImg}
              />
              <View className={styles.promptText}>边框缺失</View>
            </Space>
            <Space alignItems="center" vertical>
              <Image
                src={`${IMAGE_DOMIN}/nucleic/zpmh.png`}
                className={styles.promptImg}
              />
              <View className={styles.promptText}>照片模糊</View>
            </Space>
            <Space alignItems="center" vertical>
              <Image
                src={`${IMAGE_DOMIN}/nucleic/sggd.png`}
                className={styles.promptImg}
              />
              <View className={styles.promptText}>闪光过度</View>
            </Space>
          </Space>
        </View>
      </Space>
      <Button
        type="primary"
        className={styles.button}
        onTap={() => {
          if (pictureUrls.pictureUrl1 && pictureUrls.pictureUrl2) {
            if (!data?.data?.data?.pictureUrl1) {
              request({
                transformCode: 'KQ00036',
                patCardNo: defaultPatientInfo.patCardNo,
                pictureUrl1: pictureUrls.pictureUrl1,
                pictureUrl2: pictureUrls.pictureUrl2,
              });
            }
            setDefaultPatientInfo(defaultPatientInfo);
            navigateTo({
              url: '/pages2/nucleic/select-combo/index?type=2',
            });
          } else {
            showToast({
              icon: 'none',
              title: '请先上传从业资格证',
            });
          }
        }}
      >
        下一步
      </Button>
    </View>
  );
};
