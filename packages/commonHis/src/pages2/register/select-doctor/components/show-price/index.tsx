import React from 'react';
import classNames from 'classnames';
import { View, navigateTo, Text } from 'remax/one';
import { Exceed, Shadow, Space, showToast } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from '@/pages2/register/select-doctor/components/show-price/index.less';
import { PreviewImage } from '@/components';

const ShowPrice = (data: any) => {
  const {
    data: { item, date, deptId, type },
  } = data;
  const {
    leftSource,
    image,
    name,
    deptName,
    registerFee,
    doctorSkill,
    title = '',
    level = '',
    sourceType = '',
    extFields = { doctorInitialRegFee: '0' },
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
            <View className={styles.subtitle}>
              {`${deptName} | ${title || ''}`}
            </View>
          </View>

          <Exceed clamp={1} className={styles.doctorText}>
            {`擅长: ${
              doctorSkill && doctorSkill !== 'null' ? doctorSkill : '暂无'
            }`}
          </Exceed>
        </View>
        {extFields?.timeFlag1 &&
          extFields?.timeFlag1?.split('|')[1] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                上午 总号{extFields.timeFlag1?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag1?.split('|')[1]}
                </Text>
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
                  <View className={styles.restPriceAfter} />
                  {extFields.doctorInitialRegFee === '0'
                    ? ''
                    : `¥${(extFields?.doctorInitialRegFee / 100).toFixed(2)}`}
                </Space>
                <Space
                  className={styles.restNum}
                  alignItems="center"
                  justify="center"
                >
                  ¥{(registerFee / 100).toFixed(2)}
                </Space>
              </View>
            </Space>
          )}
        {extFields?.timeFlag2 &&
          extFields?.timeFlag2?.split('|')[1] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                下午 总号{extFields.timeFlag2?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag2?.split('|')[1]}
                </Text>
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
                  <View className={styles.restPriceAfter} />
                  {extFields.doctorInitialRegFee === '0'
                    ? ''
                    : `¥${(extFields?.doctorInitialRegFee / 100).toFixed(2)}`}
                </Space>
                <Space
                  className={styles.restNum}
                  alignItems="center"
                  justify="center"
                >
                  ¥{(registerFee / 100).toFixed(2)}
                </Space>
              </View>
            </Space>
          )}
        {extFields?.timeFlag3 &&
          extFields?.timeFlag3?.split('|')[1] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                晚上 总号{extFields.timeFlag3?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag3?.split('|')[1]}
                </Text>
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
                  <View className={styles.restPriceAfter} />
                  {extFields.doctorInitialRegFee === '0'
                    ? ''
                    : `¥${(extFields?.doctorInitialRegFee / 100).toFixed(2)}`}
                </Space>
                <Space
                  className={styles.restNum}
                  alignItems="center"
                  justify="center"
                >
                  ¥{(registerFee / 100).toFixed(2)}
                </Space>
              </View>
            </Space>
          )}
        {extFields?.timeFlag4 &&
          extFields?.timeFlag4?.split('|')[1] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                白天 总号{extFields.timeFlag4?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag4?.split('|')[1]}
                </Text>
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
                  <View className={styles.restPriceAfter} />
                  {extFields.doctorInitialRegFee === '0'
                    ? ''
                    : `¥${(extFields?.doctorInitialRegFee / 100).toFixed(2)}`}
                </Space>
                <Space
                  className={styles.restNum}
                  alignItems="center"
                  justify="center"
                >
                  ¥{(registerFee / 100).toFixed(2)}
                </Space>
              </View>
            </Space>
          )}
        {extFields?.timeFlag5 &&
          extFields?.timeFlag5?.split('|')[1] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                全天 总号{extFields.timeFlag5?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag5?.split('|')[1]}
                </Text>
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
                  <View className={styles.restPriceAfter} />
                  {extFields.doctorInitialRegFee === '0'
                    ? ''
                    : `¥${(extFields?.doctorInitialRegFee / 100).toFixed(2)}`}
                </Space>
                <Space
                  className={styles.restNum}
                  alignItems="center"
                  justify="center"
                >
                  ¥{(registerFee / 100).toFixed(2)}
                </Space>
              </View>
            </Space>
          )}
      </View>
    </Shadow>
  );
};

export default ShowPrice;
