import React, { useCallback, useRef, useState } from 'react';
import { View } from 'remax/one';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import { List, Search } from '@kqinfo/ui';
import { ArticleContent } from '@/components';
import styles from './index.less';
import useGetParams from '@/utils/useGetParams';
import useApi from '@/apis/microsite';

export default () => {
  const { title, type } = useGetParams<{ type: string; title: string }>();

  const listRef = useRef<{
    refreshList: (retainList?: boolean) => Promise<void>;
  }>(null);

  const [params, setParams] = useState<{
    type: number;
    state: string;
    title?: string;
  }>({
    type: Number(type), // 6 医院动态,7 健康宣教
    state: 'ONLINE',
  });

  usePageEvent('onShow', () => {
    setNavigationBar({
      title,
    });
  });
  return (
    <View>
      <View className={styles.topBox}>
        <Search
          placeholder={'输入关键词进行搜索'}
          showBtn
          onConfirm={(value) => {
            if (listRef.current) {
              listRef.current.refreshList(true);
            }

            if (value) {
              setParams({
                ...params,
                title: value,
              });
            } else {
              setParams({
                type: Number(type), // 6 医院动态,7 健康宣教
                state: 'ONLINE',
              });
            }
          }}
        />
        <List
          ref={listRef}
          cacheKey="opinions"
          getList={useCallback(
            (page: number, limit: number) => {
              return useApi.获取文章列表
                .request({
                  pageNum: page,
                  numPerPage: limit,
                  ...params,
                })
                .then((response) => {
                  return {
                    list: response?.data?.recordList || [],
                    total: response?.data?.totalCount,
                  };
                });
            },
            [params],
          )}
          renderItem={({ id, title, content, publishTime, coverImage }) => {
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
          }}
        />
      </View>
    </View>
  );
};
