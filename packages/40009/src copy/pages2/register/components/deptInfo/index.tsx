import React from 'react';
import { View } from 'remax/one';
import { Shadow, Exceed, Icon, Space } from '@kqinfo/ui';
import styles from './index.less';
import { PreviewImage } from '@/components';

export interface Props {
  onDetailTap: () => void;
  tag?: string;
  deptImg: string;
  deptName: string;
  hospitalName: string;
  summary: string;
}

export default ({
  deptImg,
  deptName,
  tag,
  hospitalName,
  summary,
  onDetailTap,
}: Props) => {
  return (
    <Shadow card>
      <Space className={styles.card} vertical onTap={onDetailTap}>
        <Space className={styles.info}>
          <Space
            className={styles.imgWrap}
            justify="center"
            alignItems="center"
          >
            <PreviewImage url={deptImg} className={styles.deptImg} />
          </Space>
          <Space
            className={styles.texts}
            justify="space-between"
            alignItems="center"
          >
            <View>
              <Space alignItems="center" className={styles.title}>
                {deptName}
                <View className={styles.tag}>{tag}</View>
              </Space>
              <View className={styles.text}>{hospitalName}</View>
            </View>
            <View className={styles.detail}>
              <Icon name={'kq-right'} color="#CCCCCC" />
            </View>
          </Space>
        </Space>
        <Exceed className={styles.doc}>{summary}</Exceed>
      </Space>
    </Shadow>
  );
};
