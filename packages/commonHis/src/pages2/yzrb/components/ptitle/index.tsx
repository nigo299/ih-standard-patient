import React from 'react';
import { Space } from '@kqinfo/ui';
import styles from './index.less';
interface Iprops {
  title?: string | React.ReactElement;
  extra?: React.ReactElement;
  isHide?: boolean;
}

export default (props: Iprops) => {
  const { title, extra } = props;
  return (
    <Space
      className={styles.ptitle}
      style={props.isHide ? { display: 'none' } : {}}
      alignItems={'center'}
      justify={'space-between'}
    >
      <Space className={styles.left} alignItems={'center'}>
        <Space className={styles.line} />
        {title}
      </Space>
      {extra}
    </Space>
  );
};
