import React, { useEffect } from 'react';
import { Space } from '@kqinfo/ui';
import storage from '@/utils/storage';
import { reLaunchUrl } from '@/utils';

export default () => {
  useEffect(() => {
    storage.clear();
    reLaunchUrl('/pages/home/index');
  }, []);
  return (
    <Space
      alignItems={'center'}
      vertical
      justify="center"
      style={{ width: '100%', height: '100%' }}
    >
      重置成功
    </Space>
  );
};
