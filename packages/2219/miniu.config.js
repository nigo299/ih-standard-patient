const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '3958f2fefc6e440587d3d1ef77c8771d',
    // 小程序私钥
    privateKey:
      'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCCq2gdbC7skcEdVTd5qf1FfgqbKhOXCgej1423mWnoPmqDCeXiul3Njw8PytRNvrnjEwV2pS4KHEjsKUNLU4qUTmIuMpmK1Wo9nlBIRLWzn8/5cIXDrNo7bqeOnZxKqgBVUqNRWvia40vfujjEE0m5RiuHemJmOZyokh4PLPhyLonUs8ssZjH/d+UChrsGd9VfVZi5U27eaUOBLEoyjNhic+0+/i7yYLaaWDDFyMjW+HeZLg4nSxEg+HB15ax1Ftq9vdIsk0G1R4WbHxczBbxzRKl0MUy5IlNdASASpsPvZ717yEkF0eqzxVpyokwQttSx8a2GweFZ/BDXelAYzU5rAgMBAAECggEAQ1n+TEwa0609ENV/xqIr/cm9xcSmXE+7KGROk7frst2ZIPnVGExfVTjL1qQBUiFgxv5i7oitdmCl5bRPD2B8KX1Ndep24eym2iPj1Zw02+Uf2b559CYARmn+y6/Jg2Kk0VXLAIAXbB6EWUkvQUF/2pOklCws0+wWJ31JKSFQ3ekEgYy4kiAQqce/gZPW3XFKo1mpkQ0GZL1QW2gDEGUC59nqzSYt/C11goOdzPfp9EpbmxuwwOa7IF0Y5ZmJrm7HwXbE7vvN/sxB5sXu1nEujfyDWDeXPrVPU0TXILl/jRkAUH9PWxJE4M5bksLvuhB4S8Scu/l8oqDpeGKaOjMgAQKBgQDq25gNL7DdlAKXI4B/RCelKSZmTzTUCZNvUl5JXuTgUeEqv+siGhsIIFMx6PIdowoNCNVs4jAaCyVHUTasaZpENPs1eMFVsjh/ghlESCfgFcR9OGmMQ6xddiGN56NwXXzdpGU9fXZyPFi6Q2yglV02Bla15CA8mnxWom9xLbiiawKBgQCObr81V18/bbqH+QIbftVi87v3nZKesrwGA2R+FI6xTkkyySdltP2776ioSDJv0Qub9tetFnyTTJHitDNyU/5nydrn1kf8mqvU76VK5YgBLCgpaKcboBPpC16wWURgtN13CQNvu2S3dzAGi62ShqfXgcPyoQnMEGzPkY9C+mEEAQKBgQDEQkloC4hzQbKAdox0zZGLtT1/lYUCBBaOmnhsO75rrkDJpqNpVgNs4QZk2NMq7QoDJnSjjsi/mrzGQhm8LmtZwCSE5Ko7YLlR5HgU1W9tFQOj2LZrHko1t/gGS6IKzjUAStbHcca/Y6qJzLpD302LTfS7/yzpN/fbtdYG8DwwjQKBgDnViDhtkNRdhtc9afimKJk0ZMenqOhdpPFAIWb8i/A83IYNnbyzoC/WoYIrRqeWl4Mt2OeEcPMSrU4DY7xxlKSqFwP6Q2Kzn0AoStK9ntrzBh/CSdBy0ILZRgqPRK+L4T07YLTWv4+rismtn74WhUKBg4Ial7LPnI8wCJ7mscwBAoGAaWoHG+s+Pv90AiWEXNzEKNgTZfhx7gAvjsOjxNf1WLnjnXnc3RhIpK/U1FdLeA1st5z5JGlJYYIlnBhs00j+YCdhpzrlaDV4JOLD3jmBTTPXgmmKgIYwSg6Iqq/lXIhx2CGm5QJIZBrzHrCEIYeOLvprnfgQJnb2ia/ua/v286c=',
  });
  try {
    if (process.argv.includes('preview')) {
      const previewResult = await miniu.miniPreview({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2019032163620163',
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
        appId: '2019032163620163',
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
