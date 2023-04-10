import { getPlatform } from '@kqinfo/ui';
if (getPlatform === 'web') {
  // const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  const handleFontSize = () => {
    console.log('设置微信字体');
    // 强制禁止用户修改微信客户端的字体大小
    const WeixinJSBridge = (window as any).WeixinJSBridge;
    if (!WeixinJSBridge) return;
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', { fontSize: 0 });
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', () => {
      WeixinJSBridge.invoke('setFontSizeCallback', { fontSize: 0 });
    });
  };
  const WeixinJSBridge = (window as any).WeixinJSBridge;
  if (
    typeof WeixinJSBridge == 'object' &&
    typeof WeixinJSBridge.invoke == 'function'
  ) {
    handleFontSize();
  } else {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', handleFontSize, false);
    } else if ((document as any).attachEvent) {
      (document as any).attachEvent('WeixinJSBridgeReady', handleFontSize);
      (document as any).attachEvent('onWeixinJSBridgeReady', handleFontSize);
    }
  }
}
