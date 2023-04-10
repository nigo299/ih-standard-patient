/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Image } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  ColorText,
  Space,
  Button,
  chooseImage,
  OCR,
  showToast,
} from '@kqinfo/ui';
import { THEME_COLOR, IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';

export default () => {
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '上传身份证',
    });
  });

  return (
    <View className={styles.page}>
      <ColorText fontWeight={'bold'} fontSize={'36'} color={THEME_COLOR}>
        上传成人就诊人或儿童监护人身份证件照片
      </ColorText>
      <Space
        vertical
        justify="center"
        alignItems="center"
        className={styles.card}
      >
        <Image
          src={`${IMAGE_DOMIN}/usercenter/sfzj.png`}
          mode="aspectFit"
          className={styles.cardImg}
        />
        <Space
          justify="center"
          alignItems="center"
          className={styles.photo}
          // onTap={() => {
          //   OCR({ basicPlatformToken: '' })
          //     .then(({ name, no }) => console.log({ name, no }))
          //     .catch(() => showToast({ icon: 'none', title: '暂不能演示' }));
          // }}
        >
          <Image
            src={`${IMAGE_DOMIN}/usercenter/photo.png`}
            mode="aspectFit"
            className={styles.photoImg}
          />
        </Space>
        <ColorText fontSize={'36'} color={'#00923F'}>
          点击中间按钮开始上传
        </ColorText>
      </Space>
      <ColorText fontSize={'36'} color={'#D95E38'}>
        注：身份证信息仅用于在线建立我院实名就医 档案，我院将对您的信息严格保密
      </ColorText>
      <Space vertical className={styles.buttons}>
        <Button type="primary" ghost elderly>
          身份信息有误，重新上传
        </Button>
        <Button type="primary" elderly className={styles.button}>
          身份信息确认无误，提交
        </Button>
      </Space>
    </View>
  );
};
