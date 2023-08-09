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
  const { type = undefined } = useGetParams<{
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
  return <View className={styles.pageFeedbackAdd}>{'xxx'}</View>;
};
