import React from 'react';
import { View } from 'remax/one';
import { Icon, Rotate, Space } from '@kqinfo/ui';
import styles from './index.less';
export default ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [run, setRun] = React.useState(false);
  return (
    <Space className={styles.fold} vertical>
      <Space
        alignItems="center"
        justify="space-between"
        onTap={() => setRun(!run)}
        className={styles.foldHead}
      >
        {title}
        <Space alignItems="center" className={styles.actiontxt} size={10}>
          {!run ? '展开' : '收起'}
          <Rotate run={run} angle={180}>
            <Icon name={'kq-down'} size={20} color={'#666666'} />
          </Rotate>
        </Space>
      </Space>
      {run && <View className={styles.content}>{children}</View>}
    </Space>
  );
};
