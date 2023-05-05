import React, { useEffect, useState, useMemo } from 'react';
import { View, navigateTo } from 'remax/one';
import { Swiper, Shadow, Exceed, showToast } from '@kqinfo/ui';
import styles from './index.less';
import { IMAGE_DOMIN } from '@/config/constant';
import classnames from 'classnames';
import showTabBar from '@/utils/showTabBar';
import useApi from '@/apis/microsite';
import { usePageEvent } from 'remax/macro';
import { PreviewImage } from '@/components';
import setNavigationBar from '@/utils/setNavigationBar';
import { useHisConfig } from '@/hooks';
import OldViews from './components/old-views';
import ShowMoreViews from './components/show-more-views';
export default () => {
  const { config } = useHisConfig();
  console.log(config.microSitesEntries);

  const banners: string[] = [`${IMAGE_DOMIN}/home/banner1.png`];

  const [activeIndex, setActiveIndex] = useState<number>(0); // banner 默认选中的值
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
    return data?.data?.recordList?.filter(
      (item) => item.typeName === '医院动态',
    );
  }, [data?.data?.recordList]);
  const healthList = useMemo(() => {
    return data?.data?.recordList?.filter(
      (item) => item.typeName === '健康宣教',
    );
  }, [data?.data?.recordList]);
  useEffect(() => {
    showTabBar();
  }, []);
  usePageEvent('onShow', () => {
    request();
    setNavigationBar({
      title: '微官网',
    });
  });

  return (
    <View className={styles.index}>
      <View className={styles['banner-warp']}>
        <Swiper
          interval={5000}
          indicatorDots={false}
          autoplay
          current={activeIndex}
          onChange={({ detail }) => setActiveIndex(detail.current)}
          items={banners.map((img) => ({
            node: <PreviewImage url={img} className={styles.swiperImg} />,
          }))}
        />
        <View className={styles['indicator-dots-warp']}>
          {banners.map((_, index) => (
            <View
              key={`indicator-dots-item-${index}`}
              className={classnames(
                styles['indicator-dots-item'],
                activeIndex === index ? styles['active'] : '',
              )}
            />
          ))}
        </View>
      </View>
      <View className={styles['container-warp']}>
        {config.microSitesEntries === 'OLD_VIEWS' && <OldViews />}
        {config.microSitesEntries === 'SHOW_MORE_VIEWS' && <ShowMoreViews />}
        <View className={styles['content-warp']}>
          <View className={styles['content-title-warp']}>
            <View className={styles.title}>医院动态</View>
            <View
              className={styles.action}
              onTap={() => {
                if (!dynamicList?.[0]?.type) {
                  showToast({
                    icon: 'none',
                    title: '暂无更多医院动态!',
                  });
                  return;
                }
                navigateTo({
                  url: `/pages/microsite/hospital-article/index?type=${dynamicList?.[0]?.type}&title=医院动态`,
                });
              }}
            >
              更多&gt;
            </View>
          </View>
          <View className={styles['horizontal-list-warp']}>
            {(dynamicList || []).map((item, index) => (
              <Shadow
                key={`horizontal-list-item-${index}`}
                shadowColor={'#5f848e'}
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
                  <View className={styles['info-warp']}>
                    <PreviewImage
                      url={item.coverImage}
                      className={styles.image}
                    />
                    <View className={styles['right-content']}>
                      <Exceed clamp={1} className={styles.title}>
                        【{item.title}】
                      </Exceed>
                      <Exceed clamp={3} className={styles.desc}>
                        {item.content}
                      </Exceed>
                    </View>
                  </View>
                  <View className={styles.times}>{item.publishTime}</View>
                </View>
              </Shadow>
            ))}
          </View>
        </View>
        <View className={styles['content-warp']}>
          <View className={styles['content-title-warp']}>
            <View className={styles.title}>健康宣教</View>
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
                  url: `/pages/microsite/hospital-article/index?type=${healthList?.[0]?.type}&title=健康宣教`,
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
