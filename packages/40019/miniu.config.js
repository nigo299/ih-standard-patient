const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '7d45158f992a4a938e561c2906e2d8a4',
    // 小程序私钥
    privateKey:
      'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwnx29kbxIK7fIqPhanIY2uDR/kRBznUyqpQYMkx9RUbz/hDtFv9NBncwm5cbLANm+o/Mj0ytHdzZuAg62Oneo0h60WdzoW8af4ekbWIrVHFAyks2fUPZFRAL7w9MLmcDp4Kqu9cjVhav16D6C6Ds4d5CPMHnIbWIRukTkm9yZKKrfV0sFPXruSp3CRETO3J7Bs6JFlrFFm4kEUJRn+KKo1+I+YHLEkD/v/EyfdsOZYQJQ2shwV4G57pBvHIvEoHy7T7BtMPW4/ZbNDtm4UoI40XRcIR0vZNlvgoEVwnXExb0Woae2irB7dJ9onVW25x7n2XRoR9UC2qe3wPAUUeVlAgMBAAECggEASkH73RIC2U0YLhNsp5wbibIU0HWLNzCxZSWQz4SjrCrzjXJpAUBPb80KYmhFFmC7K73+oddM4PUsO0A+MzuNx7rgEe+eQ0sizWHMAiVN6Z/H0BuMvCjsAd9Aad3BQ6VXSH2fBYRs9ekHjZIhhiRhkbIjYzB8Y1op2043XO5y5ylOpHFc6hLMxv2g5TG+j9UI5l0rW9OpfcAvMz1ESQDIBhwfGcem3OdI5HwnhsBAfF/FS421MWmbKVdHN7zGx/Nllc6UHV6LwecMliS5M6nZ4KiywmJ4FTO5wWl1Uw2Ik+qTmyjkYMD0HiRDXu1ZlmsxwxRrLs97aTiOf83c6TxdQQKBgQD7rx4FuH6u8tBTU1tdpSIus5QnnoYU2+vSQf7ETaySaTZ2eIPHEbCwlGTbM8jPpT3ys6eQFtiJA9yfhuEGpXrkJbMOxDn6uJvjdn5RBJdRWZugBvLmz/v/y5DFzhir6U+1/HU5kkU9Lk+DIlkTQtuOpRU8zfhlX2nMuZcoq4JbDQKBgQCzpnpBwYPsDmie4SAhSlyJoRD862reXV6m1wPnfpwalxyf/QYoW6/FD56wlwhcJ2uIXTuJq9e2XaK+NPTUlryrZYCXqd5/d1pM7GBp2lWNpURnIvrd6IaSbL7PlcEOZERwCRekQT8Rm3HWuxCBOXMnn+7z4TF693xz+Pm9Fhw9uQKBgF5y/x9CdzgMIyXB+F2SJNvFxGmB0etuBHdpEMR2KbbgCPI4k6tW9imt5pNkQY27Ax5bURx/lk8ExfyPz06BNzb69tEpzmBKeyXHR+v7fxWmPQK22NzJXFZH/FJe319UNPekgBFU1Or6wBgEAc16n45OYUPqP7c7MScE1rcKdebZAoGBAIA4+lmkfTwmrJV5qS0ZniK9Sxq6DHTZv4zlOmwn+dMgt9WZCqQTjMjh9SmlItpjaGTT5oLEnBoViuqncXeqfs72i2m0XJIt5c2xiL8EjruikcfrN5LbO/GWnDodcMWM2yv70VvzFcjDYeUZbxZMotxNUofO2zohGjrMIbPL7CxBAoGABECo+oJoKyHkRqVNO26gbBcVMgxWfKX6WxBcaffVlj6QupeMV7F0rtVeNqVMksF5VWjjIZHYdPiwA1TUm1ebbvZ/fPQQr9LeO5KcjBBPzs8HHy9eTbnT6EUpPFSjJgC6jPr0iNnKt/Y5VA2ShnWP24F/4QlZUkGeMlUmGWUa6OY=',
  });
  try {
    if (process.argv.includes('preview')) {
      const previewResult = await miniu.miniPreview({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2021002131691300',
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
        appId: '2021002131691300',
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
