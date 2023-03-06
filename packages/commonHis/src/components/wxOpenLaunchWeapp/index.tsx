import React, { useEffect } from 'react';
import { Platform } from '@kqinfo/ui';
import { View } from 'remax/one';
import globalState from '@/stores/global';

export interface IPorps {
  /** 小程序原始id */
  username: string;
  /** 小程序路径 */
  path: string;
}
export default ({ path, username }: IPorps) => {
  const { initWxSDK } = globalState.useContainer();
  useEffect(() => {
    initWxSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Platform platform={['web']}>
      <View
        web-dangerouslySetInnerHTML={{
          __html: `<wx-open-launch-weapp
                  username=${username}
                  path=${path}
                  style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;"
               >
                 <template>
                 <style>
                  .wx-btn{
                    height:999px;
                    width:100%;
                   }
                  </style>
                  <div class="wx-btn"></div>
                 </template>
               </wx-open-launch-weapp>`,
        }}
      />
    </Platform>
  );
};
