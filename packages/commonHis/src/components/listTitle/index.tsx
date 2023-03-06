import React from 'react';
import { View, Image } from 'remax/one';
import { PartTitle, Space } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import classNames from 'classnames';
import styles from './index.less';

export default (props: {
  title: string;
  showMore?: boolean;
  toggle?: boolean;
  rightElement?: React.ReactNode;
  onTap?: () => void;
  elderly?: boolean;
}) => {
  const {
    title,
    showMore = false,
    toggle = false,
    rightElement,
    onTap,
    elderly,
  } = props;
  return (
    <Space
      alignItems="center"
      justify="space-between"
      className={classNames(styles.title, {
        [styles.elderly]: elderly,
      })}
    >
      <PartTitle full={elderly} bold={elderly} elderly={elderly}>
        {title}
      </PartTitle>
      {rightElement}
      {showMore && (
        <Space
          className={styles.more}
          onTap={() => onTap && onTap()}
          alignItems="center"
        >
          <View>{toggle ? '收起信息' : '查看更多'}</View>
          <Image
            mode="aspectFit"
            src={`${IMAGE_DOMIN}/payment/${
              elderly ? 'arrowTop-old' : 'arrowTop'
            }.png`}
            className={classNames(styles.arrow, {
              [styles.down]: !toggle,
            })}
          />
        </Space>
      )}
    </Space>
  );
};
