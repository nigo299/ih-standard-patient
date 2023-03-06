import React from 'react';
import { View, Image, Button } from 'remax/one';
import { Shadow, Exceed, Space, Platform } from '@kqinfo/ui';
import { IMAGE_DOMIN, PLATFORM } from '@/config/constant';
import styles from './index.less';
import classNames from 'classnames';
import { PreviewImage } from '@/components';

export interface Props {
  isAttention?: boolean;
  onAttentionTap?: () => void;
  onShareTap?: () => { title: string; path: string };
  onDetailTap: () => void;
  tag?: string;
  doctorImg: string;
  doctorTitle: string;
  doctorName: string;
  hospitalName: string;
  summary: string;
}

export default ({
  doctorImg,
  doctorName,
  doctorTitle,
  tag,
  isAttention,
  hospitalName,
  summary,
  onDetailTap,
  onAttentionTap,
  onShareTap,
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
            <PreviewImage url={doctorImg} className={styles.doctorImg} />
          </Space>
          <View className={styles.texts}>
            <Space className={styles.title}>
              <Space alignItems="center">
                <Exceed className={styles.doctorName} clamp={1}>
                  {doctorName}
                </Exceed>
                <View className={styles.tag}>{tag}</View>
              </Space>
              <Space
                className={classNames(styles.right, {
                  [styles.rightWeb]: PLATFORM !== 'wechat',
                })}
                justify="space-between"
                alignItems="center"
              >
                <Space
                  vertical
                  alignItems="center"
                  onTap={(e) => {
                    e.stopPropagation();
                    onAttentionTap && onAttentionTap();
                  }}
                  className={classNames(styles.share, {
                    [styles.attention]: isAttention,
                  })}
                >
                  <Image
                    src={`${IMAGE_DOMIN}/register/${
                      isAttention ? 'ygz' : 'wgz'
                    }.png`}
                    className={styles.rightImg}
                  />
                  <View>{isAttention ? '已关注' : '关注'}</View>
                </Space>
                <Platform platform={['wechat']}>
                  <Button
                    wechat-openType="share"
                    onTap={(e) => {
                      e.stopPropagation();
                      onShareTap && onShareTap();
                    }}
                    className={styles.button}
                  >
                    <Space vertical alignItems="center">
                      <Image
                        src={`${IMAGE_DOMIN}/register/fx.png`}
                        className={styles.rightImg}
                      />
                      <View>分享</View>
                    </Space>
                  </Button>
                </Platform>
              </Space>
            </Space>
            <View className={styles.text}>{doctorTitle}</View>
            <View className={styles.hospitalName}>{hospitalName}</View>
          </View>
        </Space>
        <Exceed
          className={styles.doc}
          moreCls={styles.more}
          more={<View>详情</View>}
        >
          {summary}
        </Exceed>
      </Space>
    </Shadow>
  );
};
