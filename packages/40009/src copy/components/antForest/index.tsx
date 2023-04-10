import React, { useState } from 'react';
import { Space } from '@kqinfo/ui';
import { View, Image } from 'remax/one';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import Mask from '@/components/mask';

export default () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Mask show={show} close={() => setShow(false)} center>
        <Space vertical className={styles.propmpt}>
          <Space
            alignItems="center"
            className={styles.content}
            flex="auto"
            vertical
          >
            <Image
              src={`${IMAGE_DOMIN}/alipay/nlbj.png`}
              className={styles.bg}
            />
            <View className={styles.title}> 预约挂号、查报告得绿色能量</View>
            <Space vertical className={styles.propmptText}>
              <View>
                完成预约挂号，得绿色能量 277g/笔， 每月上限5笔（取消挂号失效）
              </View>
              <View> 完成报告查询，得绿色能量 2g/笔，</View>
              <View>每月上限10次</View>
              <View>
                得到的绿色能量可以前往【蚂蚁森林】用来种树，改善我们的环境
              </View>
            </Space>
          </Space>
          <Space
            justify="center"
            alignItems="center"
            className={styles.button}
            onTap={() => setShow(false)}
          >
            知道了
          </Space>
        </Space>
      </Mask>
      <Space
        alignItems="center"
        justify="center"
        className={styles.antForest}
        onTap={() => setShow(true)}
      >
        <Image
          src={`${IMAGE_DOMIN}/alipay/nlq.png`}
          className={styles.nlqImg}
        />
        预约挂号预计得蚂蚁森林能量 <View className={styles.text}>277g</View>
      </Space>
    </>
  );
};
