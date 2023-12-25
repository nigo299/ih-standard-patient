import React from 'react';
import { Space, Button } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import { Image, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import globalState from '@/stores/global';
import styles from '@/app.less';
import classNames from 'classnames';
import reload from '@/utils/reload';
import CustomerReported from '@/components/customerReported';

export default (props: { error: string }) => {
  const { elderly } = globalState.useContainer();
  usePageEvent('onShow', () => {
    console.log('报错消息: ', props.error);
    setNavigationBar({
      title: '页面异常',
    });
  });
  return (
    <Space
      alignItems="center"
      vertical
      className={classNames(styles.error, {
        [styles.elderly]: elderly,
      })}
    >
      <Image src={`${IMAGE_DOMIN}/error/error.png`} mode="aspectFill" />
      <Space vertical alignItems={'center'} size={20}>
        <Text className={styles.errorText}>页面遇到一些问题~</Text>
        <CustomerReported whereShowCode={'YMYDWT_ZJ'} />
      </Space>
      <Space className={styles.buttons}>
        <Button
          type="primary"
          elderly={elderly}
          onTap={() => {
            reload();
          }}
          className={styles.button}
        >
          返回重试
        </Button>
      </Space>
    </Space>
  );
};
