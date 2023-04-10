import React from 'react';
import { Image } from 'remax/one';
import { previewImage } from '@kqinfo/ui';

export default ({ url, className }: { url: string; className?: string }) => {
  return (
    <Image
      src={url}
      className={className}
      mode="aspectFit"
      onTap={(e) => {
        e.stopPropagation();
        previewImage({
          urls: [url],
        });
      }}
    />
  );
};
