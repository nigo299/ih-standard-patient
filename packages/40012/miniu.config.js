const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '8e1c726613ce4680a1db9f56e0c4696e', // 8e1c726613ce4680a1db9f56e0c4696e
    // 小程序私钥
    privateKey:
      'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCVQkT4cTlCXDfBNEpjTLRKIg0fcceSSTjDZHIYIhEWAeGY5N2LngcdDAZuvIdflZ1I4pXqOWgMkjb1m/CiaLI2lDQAqHYGgKxhfOQBhCS/S27w1Od8oHuDA2oh25mL3VlfTHCXJmZ/Tni/NxfrbgOpO5e6l8E+DG2UEKwV+QFQHo3q14BnEXMkg+toK35NBvT1ddJjyZ/7nd9Z4KLKYbwkq231irky1hxIz/1KZTHlN+l8Vi9S/CC8aU92BUSeQO8LPUzOEwJhAbeIYDgEfszH0fXBwFq0augqupswTcgB2s3mo5BGXiS/8srDEIyQ0+5ucS7mWpvIGG9yGQFEySZ7AgMBAAECggEBAIRHwRx2LAr186vVDgBHYJk66GpvyjGJlzcD9GIS/xWEAU4ht38fRKqnl6PYjhlWXZjUx4xX6DEL/I1b8L3fD+JzIktbAY7txth3eRMm6/JlhiMGbUn0aMJJ6murVb+xIp3k/vvWWoyFHVpKF3bdf30ihWwnRmoZVZwd0oV+s30u2aOymvFMSIohcVbTKUxr1FnijxLVtl85qCWAn0IK+cRje/5BsA3f0tkM9bY8T8JTptHPNrTiRqk+/OTCIXcGStChljrf6JTjRi915MOa2+8j+FPYNTzktG59tiDZjFgX1bW/76bUbwIts8yRKr1Dy+yVHFUy0pVm3u1joDPuK4ECgYEA3rml46gdlkMLxKcBt0xhIbyzeBKHkF0RA9ayzVnNbeqmqAvqhsjdlI7c4Zvg9gLEdBicJqgkq5Uw1jLONugbZQ6iW1XnnIVPxVr4LMuAw9MbQCuHTcUXH6wyMGaIOcorTJcaN7ZQya+qMgAix10337pXS+7TcUHF/lrG3MR3mGECgYEAq47Ts7NvRDW07NjJF7BvGO7XInerv8AMLVRL/KfCzmI6S/3kpR5GoQWcVmcdKuLeL+A4+Cf8UM+AuwrI8V/mibxgYW2ihOAGIm/avsezt3pMaz2p7GS1r9nJUfZZ6KdIxAZ+9uECiA2lDMIqm0Zka4HpfM6cpkd7PtpBjefXfFsCgYBgeONtB63BH0tio8AviCrudRD7qnMDyfwLwJx0LDi6KpCDa53rQegQaA0uv9kiVjKH4v0IFX7Ev3uG3DzMNZ9gF4WlsEEBYBEcd/nVVVRx/efo1LHnsr4AXxLiOhc5iONWaoDVruexZKCAxeRKnIsOImWbo1f8z7OWJ/XJPGRdIQKBgBUUntTlBpYWF15HISalCnHA33Sfyd3tBlIHmrK4ForvrQQrdY4Ik1sz6kr/rqjXab/uSHHN0AZKCSJyp9BpHVXtbNZr911mfbp7jiCFP4MbJwrCb//ZPC4Yj9FfeRrKe3mC5tUFPx9itdZEgaHE25AOTZeFd+BCxlUp0oZSZ7sjAoGAI3gc8oykxDtyz9pK774rBLuL8oPh+TpaMtl297VvPMzB5/B5/OJ9XkOCSb2hT9gJVWuulx/HGjvqtIqEpau2PC/Bkdb0IO8B2fIIF1W2HYIelwr/0oK7f7HY1aogXaOy1dUzpGlDCbly5EpYFCw3MGqtm/WDllo+S3RhgRaZyTs=',
  });
  try {
    if (process.argv.includes('preview')) {
      const previewResult = await miniu.miniPreview({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2021002128672298',
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
        appId: '2021002128672298',
        clientType: 'alipay',
        experience: true,
      });
      console.log('生成体验版本成功');
      console.log(`小程序上传文件大小 ${uploadResult.packages[0].size}`);
      console.log(`上传版本号 ${uploadResult.packageVersion}`);
      console.log(`二维码图片地址 ${uploadResult.qrCodeUrl}`);
    }
  } catch (error) {
    console.log('error', error);
  }
})();
