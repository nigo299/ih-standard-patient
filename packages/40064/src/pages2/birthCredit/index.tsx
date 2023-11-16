import React, { useEffect, useMemo } from 'react';
import { View, navigateTo } from 'remax/one';
import { Shadow, Exceed, showToast, PartTitle } from '@kqinfo/ui';
import styles from './index.less';
// import { IMAGE_DOMIN } from '@/config/constant';
import classnames from 'classnames';
import showTabBar from '@/utils/showTabBar';
import useApi from '@/apis/microsite';
import { usePageEvent } from 'remax/macro';
import { PreviewImage } from '@/components';
import setNavigationBar from '@/utils/setNavigationBar';

export default () => {
  // const banners: string[] = [`${IMAGE_DOMIN}/home/banner1.png`];
  // const HEADER_ACTIONS: Array<{
  //   key: number;
  //   icon: string;
  //   title: string;
  //   action: string;
  // }> = [
  //   {
  //     key: 0,
  //     icon: `${IMAGE_DOMIN}/newhome/yyjs.png`,
  //     title: '医院介绍',
  //     action: '/pages/microsite/hospital-summary/index',
  //   },
  //   {
  //     key: 1,
  //     icon: `${IMAGE_DOMIN}/newhome/ksfb.png`,
  //     title: '科室分布',
  //     action: '/pages/microsite/dept-distribute/index',
  //   },
  // ];
  // const [activeIndex, setActiveIndex] = useState<number>(0); // banner 默认选中的值
  const { data, request } = useApi.获取文章列表({
    initValue: {
      data: {},
    },
    params: {
      pageNum: 1,
      numPerPage: 3,
      state: 'ONLINE',
    },
    needInit: true,
  });
  const dynamicList = useMemo(() => {
    return data?.data?.recordList
      ?.filter((item) => item.typeName === '出生证明首发')
      .reverse();
  }, [data?.data?.recordList]);
  const healthList = useMemo(() => {
    return data?.data?.recordList
      ?.filter((item) => item.typeName === '出生证明补发')
      .reverse();
  }, [data?.data?.recordList]);
  // const purchaseList = useMemo(() => {
  //   return data?.data?.recordList?.filter(
  //     (item) => item.typeName === '招标采购',
  //   );
  // }, [data?.data?.recordList]);
  // const ccpWorkList = useMemo(() => {
  //   return data?.data?.recordList?.filter(
  //     (item) => item.typeName === '党群工作',
  //   );
  // }, [data?.data?.recordList]);
  useEffect(() => {
    showTabBar();
  }, []);
  usePageEvent('onShow', () => {
    request();
    setNavigationBar({
      title: '出生医学证明',
    });
  });

  return (
    <View className={styles.index}>
      <View className={styles['container-warp']}>
        <View
          className={classnames(styles.header)}
          onTap={() => {
            navigateTo({
              url: '/pages2/register/select-doctor/index?deptId=0306&type=default',
            });
          }}
        >
          +预约办理
        </View>

        <View className={styles['content-warp']}>
          <View className={styles['content-title-warp']}>
            <PartTitle className={styles.title}>首次签发</PartTitle>
            <View
              className={styles.action}
              onTap={() => {
                if (!dynamicList?.[0]?.type) {
                  showToast({
                    icon: 'none',
                    title: '暂无更多健康宣教!',
                  });
                  return;
                }
                navigateTo({
                  url: `/pages/microsite/hospital-article/index?type=${dynamicList?.[0]?.type}&title=补发`,
                });
              }}
            >
              更多&gt;
            </View>
          </View>
          <View className={styles['vertical-list-warp']}>
            {(dynamicList || []).map((item, index) => (
              <Shadow
                shadowColor={'#5f848e'}
                key={`vertical-list-item-${index}`}
              >
                <View
                  className={classnames(
                    styles['list-item'],
                    styles['card-warp'],
                  )}
                  onTap={() => {
                    useApi.新增浏览量.request({ id: item.id });
                    navigateTo({
                      url: `/pages/microsite/article-detail/index?id=${item.id}`,
                    });
                  }}
                >
                  <View className={styles['left-warp']}>
                    <Exceed clamp={2} className={styles.title}>
                      {item.title}
                    </Exceed>
                    <Exceed clamp={1} className={styles.desc}>
                      {item.content}
                    </Exceed>
                    <View className={styles['read-num']}>{item.pv}阅读</View>
                  </View>

                  <PreviewImage
                    url={item.coverImage}
                    className={styles.image}
                  />
                </View>
              </Shadow>
            ))}
          </View>
        </View>

        <View className={styles['content-warp']} style={{ marginTop: '-30px' }}>
          <View className={styles['content-title-warp']}>
            <PartTitle className={styles.title}>补发</PartTitle>
            <View
              className={styles.action}
              onTap={() => {
                if (!healthList?.[0]?.type) {
                  showToast({
                    icon: 'none',
                    title: '暂无更多健康宣教!',
                  });
                  return;
                }
                navigateTo({
                  url: `/pages/microsite/hospital-article/index?type=${healthList?.[0]?.type}&title=补发`,
                });
              }}
            >
              更多&gt;
            </View>
          </View>
          <View className={styles['vertical-list-warp']}>
            {(healthList || []).map((item, index) => (
              <Shadow
                shadowColor={'#5f848e'}
                key={`vertical-list-item-${index}`}
              >
                <View
                  className={classnames(
                    styles['list-item'],
                    styles['card-warp'],
                  )}
                  onTap={() => {
                    useApi.新增浏览量.request({ id: item.id });
                    navigateTo({
                      url: `/pages/microsite/article-detail/index?id=${item.id}`,
                    });
                  }}
                >
                  <View className={styles['left-warp']}>
                    <Exceed clamp={2} className={styles.title}>
                      {item.title}
                    </Exceed>
                    <Exceed clamp={1} className={styles.desc}>
                      {item.content}
                    </Exceed>
                    <View className={styles['read-num']}>{item.pv}阅读</View>
                  </View>

                  <PreviewImage
                    url={item.coverImage}
                    className={styles.image}
                  />
                </View>
              </Shadow>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
