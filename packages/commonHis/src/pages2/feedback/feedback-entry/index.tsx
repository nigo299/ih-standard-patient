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

import useGetParams from '@/utils/useGetParams';
import setNavigationBar from '@/utils/setNavigationBar';
import { usePageEvent } from 'remax/macro';
import globalState from '@/stores/global';
import styles from '@/pages2/feedback/feedback-add/index.less';
import IPD from './component/IPD';
import OPD from './component/OPD';
export default () => {
  const { initWxSDK } = globalState.useContainer();
  const { type = 'IPD' } = useGetParams<{
    type: string;
    deptName: string;
    deptId: string;
    doctorName: string;
    doctorId: string;
  }>();

  usePageEvent('onShow', () => {
    initWxSDK();
    setNavigationBar({
      title: '意见反馈',
    });
  });
  return (
    <View>
      {type === 'IPD' && <IPD />}
      {type === 'OPD' && <OPD />}
    </View>
  );
};
