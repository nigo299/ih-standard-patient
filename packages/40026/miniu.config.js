const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: 'd48ae78e9f1a42eaa6206ef6d197ec05',
    // 小程序私钥
    privateKey:
      'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqQncwYg3NmJ4ByuPuKRbm4w0DrPCcdqd2ovCoX4URjQw5uVqOdpIIdvdwRR5lLBs7vE2/uzFLRPy8W3I6CeN6YrqccgjefiwZNMExhMUmx+ViN+Oft5lcyAF17iqE+GlkvgumGKfaS45nnRkcN4RakEiyne8q3EAG8lK0LEptve76YSKYRzsRa+S8ndGKhPIP4i4KIM4b9hdJ+j+8p6sGcml/Tf09U3OwVqjsbDswb7pAeWglV9LeA0J5zenGv9ejhJL/yh0sAZWkJ1f1NYGqP+aVF2IwjAinWW+V6zBO8zEGEvkXzqoVjAirDvKdj2uEWFCZzDZcwZzFhVd5tzF5AgMBAAECggEAKWEuBpxOLoHBJT5iVye1YTgdmZ8We3B7EuJXCxTsCm/1YLIjyCwZIeWIDck+segeVk5VtxuPx3Nk2YKAKIrutnf4Ur2EWk7f+OBRc++I2vwKS+y5bb/5jgsuD7NqshaNxuZJfnzPjsZ+PcB4sdrsV/ZpNMAduJT/GrEaWJ/LFxCEfUXZ0KpvY9BRzuVxbyNPD97Au5UWRgB4AvR/vAJBHDZxhSy5BG3Hb2iXKJmlnpsnAElpGw4z4AMqEeIEKQv5UKdi7Hb9V2M1lnYZdmsd6rHNOvpDTck58AfENZjAZPQVc8nSIOu429kCZet1Fm5OZ/bqCTJkbN/5mgljAF68AQKBgQDj5b+LV7LeSGrDKjFbxBDPZjMHzfu8iXo34SHLrsl0yyEkuL9AyCtE763GxbqU9vpZSCk+J4CQT7/8J5/w2YH67IlvOQTd4k3x9v2l7U8KBgGh7wvSSCYEEDfN1oo/TXgK4hj8DlisamL53NkFetgVIiq/KZO0UJkZOJk4ZgOxUQKBgQC/QTXbS0/UQ0mPIi/EAYYJaQtUnUG2O1Pqq2ByPvP86QjJaRvxzJwZMlKhVBG55JWP2IwwF3BqDttZhtTFMFuGnw3az3ur1ZYdadtkbOOykNUXkbzmT9TbbM03U628MmXEKmrJDBEoG0A67NjJfS5Sz6Q2yeW92SufzjE3OLQzqQKBgEJVqX9hs4rIAWt1aJCRbWMxGEF5T4D9czm4qiGjarg4OBl8PQ8aNJ4INcjZ3QlnKk+6lWamEOHwlK1My11Lsm3bU9Wv/x6mtJFtlz8o6Ay+2tLLxeEbZxVfsx6TCAKNBhgE38jeVCk7fjvEcNcLfsIIA/FIpNmjbCzPMKod541BAoGAb3IjXPcEvI69FX/5T4EHxwIEDTlZqkPmAW/90nTmnjB440yxcPQm3fPZ/JJNhgIyONEZ14hBBDxGC2QrJgCoxMh4PVH8IcRjJh6iLmHZSRtmYMaWyaopQfejmaLUMT8419dTxHWYpcNDaVLMfJTKYo0GhrqdekRLTGLNgP003IkCgYAv1rUzyo95ddu1ErLpQvUrIUYSaGSEo6g2D1RJIemif9hUKOo3mJteTGAZOIpdrqjoCX59kqbkhRtSZh5H4ERXsz00BQkt9Ney4EcKoeMYCs3N3rJgq+xzBeNyAClHIF3WdoMGxPKw/RGLQSacAGNJzkoR2d5d8SUj4XGDsy5Ixg==',
  });
  try {
    if (process.argv.includes('preview')) {
      const previewResult = await miniu.miniPreview({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2021003128628146',
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
        appId: '2021003128628146',
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
