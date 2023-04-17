import React, { useState, useCallback } from 'react';
import { View } from 'remax/one';
import { Space } from '@kqinfo/ui';
import { IS_FEEDBACL, PLATFORM } from '@/config/constant';
import classNames from 'classnames';
import { setClipboardData, showToast } from '@kqinfo/ui';
import styles from './index.less';
import dayjs from 'dayjs';
import storage from '@/utils/storage';
import Feedback from '@/components/feedback';
export default ({
  dept,
  clear,
  hospitalId,
  subHospitalId,
}: {
  dept?: boolean;
  clear?: boolean;
  hospitalId?: string;
  subHospitalId?: string;
}) => {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    const result = count + 1;
    setCount(result);
    if (result >= 5 && dept) {
      setCount(0);
      setClipboardData({
        data: `${window.location.origin}${window.location.pathname}#${
          storage.get('authUrl') || ''
        }`,
      }).then(() => showToast({ title: '复制成功', icon: 'success' }));
    }
    if (result >= 5 && clear) {
      setCount(0);
      storage.clear();
      showToast({ title: '清楚缓存成功', icon: 'success' });
    }
  }, [clear, count, dept]);
  return (
    <Space
      justify="center"
      alignItems="center"
      vertical
      className={classNames(styles.copyRight, {
        [styles.web]: PLATFORM === 'web',
        [styles.dept]: dept,
      })}
      onTap={handleClick}
    >
      {IS_FEEDBACL ? (
        <Space alignItems="center">
          {`由凯桥信息提供技术支持 |`}
          {subHospitalId && hospitalId && (
            <Feedback
              path={`pages/chat/index?subhospitalId=${subHospitalId}&hospitalId=${hospitalId}`}
            />
          )}
        </Space>
      ) : (
        <View>由凯桥信息提供技术支持</View>
      )}
      <View>Copyright©2010-{dayjs().format('YYYY')}</View>
    </Space>
  );
};
