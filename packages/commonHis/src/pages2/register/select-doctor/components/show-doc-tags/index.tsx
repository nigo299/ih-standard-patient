import React from 'react';
import classNames from 'classnames';
import { View, navigateTo } from 'remax/one';
import { Exceed, Shadow, Space, showToast } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from '@/pages2/register/select-doctor/components/show-doc-tags/index.less';
import { PreviewImage } from '@/components';

const ShowDocTags = (data: any) => {
  const {
    data: { item, date, deptId, type },
  } = data;
  const {
    leftSource,
    image,
    name,
    registerFee,
    doctorSkill,
    title = '',
    level = '',
    sourceType = '',
  } = item;

  return (
    <Shadow>
      <View
        className={styles.doctor}
        onTap={() => {
          if (item.leftSource > 0) {
            navigateTo({
              url: `/pages2/register/select-time/index?deptId=${deptId}&doctorId=${
                item.doctorId
              }&scheduleDate=${date.format(
                'YYYY-MM-DD',
              )}&doctorName=${name}&sourceType=${sourceType}&type=${type}&level=${level}&title=${title}`,
            });
          } else {
            showToast({
              icon: 'none',
              title: '当前医生暂无号源!',
            });
          }
        }}
      >
        <PreviewImage
          url={
            (image !== 'null' && image) || `${IMAGE_DOMIN}/register/doctor.png`
          }
          className={styles.photo}
        />
        <View className={styles.doctorInfo}>
          <View style={{ display: 'flex' }}>
            <View className={styles.left}>
              <View className={styles.name}>{name}</View>
            </View>
            <View
              className={classNames(styles.rests, {
                [styles.disable]: leftSource === 0 || item.status === 2,
              })}
            >
              <Space
                className={styles.restPrice}
                alignItems="center"
                justify="center"
              >
                <View className={styles.restPriceAfter} />¥
                {(registerFee / 100).toFixed(2)}
              </Space>
              <Space
                className={styles.restNum}
                alignItems="center"
                justify="center"
              >
                {item.status === 0 && '停诊'}
                {item.status === 1 &&
                  `余号: ${leftSource > 0 ? leftSource : 0}`}
                {item.status === 2 && '满诊'}
              </Space>
            </View>
          </View>
          <Space className={styles.subtitle} flexWrap="nowrap">
            <View style={{ marginRight: '8px' }}>{title}</View>
            <Exceed
              clamp={1}
              style={{
                backgroundColor: '#fa9e49',
                color: 'white',
                fontWeight: 'normal',
                boxSizing: 'border-box',
                padding: '0px 4px',
                borderRadius: '4px',
              }}
            >
              {'教学号、口腔内科治疗'}
            </Exceed>
          </Space>
          <Exceed clamp={1} className={styles.doctorText}>
            {`擅长: ${
              doctorSkill && doctorSkill !== 'null' ? doctorSkill : '暂无'
            }`}
          </Exceed>
        </View>
      </View>
    </Shadow>
  );
};

export default ShowDocTags;
