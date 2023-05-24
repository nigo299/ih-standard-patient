const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '3958f2fefc6e440587d3d1ef77c8771d',
    // 小程序私钥
    privateKey:
      'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCL4gmDVDhQIswj8+d8sKKOkEH1E0KtDd3NFOBsJvAtwMWUXOR9sLLfIeI0+8KmBc4TPJ9VorzbFoy4cT4hSXOh3uMOc0oQv6x6k46Ba0fP17sgWlZJiwqAZDpu/IjHHUkk+A6+2wVApMuuZNA31Bw07672Llw/mezWOA2OOwUAD8yjPvjvavO/6FPjDx2J0Xp58xHBLLF3Xzj8PoZde9nqdlJBIjex97DJ/1MQDgNskkK/9JZc3pqtpaGbf0dwcYQkL/PT8dJk/kqtLui4QkGm82nreLQTtXeKcR7oelnJTjX6vUZtWdCTau673tSzlyRKZWG9f0ixb+C7OS3bhQnfAgMBAAECggEAU82sw1hOkHv4b0Wtlr8/9EcqrMfIN2NKUZZDSageVlraRCNO5Jpa32EuY229VLe/mTjFgImJuXwN/GYjwc9+jii5QSwC4Hvk',
  });
  try {
    if (process.argv.includes('preview')) {
      const previewResult = await miniu.miniPreview({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2021002125656335',
        // 返回二维码文件的格式 "image" 或 "base64"， 默认值 "terminal" 供调试用
        qrcodeFormat: 'terminal',
        // 上传的终端
        clientType: 'alipay',
      });
      if (previewResult.qrcode) {
        console.log('生成预览版本成功');
        console.log(`二维码图片地址 ${previewResult.packageQrcode}`);
        console.log('Schema Url:', previewResult.schema);
      }
    }

    if (process.argv.includes('upload')) {
      const uploadResult = await miniu.miniUpload({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2021002125656335',
        clientType: 'alipay',
        experience: true,
      });
      console.log('生存体验版本成功');
      console.log(`小程序上传文件大小 ${uploadResult.packages[0].size}`);
      console.log(`上传版本号 ${uploadResult.packageVersion}`);
      console.log(`二维码图片地址 ${uploadResult.qrCodeUrl}`);
    }
  } catch (error) {
    console.log('error', error);
  }
})();
