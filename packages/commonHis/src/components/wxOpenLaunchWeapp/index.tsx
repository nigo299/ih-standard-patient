import React, { useEffect } from 'react';
import { Platform } from '@kqinfo/ui';
import globalState from '@/stores/global';
import { PLATFORM } from '@/config/constant';

export interface IPorps {
  /** 小程序原始id */
  username: string;
  /** 小程序路径 */
  path: string;
}
export default ({ path, username }: IPorps) => {
  const { initWxSDK } = globalState.useContainer();

  useEffect(() => {
    if (PLATFORM === 'web') {
      function handler(e: any) {
        console.error(e?.detail?.errMsg); // 无法使用开放标签的错误原因，需回退兼容。仅无法使用开放标签，JS-SDK其他功能不受影响
      }
      document.addEventListener('WeixinOpenTagsError', handler);
      return () => {
        document.removeEventListener('WeixinOpenTagsError', handler);
      };
    }
  }, []);

  useEffect(() => {
    initWxSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Platform platform={['web']}>
      <wx-open-launch-weapp
        username={username}
        path={path}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          bottom: 0,
        }}
      >
        <script type="text/wxtag-template">
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </script>
      </wx-open-launch-weapp>
    </Platform>
  );
};
