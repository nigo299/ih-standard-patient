import React, { useRef, useState } from 'react';
import { View, navigateTo } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import {
  Icon,
  Space,
  Shadow,
  Button,
  Sheet,
  ReInput,
  showToast,
} from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import { WhiteSpace, PreviewImage } from '@/components';
import classNames from 'classnames';
import { SheetInstance } from '@kqinfo/ui/es/sheet';
import { encryptPhone } from '@/utils';
import globalState from '@/stores/global';
import useApi from '@/apis/login';

export default () => {
  const { user, getUserInfo } = globalState.useContainer();
  const [nameVal, setNameVal] = useState('');
  const sheetRef = useRef<SheetInstance>(null);
  usePageEvent('onShow', () => {
    getUserInfo(true);
    setNavigationBar({
      title: '个人信息',
    });
  });
  return (
    <View className={styles.page}>
      <Sheet ref={sheetRef} center>
        <Space vertical className={styles.modal}>
          <Space className={styles.modalTitle} justify="center">
            完善姓名
          </Space>
          <Space className={styles.modalWrap} justify="center">
            <ReInput
              placeholder="请输入姓名"
              className={styles.modalInput}
              value={nameVal}
              onChange={(val) => {
                if (val) {
                  setNameVal(val);
                } else {
                  setNameVal('');
                }
              }}
            />
          </Space>
          <Space className={styles.modalBtns} justify="space-between">
            <Space
              justify="center"
              alignItems="center"
              className={styles.modalBtn}
              onTap={() => sheetRef.current?.setVisible(false)}
            >
              取消
            </Space>
            <Space
              justify="center"
              alignItems="center"
              className={styles.modalBtn2}
              onTap={() => sheetRef.current?.setVisible(false)}
            >
              确定
            </Space>
          </Space>
        </Space>
      </Sheet>
      <Shadow card style={{ padding: 0 }}>
        <View>
          <Space
            justify="space-between"
            alignItems="center"
            className={styles.item}
          >
            <View className={styles.title}>头像</View>
            <PreviewImage
              url={user?.headImage || `${IMAGE_DOMIN}/mine/avatar.png`}
              className={styles.avatar}
            />
          </Space>
          <Space
            justify="space-between"
            alignItems="center"
            className={styles.item}
          >
            <View className={styles.title}>姓名</View>
            <View
              className={styles.text}
              onTap={() => sheetRef.current?.setVisible(true)}
            >
              {nameVal || user?.realName || user?.nickName || '完善'}
            </View>
          </Space>
          <Space
            justify="space-between"
            alignItems="center"
            className={styles.item}
          >
            <View className={styles.title}>账号</View>
            <View className={styles.text2}>{user?.accountName}</View>
          </Space>
        </View>
      </Shadow>
      <WhiteSpace />
      <Shadow card>
        <Space
          justify="space-between"
          alignItems="center"
          className={classNames(styles.item, styles.item2)}
          onTap={() =>
            navigateTo({
              url: '/pages/mine/bind-phone/index',
            })
          }
        >
          <View className={styles.title}>手机号</View>
          <Space alignItems="center">
            <View>{user.phone && encryptPhone(user.phone)}</View>
            <Icon
              name="kq-right"
              color="#CBCCCB"
              className={styles.rightIcon}
            />
          </Space>
        </Space>
      </Shadow>
      <Button
        type="primary"
        className={styles.button}
        bold
        disabled={!nameVal}
        onTap={() => {
          useApi.修改用户姓名
            .request({
              realName: nameVal,
            })
            .then((res) => {
              if (res.code === 0) {
                getUserInfo(true);
                setNameVal('');
                showToast({
                  icon: 'success',
                  title: '更新用户信息成功!',
                });
              }
            });
        }}
      >
        提交
      </Button>
    </View>
  );
};
