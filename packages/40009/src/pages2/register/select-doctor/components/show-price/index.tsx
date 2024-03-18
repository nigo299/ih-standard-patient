import React from 'react';
import classNames from 'classnames';
import { View, navigateTo, Text } from 'remax/one';
import { Exceed, Shadow, Space, showToast } from '@kqinfo/ui';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from '@/pages2/register/select-doctor/components/show-price/index.less';
import { PreviewImage } from '@/components';

const TIME_FLAG_ENUM = {
  1: '上午',
  2: '下午',
  3: '晚上',
  4: '全天',
  5: '白天',
  6: '中午',
  7: '凌晨',
};

const ShowPrice = (data: any) => {
  const {
    data: { item, date, deptId, type },
    oneDeptNo,
  } = data;
  const {
    image,
    name,
    deptName,
    registerFee,
    doctorSkill,
    title = '',
    level = '',
    sourceType = '',
    detailsVoList = [{ doctorInitialRegFee: '0' }],
    // extFields = { doctorInitialRegFee: '0' },
  } = item;

  return (
    <Shadow>
      <View
        className={styles.doctor}
        onTap={() => {
          if (item?.leftSource > 0) {
            navigateTo({
              url: `/pages2/register/select-time/index?deptId=${deptId}&doctorId=${
                item?.doctorId
              }&scheduleDate=${date.format(
                'YYYY-MM-DD',
              )}&doctorName=${name}&sourceType=${sourceType}&type=${type}&level=${level}&title=${title}&oneDeptNo=${oneDeptNo}`,
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
          {name?.includes('特需') ? (
            <Space vertical style={{ marginTop: '-8px' }}>
              <View className={styles.left}>
                <View className={styles.name}>{name}</View>
              </View>
              <View className={styles.subtitle}>
                {`${deptName} | ${title || ''}`}
              </View>
            </Space>
          ) : (
            <View style={{ display: 'flex' }}>
              <View className={styles.left}>
                <View className={styles.name}>{name}</View>
              </View>
              <View className={styles.subtitle}>
                {`${deptName} | ${title || ''}`}
              </View>
            </View>
          )}
          <Exceed clamp={1} className={styles.doctorText}>
            {`擅长: ${
              doctorSkill && doctorSkill !== 'null' ? doctorSkill : '暂无'
            }`}
          </Exceed>
        </View>
        {(detailsVoList ?? []).map((v: any, i: number) => {
          return (
            <Space className={styles.timeSort} key={i}>
              <View className={styles.source}>
                {TIME_FLAG_ENUM[v.timeFlag as keyof typeof TIME_FLAG_ENUM]} 总号
                {v?.totalSource} |
                <Text className={styles.rightSource}>余号{v?.leftSource}</Text>
              </View>
              {v?.leftSource !== 0 ? (
                <View
                  className={classNames(styles.rests, {
                    [styles.disable]: v?.status === 2,
                  })}
                >
                  <Space
                    className={classNames(styles.restPrice, {
                      [styles.hidden]:
                        v?.doctorInitialRegFee === v?.registerFee,
                    })}
                    alignItems="center"
                    justify="center"
                  >
                    <View className={styles.restPriceAfter} />
                    {v?.doctorInitialRegFee === '0' ||
                    v?.doctorInitialRegFee === 0 ||
                    !v?.doctorInitialRegFee
                      ? ''
                      : `¥${(v?.doctorInitialRegFee / 100).toFixed(2)}`}
                  </Space>
                  <Space
                    className={styles.restNum}
                    alignItems="center"
                    justify="center"
                  >
                    ¥
                    {(v.registerFee && (v.registerFee / 100)?.toFixed(2)) ||
                      (registerFee / 100).toFixed(2)}
                  </Space>
                </View>
              ) : (
                <View
                  className={classNames(styles.fullRests, {
                    [styles.disable]: v?.status === 2,
                  })}
                >
                  <Space
                    className={styles.restNum}
                    alignItems="center"
                    justify="center"
                  >
                    约满
                  </Space>
                </View>
              )}
            </Space>
          );
        })}
        {/* {extFields?.timeFlag1 &&
          extFields?.timeFlag1?.split('|')[0] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                上午 总号{extFields.timeFlag1?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag1?.split('|')[1]}
                </Text>
              </View>
              {extFields?.timeFlag1?.split('|')[1] !== '0' ? (
                <View
                  className={classNames(styles.rests, {
                    [styles.disable]: item?.status === 2,
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
                    ¥
                    {(extFields.timeFlag1?.split('|')[2] &&
                      (extFields.timeFlag1?.split('|')[2] - 0)?.toFixed(2)) ||
                      (registerFee / 100).toFixed(2)}
                  </Space>
                </View>
              ) : (
                <View
                  className={classNames(styles.fullRests, {
                    [styles.disable]: item?.status === 2,
                  })}
                >
                  <Space
                    className={styles.restNum}
                    alignItems="center"
                    justify="center"
                  >
                    满诊
                  </Space>
                </View>
              )}
            </Space>
          )}
        {extFields?.timeFlag2 &&
          extFields?.timeFlag2?.split('|')[0] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                下午 总号{extFields.timeFlag2?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag2?.split('|')[1]}
                </Text>
              </View>
              {extFields?.timeFlag2?.split('|')[1] !== '0' ? (
                <View
                  className={classNames(styles.rests, {
                    [styles.disable]: item?.status === 2,
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
                    ¥
                    {(extFields.timeFlag2?.split('|')[2] &&
                      (extFields.timeFlag2?.split('|')[2] - 0)?.toFixed(2)) ||
                      (registerFee / 100).toFixed(2)}
                  </Space>
                </View>
              ) : (
                <View
                  className={classNames(styles.fullRests, {
                    [styles.disable]: item?.status === 2,
                  })}
                >
                  <Space
                    className={styles.restNum}
                    alignItems="center"
                    justify="center"
                  >
                    满诊
                  </Space>
                </View>
              )}
            </Space>
          )}
        {extFields?.timeFlag3 &&
          extFields?.timeFlag3?.split('|')[0] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                晚上 总号{extFields.timeFlag3?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag3?.split('|')[1]}
                </Text>
              </View>
              {extFields?.timeFlag3?.split('|')[1] !== '0' ? (
                <View
                  className={classNames(styles.rests, {
                    [styles.disable]: item?.status === 2,
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
                    ¥
                    {(extFields.timeFlag3?.split('|')[2] &&
                      (extFields.timeFlag3?.split('|')[2] - 0)?.toFixed(2)) ||
                      (registerFee / 100).toFixed(2)}
                  </Space>
                </View>
              ) : (
                <View
                  className={classNames(styles.fullRests, {
                    [styles.disable]: item?.status === 2,
                  })}
                >
                  <Space
                    className={styles.restNum}
                    alignItems="center"
                    justify="center"
                  >
                    满诊
                  </Space>
                </View>
              )}
            </Space>
          )}
        {extFields?.timeFlag4 &&
          extFields?.timeFlag4?.split('|')[0] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                白天 总号{extFields.timeFlag4?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag4?.split('|')[1]}
                </Text>
              </View>
              {extFields?.timeFlag4?.split('|')[1] !== '0' ? (
                <View
                  className={classNames(styles.rests, {
                    [styles.disable]: item?.status === 2,
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
                    ¥
                    {(extFields.timeFlag4?.split('|')[2] &&
                      (extFields.timeFlag4?.split('|')[2] - 0)?.toFixed(2)) ||
                      (registerFee / 100).toFixed(2)}
                  </Space>
                </View>
              ) : (
                <View
                  className={classNames(styles.fullRests, {
                    [styles.disable]: item?.status === 2,
                  })}
                >
                  <Space
                    className={styles.restNum}
                    alignItems="center"
                    justify="center"
                  >
                    满诊
                  </Space>
                </View>
              )}
            </Space>
          )}
        {extFields?.timeFlag5 &&
          extFields?.timeFlag5?.split('|')[0] !== '0' && (
            <Space className={styles.timeSort}>
              <View className={styles.source}>
                全天 总号{extFields.timeFlag5?.split('|')[0]} |
                <Text className={styles.rightSource}>
                  余号{extFields.timeFlag5?.split('|')[1]}
                </Text>
              </View>
              {extFields?.timeFlag5?.split('|')[1] !== '0' ? (
                <View
                  className={classNames(styles.rests, {
                    [styles.disable]: item?.status === 2,
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
                    ¥
                    {(extFields.timeFlag5?.split('|')[2] &&
                      (extFields.timeFlag5?.split('|')[2] - 0)?.toFixed(2)) ||
                      (registerFee / 100).toFixed(2)}
                  </Space>
                </View>
              ) : (
                <View
                  className={classNames(styles.fullRests, {
                    [styles.disable]: item?.status === 2,
                  })}
                >
                  <Space
                    className={styles.restNum}
                    alignItems="center"
                    justify="center"
                  >
                    满诊
                  </Space>
                </View>
              )}
            </Space>
          )} */}
      </View>
    </Shadow>
  );
};

export default ShowPrice;
