const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '66b026fb23b4421298b94e41c7a85596',
    // 小程序私钥
    privateKey:
      'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCZLuovQx4oV3RUj29sfEUksudIGeWaMig81UxPpmZCe+5itKDZEawEOMhYNqTwo+CsBjlb2cTCopgaaZeB2AhcFEinc0JmQFtP3vk3DGZhZa8PzAWp8Q7cF5tGlu+lZvvWvwR3iLZck8IHuhHbUdSLsutERSBrAGroJ5djeLb1g2kCyy73ynGXMO2bh6K8rxHBEor/pUYoTBXULgeyntnmoany0UXOKnYIRyQV0+gQ32Xncgq5T+bahvSZck9STXm+pBLxfGBoTins7wM4BZhxnGBCNuPNd8kz66ueKx6GyIxP8pT7QbqpDAcd0RHENS8GPvm5YlzPBSTXg2WiMU3TAgMBAAECggEBAJLH/6KV/7nMQy4b2zrqwR5vR2sxVW8xjJjuEhdobShbtItkZZRaeKf6+Q5+HgJwJYLw29mFjCKsxm7Yq1LB/RCuZwf9S6zLEjQwhkEXYqsFUoAikXLMB98hx6oWS0AEtGCL3O3lVEjVVOEujJnJiY7rPMDINE4Tsl0OQuQP8dDCRAVMGarwjK7FFqjwFb/N5PbRltywO/zbQD83CAWtfvpKw2h2ZC8PAFpppDMxxKQhuXHlwgG95Fg9hlRdMl1472Wz+x7dZDKaH4ksRjYGAlIBwbq7YRK2koj5Vmqksr63RTKlUZ4UpbOhObRueshhnpLimr+Cpe9341LiQnomYjECgYEA1sN+Q5Qmx7bpvTpzzSFVk6QbkE0+JCFHVNP3bd6LjJD6W4+WFiCI9GBWgqCmhN7dJuN0jxfee45Dv9HS+cFc37LPHgxgnvBla/kiCCNXpMlAR++IwcxOENhsIa2Jc+o+09iWwoVS1mTkFrjGWNRrDJjMxNJAL7bYyrGvaLV5XL8CgYEAtph+w4Y7bWpPukXeEeQ5QpvVUxFGvOAS/jAqLbs8GxZ1sAAAFOOqO5L6cc6092tp12xrLOwiXbbZT6DjilKDo8t1Eo+MJGotj92XpUJ/yZI3LcFraqYFR1tgXR9Pz8JvAuNo8pQKpVKuXMJgzFRXJ7uv1m6f5kzkX4R80T8oz+0CgYAiQRohgz7QOe98HBeeT0PMAa/Xy0ovDxPGhux/HLDbYcBc3EEPFG9jsv35ZdBJfxZ8/mh37lGxGVbbAIeLCHlcwLNiUo0SrLswhpMUAzcWdHcJQj5o0sJc03gjwv8aevE8bt5U9ljpEzyCF0SjpHXSk4iNmA9ezOY1JjQZGmDaFwKBgFNpYi8LeMZI1FbxZ7qgmQ+2hELIF5pcehCoC/yMFa8CGYzm0yK3xaIlSEcI+F42MUl5e5Qv4psQ1kCr7IXZn80JOlfaP1i7MEkSHx4dPKbmJlK+ksVLRgoM0f54OUtdNL0LCXwW6K4RERnKqdFtjcrW0EKSknTwFzsTGLm1sn0ZAoGBAI2espHQHRnS/uFODgzQEHWwgBhuuJjXCF40Y5xkmhfA71y9r+kDk4NKIoh+MxFq+1B0T95/zbe+NUscY610NTgfGzoCZ/3+tUptoIesNFvGMptThAOHjGstEk5xJjkipDAb6zqVEgZ+i1hOFKOX2uJIiLc0Awg5E01WIhEPMvQe',
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
