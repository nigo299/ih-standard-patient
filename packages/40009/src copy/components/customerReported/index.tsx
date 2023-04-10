import React from 'react';
import { View } from 'remax/one';
import { IS_FEEDBACL } from '@/config/constant';
import Feedback from '@/components/feedback';
import { Space } from '@kqinfo/ui';
import styles from '@/pages2/register/order-list/index.less';
import useApi2 from '@/apis/common';

export default ({
  whereShowCode,
  isFeed,
}: {
  whereShowCode: string;
  isFeed?: boolean;
}) => {
  console.log(whereShowCode, 'whereShowCode');
  const {
    data: { data: configList },
  } = useApi2.查询配置列表({
    params: {
      status: 1,
      whereShowCode: whereShowCode,
      whereUse: 'GZH',
    },
    initValue: {
      data: { data: [] },
    },
    needInit: IS_FEEDBACL,
  });

  return (
    <View>
      {IS_FEEDBACL &&
        configList?.[0]?.subHospitalId &&
        configList?.[0]?.hospitalId && (
          <Feedback
            textSty={{
              color: '#A30014',
              fontSize: '14PX',
              textDecoration: 'underline',
            }}
            text={
              <Space alignItems={'center'} size={10}>
                <Space
                  alignItems={'center'}
                  justify={'center'}
                  className={styles.iconMark}
                >
                  ?
                </Space>
                系统故障反馈
              </Space>
            }
            path={`pages/${isFeed ? 'feedback' : 'chat'}/index?subhospitalId=${
              configList?.[0]?.subHospitalId
              // 55
            }&hospitalId=${configList?.[0]?.hospitalId}`}
            // }&hospitalId=${40}`}
          />
        )}
    </View>
  );
};
