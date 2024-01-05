const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '82a130cce8a84aa28c3f4e59ffbaf52c',
    // 小程序私钥
    privateKey:
      'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsYSFvmBTaEAqqcYUQ2PDau/Z+BQIA6Td1gMPuEFzSN7iZie2Z4v9POdEXaHXnOZl0ZJ5ZI1Qa1S8oK3gI8tReQMBhKky0tVC6RglGgx1EqJOZIbS/JuB8bhd27MhVqtcVVVmJI/xXsobIWajHvqXRHzBhREiLBLhpEgMG8MB6PjZ2ru/Wir2TRUdHlRYeI6qBuXF4X+s/HyhhBZfI7pIhj/038WwlkOGXNYNepCyj1olSolgv8u+3L94R0NSu14aSKHpORsHmv44W1mOi/ql2dZjov7HEtnqZXm7+uzkr4qwN28Dkd1Yxn64yBdN71Ade6UQGRlaBeAgpx3zy4Pb/AgMBAAECggEAXwtjKyuYe6+Soe3bp7FmA8TVoSBTvXrZmFE6Nr4Q39vXTdkOB+ZwTRec4SI4uBg7M0DzSkS/b9gRmz10fsKdM6bSLADtsEm0zDAnlxhd/+hPEYTTKv5dkl4FVA40W3/J/bpElugfj58gz8EX3aKRvN9MhqTmtrgQkeZbgu0lw4A2OxnGFlscWv0q3oGxjiBJV8j0IQX0rOEl5t0wv2SzdUBNHgAZVfj8L24zfAcMYobWhRWSunpM2KjhEBsSCkl4/cOmcnUnQ0jrvcDsIFQY9mQijzb3MUBRevUnQPzYWlXjqwfLYAcuYyCazoX0SBlIyX5K2cjKElKF2yQ2s7mqqQKBgQDwPS4JKZHA3aWNixaecVvkRuPpXdQ8I5K4VfBhpcYBhHu3A7EMSGimd5eYkc40dG9//UyNllpWsLdkJhGuVS7ncGEchWQeuLZSzRiH4u2CnrfQkwgVl4NUvBKcbDn0Ax/ApfY/6YNijkE9ircVJKP84NLO10ZrJePrJVtmAi8NSwKBgQC3sD9eImPznontacyaPA8u50iy2Ewm5r3caly7khImhAtLpmVnKuTBstS5TH7a4SGAVw5WiJX9BE3/0aHRmjWb8TWtpBOr6XalJco6ltrIap4O7gnNU90WNnUwDUW3DmB5AyTYB4KIRQubp+PlU5IOdFFMrkML46A9pqwFin9wnQKBgG2yMeQjJBeh3adc/E4Kyv/YUtdLbc6sG6GqNCISVPB6cxclS2GlaougjgsvgK25APS7T4pTPhrZhFPpgidNZCZvzRf93LKeezohxnK97t+2444MpSNe1KwLWKAuVuQRzRzlayTR1plZBXc5cNHpsiuU6Q1jhRcF7SWBIFPa6WszAoGAARn8d0sLgGV9/D97K52albRrWi8z3bPahZzZq4JHu5VlH/ICf6jhMEwrPGU6CYP6GHPtMRWmmJrTAOq35rLfCW1b3guy1oAS5xCf8tP+wd7pzbsdse6Dz+NJtp0NwvhCGder++Ono7uOQ0OxeSmUIaQO7L/KxSJ7ToNWWr4m330CgYACI3T94adidpTNzeQtess883wsQ0lsVNN38F0u8RDFySCCX3dMoN3xgQWnDSlNXK1nNayXRi2piqdlR/zb9UuImEQXIiq5n46b6yG9zEFkslmYYhRyr74M/eptoExupuWSNnul6l0bFpdIphkGjJaWH8dTyps8HiqpT269hGaTDg==',
  });
  try {
    if (process.argv.includes('preview')) {
      const previewResult = await miniu.miniPreview({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2021002128610895',
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
        appId: '2021002128610895',
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
