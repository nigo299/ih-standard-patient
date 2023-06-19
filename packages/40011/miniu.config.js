const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '66b026fb23b4421298b94e41c7a85596',
    // 小程序私钥
    privateKey:
      'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCHoiYCaOThdn9TMJb1XocaJD+sku3/puhLI/WNBLU7Uj1mrgZ76DpboeFyNV7+mma0wJDtCJodblk+U3Q3UlvG7AcsSvgKEEmWZO4yUeKz040jC01FpRScCKKgmp54xYBqLIPAuOgtykVyHSvOkWfkCHXZ5RHEs837YY4ROLQfjRuWVHaAEjswB3EX3JcP//qY6HUTc2EFL+NQERbtKn83u4R8IxSbIv5eWCyQNYdKh0ddWV0U12KOJDCl0ESvndLYlBZ85qd9UXoZhbPrHnsHWypARn/COmcNSjVwmd5hSaKxEPUvJfkoDp+eTbjzIdhEWvNvwz3jFA+H3HUE1tlRAgMBAAECggEAcsjYD/wDj4eAM8AQUXGBNq9sr7jc8Bmpx0WUXpaYZa6wxgAK/rvG/5tdNxFR5nh26Qt62w8Hlla38hYgaV0qzIsdeu+rQKEOFdgu+ajxCazEad77szAE5BQuxWp1KNJEXhZ0Hhqea3oeEXf8heHqoUJDsna49dYRQWgLGin5ziSZ6GD10LiEcH0ywLvsEjYCgNBX9yAuiK/DGfO9WQgBIqbICtE12pCjoTkSIq7Uvk4lZ9rQK2zJ0FltgyemXbQhPvk+JqnglYywlZiY7oQYXTn6hR5BB/EQL1orl0RaxKzAc+48n+vVBB+G2CH1Vxt3w8PwTKSNYcvvZLE3AVD8bQKBgQDIyqKoZLfkZAFaIyxzFXCH00Tdz2y9RhxavOB80FdaGYNGmEd6bsfKwsDKChruj2Mhuoj6lKDBbikSft4sy9o7uDWHIZn0+ct7q6F6kxlfudRlNYeN5uZz/OxbZkgjW3hHnawGwLR0VxP1mNzAzXHlz1h27qUSLwcdRJMSLAVm0wKBgQCs7SUi7kwvxXK21ZpWQJIc5w1+iY0oABdvSqHG/yKSLdzWsu4rBhztAb9Gz/gL08ViNSrTETJv71SX8+/bXyvi/nqNtsE28yS0KClT4i5nXjAAIa/YnNXuaytf8tzR0JsQwDKoygadeAvQ8mqUOyffXr/mbVl7cm2HXXy0auZwywKBgC7A4DcNnLQVhSsT3Zm+eEFoNDThw5Qe6yNFr4/ggzZ7klGxy5L6kJLp3jItQDAkOxTzdknCqdvgZrfjyp/rp5kYP36DmHGuaG8Xe7Yq4lGj14zpdfLYvPhtACwYGNwCxHMIh7Ha1SnxzLf3LA/IxqiYKyUmVFFzmdh6yzQEBA35AoGAOcW0nXntfBxEGe8888n4xq0upfLAdPeq3KSbbcc5PosR96ypwzf0m/30cGz0msbyb8ABgaiCKEFWCroVjT27hMeuHABNhtUukv3D6OFszV37PWADxqOHGXM2d4TE31gJJkx/4EI2eY9sqy8CCmnFBWw7QnmP5p0xGINUMVZxjIcCgYEAxOlDRyiyTGBdSCnwjSB/c1HzNdaFAMVuvejgySpzam7a5rWKI4kPEOjKTYX52g9KWuY2cKVb/hhZAtUhL21D/WQYsWuANxKddAGGr0oY41BFU042VZEjwv0BJhEYUbmFkNSfjbykuD3a9bsCV7CXhl8MrpOeLHly+HubH+UVKtE=',
  });
  try {
    if (process.argv.includes('preview')) {
      const previewResult = await miniu.miniPreview({
        // 项目地址
        project: 'dist/ali',
        // 小程序Id
        appId: '2021002126681891',
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
        appId: '2021002126681891',
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
