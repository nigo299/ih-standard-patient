const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '0a4014a9aace472badfd2867f59002b2',
    // 小程序私钥
    privateKey:
      'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCg+J9LjcHcV2esWdKQzHuFOkaC2TRhJhyG81d6kq6osgOhC8ZctHij0IhBUdKCzH8TGNPT8tC9V68S8VIQADebL6PuNSpuMYnmxakrqgP5lQGjgNZ9/LwIqmIt1tAe0Ja3qyWnK9qfaMR2LtpWxXVrOSYTHZYAOrvvFmo4uy27yue9Odnn7U/3P+x6NMqidP1OMVuJP0nut47tUq8Rf/g+4ycDGwvi7sRGDan/xI2W7AJNj3Wk0+3kyPskoQ+AjD+M6+gNFv4e+N0pnHcR/PSGapViJCcHH+HBqSGQGmG9wdUq3l+3REcH1coofOQvXzinhBt5m/sHX/jRcKUJuxctAgMBAAECggEAT7hx49Az53UeMhxWDUJIFkYzL5B0wXxHeoo/k8PbXk6zP2n+dmEmsjKPmJH2SLMQaBvOpNRHjs5DNYVwV95Tq7afYFTSS7qbCkBwNODBkTS7mAcxszmcwknnz73oWqqBSjsnrbApWPNhAQrZNUobidvGwIbRiBGOi601NB13W94q+cpevAW8izgKu4gAjW/CA1lR6SLVfaHCXYVazwbrGy6ghfd5LG+dp3NTNJLpnSWeHCENvdH8Db3QlLhMLEYT8tfbQlzKMAmJdCVl2uXjCSu6XZB63AEVoOiT7GFqGvJpMgSQlStektRaJSqSxnedZF+9WfKCNkLaBFb1HrBHYQKBgQDZISjgAihHHrzMfZ18o8ynSnhHKnxz1AfVA4o/GOBmO/y+3sQw85APGDq6L0qnB4jrvKAlsD7sUDrmCgPnYJjKfjK2L9/YERjJrzsGP3WI98Buk29HwASQCfOGl7MSAlSRpseLkD2rLDV+f0BqTXOKK+fwAuvB/e0FHfJ6AvRFlQKBgQC9ycdZ9mR7Hj9jgX7AKy/og3TD3kEdq6NqARGTAv9SZB8ontBwD+IgTfkXNGJpHHdnaeAVNhrAy7JSgr5nHdvfTwnZoGNCIG20nISucaiSPIcOdvoGc1DYgTbJLL/Rzr8sPrCwyaHJZ+VBQu54eGiKIU5/Sv5Wg4dw7V7X/8D1OQKBgFnDwbhKbAhrBrarv+4Fcdg/i1YwlF72a35/BipryGm7pxPp2MY8C3SSGcVbQ8ul6885niO2p2zfBlqQDWkcoE4muiRjynDzMIJA9W/x0E+dzWppfXn2QmyiEJG2KYvqdrf4cUqbiUM49aykQycvefLHkA3Dx1/d8J1K8jHLAt25AoGBAI8ZAux78Qs7pUPbsbwnU/oWlAXTIHnEnnQg1iVojyaKQ0wXYsX7093TrMqoPsNOKWGZ3NFheA6CB7RazEFnrA7Vw3GJkw2a8dzKXuhA3n9Uj+iCIMaYUA7OboaE7SS+pDoyEntZrFj1s0/frXq8HuZ3cn5cByUoCwlEkMyAE/dRAoGBAK3gV92hxwOSR4oDpmeLZEa7f5XwoMvgTDk3+3Rgx2DVd2ymly4x2ePi9FdmhFWS8D75y5O+8lMyASPZr9HDDnZdPlnMC9k/o8CCz7NiDdLzARAQnnzi6rOQGdX/ZidM73WuAmyrNv7oECByYR4z9xbdp/ADwf2mpIovRBBnQh7r',
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
