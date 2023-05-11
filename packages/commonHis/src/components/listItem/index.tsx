import React, { ReactNode } from 'react';
import { FormItem, Exceed, Space } from '@kqinfo/ui';
import styles from './index.less';
import classNames from 'classnames';
import { PLATFORM } from '@/config/constant';
import { useHisConfig } from '@/hooks';
import { WxOpenLaunchWeapp } from '@/components';
export default ({
  label,
  text,
  elderly,
  className,
  orderDetail,
}: {
  label?: string;
  text?: string | ReactNode;
  elderly?: boolean;
  className?: string;
  orderDetail: any;
}) => {
  const path = window.location.href;
  const { config } = useHisConfig();

  return (
    <Space
      justify="flex-start"
      alignItems="center"
      className={classNames(styles.item, {
        [styles.elderly]: elderly,
      })}
    >
      <FormItem
        label={label}
        className={styles.title}
        labelCls={styles.title}
        colon
        labelWidth={'4em'}
      />
      <Space style={{ flexWrap: 'wrap', width: '100%' }}>
        <Exceed className={classNames(styles.text, className)}>
          {text || '暂无'}
        </Exceed>
        {config.enableRegInfoDeptNavigate &&
          path.includes('order-detail') &&
          PLATFORM === 'web' &&
          label == '就诊科室' && (
            <Exceed
              className={classNames(styles.text, className)}
              style={{ width: '100%', marginTop: '10px', color: '#3b98c3' }}
              onTap={() => {
                console.log(orderDetail);
              }}
            >
              导航前往
              <WxOpenLaunchWeapp
                username="gh_1828bcf09dc4"
                path={`pages/index/index?buildingId=${202597}&type=1&hisName=${'洁牙中心(冉)'}`}
                // path={`pages/index/index?buildingId=${this.state.deptInfo.summary}&type=1&hisName=${this.state.deptInfo.name}`}
              />
            </Exceed>
          )}
      </Space>
    </Space>
  );
};
