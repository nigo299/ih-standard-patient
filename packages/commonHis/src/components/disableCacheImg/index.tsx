/**
 * @file 防止图片被缓存
 */

import { PreviewImage } from '@/components';
import React from 'react';
import { Image } from 'remax/one';

interface PreviewImageProps {
  url: string;
  [key: string]: any;
}
interface ImageProps {
  src: string;
  [key: string]: any;
}
export const DisableCachePreviewImage = (props: PreviewImageProps) => {
  const { url, ..._props } = props;
  // 防止缓存
  const addTimestamp = (url: string) => {
    const timestamp = new Date().getTime();
    return `${url}?timestamp=${timestamp}`;
  };
  return <PreviewImage url={addTimestamp(url)} {..._props} />;
};

export const DisableCacheImage = (props: ImageProps) => {
  const { src, ..._props } = props;
  // 防止缓存
  const addTimestamp = (url: string) => {
    const timestamp = new Date().getTime();
    return `${url}?timestamp=${timestamp}`;
  };
  return <Image src={addTimestamp(src)} {..._props} />;
};
