import React from 'react';
import { View } from 'remax/one';
import { Shadow, PartTitle } from '@kqinfo/ui';
import classNames from 'classnames';
import styles from './index.less';

interface Props {
  title: string;
  footer?: JSX.Element;
}
const ShowTitle: React.FC<Props> = (props) => {
  const { title, children, footer = null } = props;
  return (
    <Shadow className={styles.shadow_txt}>
      <View
        className={classNames(styles.show_title, {
          [styles.paddingTopAndBottom]: !footer,
          [styles.paddingTop]: footer,
        })}
      >
        <PartTitle className={styles.part_title} bold={false}>
          {title}
        </PartTitle>
        <View className={styles.children_content}>{children}</View>
        {footer && <View className={styles.footer_top}>{footer}</View>}
      </View>
    </Shadow>
  );
};

export default ShowTitle;
