import React from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { Search, Loading, NoData } from '@kqinfo/ui';
import { ArticleContent } from '@/components';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/microsite';

export default () => {
  const { title, type } = useGetParams<{ type: string; title: string }>();
  const { data, loading, request } = useApi.获取文章列表({
    params: {
      pageNum: 1,
      numPerPage: 20,
      type: Number(type),
      state: 'ONLINE',
      title: '',
    },
    needInit: false,
  });

  usePageEvent('onShow', () => {
    if (type) {
      request();
    }
    setNavigationBar({
      title,
    });
  });
  return (
    <View>
      <View className={styles.topBox}>
        {loading && <Loading type="top" />}
        <Search
          placeholder={'输入关键词进行搜索'}
          showBtn
          onConfirm={(value) => {
            request({
              pageNum: 1,
              numPerPage: 20,
              type: Number(type),
              state: 'ONLINE',
              title: value,
            });
          }}
        />
        {data?.data?.recordList?.length > 0 ? (
          data?.data?.recordList.map(
            ({ id, title, content, publishTime, coverImage }) => {
              return (
                <ArticleContent
                  id={id}
                  key={id}
                  title={title}
                  content={content}
                  time={publishTime}
                  img={coverImage}
                />
              );
            },
          )
        ) : (
          <NoData />
        )}
      </View>
    </View>
  );
};
