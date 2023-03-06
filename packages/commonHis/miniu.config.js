const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '2ecc6fe7d2dc4e16b1c52531f8a9de57',
    // 小程序私钥
    privateKey:
      'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxIj0DEA2WeBAIqlAr9E/Kk+8kJjWkQSt/5Itf2laCCRrbs4zSts/O0cik3Cm4SK6YbnspA5TX58jhmEz4OvkwcLyT8+93hPwqYgrPs+trkG8JB4Z/8D6oN8CY4wfK1IY0vVJlWWbZ5rBKMOET8fcc36tSowFkInptnmPISVd1neY6GDpuP0naZ8bG3GnRedPtNUgYVCPuuAV775XUFCkUQldTse58BfevisH3y6Mv2MZpS9k7A13ORwb5DeM0ZjYTKcpeHBCxLyVd5u+bX5VGWt/0SQLNGH+ER3JmXoLcfLW2QAND6Uy9sS5KueYVg3qJ4RKLly61wS/VZEo+54mzAgMBAAECggEAeZBm0OBGgvqY/mlsJg5AaGXIXEXA0J5NLTN7F2hvsERxY1BBGCeQTH8atVHHbAqtkD1aVtZ3YwlWisSMJlvKwpzMPrnNoXfp22h3xP3UVnjESy0X+Fu3lJjWm9ZLdb8O78jycE2/0VGJsREElzya+/zgxhDKlp826F4oWr9Cv5teKCIjspwx6+xIT+ueyS0tq9G5H6k5h+WPh0JGj+fKUmI9xTGuodQqjj9Rz6N8C/m2euUhoSLR/HgzUQLu0frUSSNorPiDEknLDAIhOiGE61gYTCzFzpnfNio4uQoegSijs3Tw4XeAMXpiZmIag5yY7MFnNN8qgMdLQz1CfTOTMQKBgQDhzeLILh4bjRjScdNVP9UwTPG4/h9crs5VQpEvDzb86H3hLrBkwjVuX3kyYWv76h3tkNSlsrxAImHijnY8bU0KiA+XlKQuHGIdik+OrQRuuSDEH+H/HVRfvmKv3K1dSFGP83Bnkw1yfuqxV2CwaSAj8ky+hH1AhXQULOW1KKftOQKBgQDI0i5sb1aG7aUsJRC8y/7iLFeuCPyK0bO41jl0/eTNz7SANftorppXs2E6iPwfav1gOirk4a0ijx86b8399aF5y11ORUCg/XfYYAkSKp9MVx1vewMm42MI1ETDnLQXkGH3TFxqZzu0TzuUmHtTrqK6/lCCu6pv9kTPJWAPDcdaSwKBgQCuK7gMvn3ctIX79W6UaCtSGVeuYN3iCLgAzdrc2LiKde563h+TaLX8D8qVUM4RPzGciEVuFiLcuWiVb1vGGmz9fZvBSRcmth/8Ny5MmCo+GbArd4hD1uS5AUpv6iETPfAjwBvo2GXb9gejiQl8qWnwMDqADgPq28WAtmzswpJdCQKBgQCPmKsVYm+Ov7NR45caSQwSkf6INWjPoq9ORfCD1WCcQh8hZnhFHETE3UFy56zQkmJnQnCVhUGV6p073eJ/6/nw6xfm9eIGu/fMQq95y/xoTAqCQoW4cvPHxnD9Jron91f1yyZx9ytb/SPvVzEoX0GBUIQlVyfCM2h0bpdHbGTWDQKBgA3ew84J1T7nA2Bljz5HQQON4SBnmIgcOzijXqsQs1kuu0sgXCgOmR/QPDZHC448+8J7lhr1xRbFwF6roOL7vddRTKA66s27YV002Y+PjANw8jkJUAXHN1EmOYCjUNT9uD5yILLdKPrOF4EBFLmw2uGoAY/uHG3jVJ0knsRyXK8h',
  });
  try {
    if (process.argv.includes('preview')) {
      const previewResult = await miniu.miniPreview({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2021001195610360',
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
        appId: '2021001195610360',
        clientType: 'alipay',
        experience: true,
      });
      console.log('生存体检版本成功');
      console.log(`小程序上传文件大小 ${uploadResult.packages[0].size}`);
      console.log(`上传版本号 ${uploadResult.packageVersion}`);
      console.log(`二维码图片地址 ${uploadResult.qrCodeUrl}`);
    }
  } catch (error) {
    console.log('error', error);
  }
})();
