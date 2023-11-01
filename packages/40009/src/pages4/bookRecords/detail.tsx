import React, { useState } from 'react';
import { View } from 'remax/one';
import {
  Space,
  Shadow,
  PartTitle,
  useTitle,
  Image,
  Video,
  Button,
} from '@kqinfo/ui';
import styles from './index.less';
import Status from './components/Status';
import Label from '@/components/label';
import Fold from './components/Fold';

export default () => {
  useTitle('MDT申请单');
  const [value, setValue] = useState<string[]>([
    'https://z3.ax1x.com/2021/04/12/cBYfTU.png',
    'https://z3.ax1x.com/2021/04/12/cBY4kF.png',
    'https://z3.ax1x.com/2021/04/13/cruEHH.png',
    'https://z3.ax1x.com/2021/04/13/cruEHH.png',
    'https://z3.ax1x.com/2021/04/13/cruEHH.png',
  ]);
  return (
    <View className={styles.warpPage}>
      <Shadow>
        <View className={styles.pane}>
          <Space className={styles.paneHead}>
            <PartTitle full>审核信息</PartTitle>
          </Space>
          <View className={styles.paneBody}>
            {[
              { label: '未通过原因', content: 'MDT' },
              { label: '退款到账', content: 'MDT' },
            ].map((item, index) => (
              <Space
                key={index}
                alignItems="center"
                className={styles.itemdesc}
              >
                <Label width={60}>{item.label}</Label>
                <View className={styles.value}>{item.content}</View>
              </Space>
            ))}
          </View>
        </View>
      </Shadow>
      <Shadow>
        <View className={styles.pane}>
          <Space className={styles.paneHead}>
            <PartTitle full>会诊信息</PartTitle>
            <Status status="1" />
          </Space>
          <View className={styles.paneBody}>
            {[
              { label: '会诊方式', content: 'MDT' },
              { label: '会诊团队', content: 'MDT' },
              { label: '会诊时间', content: 'MDT' },
              { label: '会诊地点', content: 'MDT' },
            ].map((item, index) => (
              <Space
                key={index}
                alignItems="center"
                className={styles.itemdesc}
              >
                <Label>{item.label}</Label>
                <View className={styles.value}>{item.content}</View>
              </Space>
            ))}
          </View>
        </View>
      </Shadow>
      <Shadow>
        <View className={styles.pane}>
          <Space className={styles.paneHead}>
            <PartTitle full>就诊人信息</PartTitle>
          </Space>
          <View className={styles.paneBody}>
            {[
              { label: '就诊人', content: 'MDT' },
              { label: '就诊ID', content: 'MDT' },
              { label: '联系方式', content: 'MDT' },
              {
                label: '症状描述',
                content: `言语行为与正常小孩有较大差别， 
              自闭，不爱说话，难以交流`,
              },
              { label: '过敏史', content: 'MDT' },
              { label: '慢病史', content: 'MDT' },
              { label: '手术史', content: 'MDT' },
            ].map((item, index) => (
              <Space
                key={index}
                alignItems="center"
                className={styles.itemdesc}
              >
                <Label>{item.label}</Label>
                <View className={styles.value}>{item.content}</View>
              </Space>
            ))}
            <Fold title="既往病史">
              {value.map((item, index) => (
                <Image src={item} key={index} className={styles.img} preview />
              ))}
            </Fold>
            <Fold title="患者上传视频资料">
              {value.map((item, index) => (
                <Video className={styles.img} src={item} key={index} />
              ))}
            </Fold>
          </View>
        </View>
      </Shadow>
      <View className={styles.bottomPane}>
        <Button className={styles.ghostbtn}>取消MDT</Button>
      </View>
    </View>
  );
};
