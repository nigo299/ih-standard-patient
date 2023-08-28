const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '7d45158f992a4a938e561c2906e2d8a4',
    // 小程序私钥
    privateKey:
      'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCO0T1U0cMfDQQzDXXOtdazvcqyqSpBnXX0VcbolY0msg0TlkcDlr7kd+0zb3C0Q4aPd5EPSpbzrJo24nkIkml+IDS3V0h+vGuACvkynUhuZ1j+7x82iqdlAlB80h9nKvr2U0gtE7GCahL+/GtcbDROPtypDzVeP3EboHUxXbYQKF84Syokic8YVNTJV3RdxeNU8GyfbN/0cN5vwyNQMapgJeZ1SXooCuZnqBy36P+T4AVKKriWraFrHm8Bl2i44D1blljGvRh+2kWqcuDqKiPmvwvZ5046H2kiaXOnRWJ4ArOlufDLe42+JABW9RySmORx1NvyOD7vKF2ztA0ev2wpAgMBAAECggEAS4ULeHGfSykX4mMou5DeIpemusjHRoEcIYLGNrD2PdMDJStfC9/Hu4pLDNrN7xSR8AVa2Iopvlq0BXfGZqj9Tat8FML728CI2+Fxmrke1vqhTdVmXPH+yGPr6cU2w9gvctfhH6z9PagXuWwC3ZF+Ky4EgwU+xEKp7eDwd5VFM89LAvLR8zy0TEMgTnvLHROtusy601bKah231iARZYm7DJQuGAKQ7MtsgI6b1uWP59YedI21wyERetYpYubTEcYt00LbXYzdnm6CWnQe/Jwt/c0053CSw9EeBEc2VQNCgFIOngM+WM3riNoD5zSsIAzWuNs4DpaYZ1LKtu4MTKb2AQKBgQDGy6w87QDIMrKSUGaqeyHp44LpWftcqYv7u6iMGGdhmH4Vn1b5PULhsBV5V2VCA1VlMna1dpo8bONaOlF+Y/JVApXdNv3y9lulALRpGKABVO8wSiTVvbcK+LR++95P7aWMSDbz+5ahjOMUT/zhNHRzL94vmS/M8O8HmWj/K3NCQQKBgQC36eooWaqNlDH+YYmZ5lA+NqUtZzDGLRJFswD/d7W22lIv2OPNwUzX/QK/0i1OM3xq9aehDEWub7TqPFH2xGf/SAdXNOI0XUHJ/J3MjPEVqhlpx9isvUv+xTYGq5U7CigXuezi6Z04jfcNguYYGKygFFGwutGRCqmTX5YAmMJf6QKBgHrmB4FS9BzQWt1hn1bd8MVrxc8FtgQ/PS9PgI+7to37fFdZvqcvXF2yQlRV11/MN8rsO79Lp2ab2qI5U5BTsckkZAnyqWS/MUD9AovGkYTBQW4VKFiLhNHfl5a5l2LKhIIJUw/bBfCx7ODt4mRHzYY4nZ/HkGmeued0zBiUgBkBAoGAXVbFNVdUnOgie1UrTcU64mg/aoydj2aeiGsxzXYG7lddMNVlwC4jftb0xz+3KKIuueYU/kJJNx+QdPTKMHA7y67VsuevCh5uXkHsID1DudgLb8kyaXDlGdci9T2tzjn4YRpGZF9mIKbERMIzXvVe3xuQ3h3icDc2Gwp/Cax9sckCgYEAuIC0dAkqoaGrGEHWRBD9JME4mOejbiBsnJL9Vek/NrC82IRehGqrzRemUFH8JbHCiopbQ7NIjdlN4C9CCrzQcgSNVF3jZ+Jw4SAwAOtApxu5IwF0YFAwt517H0Qroii5/RUYQqlOS8OADmeXWx2yXdf+ymn/Wq0bwQdcvSl2kmc=',
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
