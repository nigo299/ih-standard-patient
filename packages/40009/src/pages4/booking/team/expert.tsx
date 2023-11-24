import React, { useState } from 'react';
import { View, Text } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Space, RichText } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import ShowTitle from './components/showTitle';
import { PreviewImage } from '@/components';
import storage from '@/utils/storage';
export default () => {
  const [info, setInfo] = useState<any>({});

  usePageEvent('onShow', async () => {
    let info = {};
    try {
      info = JSON.parse(storage.get('teamInfo') || '{}');
    } catch (error) {
      info = {};
    }
    setInfo(info);
    setNavigationBar({
      title: '专家介绍',
    });
  });
  console.log('info', info);
  // const toggleCollect = () => {
  //   setHasCollect(!hasCollect);
  // };
  return (
    <View className={styles.page}>
      <View style={{ width: '100%' }}>
        <Space className={styles.detail_top} size={'10px'}>
          <Space size={'10px'} style={{ flex: 1 }}>
            <PreviewImage
              url={
                info.doctorImage
                  ? info.doctorImage
                  : `${IMAGE_DOMIN}/mdt/ys2.png`
              }
              className={styles.user_icon}
            />
            <View className={styles.detail_top_right}>
              <Text className={styles.right_name}>
                {info.doctorName || ''}&nbsp;|&nbsp;{info.doctorLevel || ''}
              </Text>
              <View className={styles.top_right_bottom}>
                <Text>{info.deptName || ''}</Text>
                <Text
                  className={`${styles.border_hos_name} ${styles.border_hos_name_unique}`}
                >
                  本部
                </Text>
              </View>
            </View>
          </Space>
          {/* <View className={styles.expert_icon}>
            <Image
              src={`${IMAGE_DOMIN}/mdt/${hasCollect ? 'sc_full' : 'sc'}.png`}
              className={styles.share_icon}
              onTap={toggleCollect}
            />
            <Image
              src={`${IMAGE_DOMIN}/mdt/share.png`}
              className={styles.share_icon}
            />
          </View> */}
        </Space>
        <View className={styles.detail_content}>
          <View className={styles.inner_content}>
            <View className={styles.item_gap}>
              <ShowTitle title="擅长领域">
                <Text>{info.doctorSpecialty || ''}</Text>
              </ShowTitle>
            </View>
            <View className={styles.item_gap}>
              <ShowTitle title="医生简介">
                <RichText nodes={info.doctorIntroduction || ''} />
              </ShowTitle>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
