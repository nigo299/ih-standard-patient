const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '3958f2fefc6e440587d3d1ef77c8771d',
    // 小程序私钥
    privateKey:
      'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCL4gmDVDhQIswj8+d8sKKOkEH1E0KtDd3NFOBsJvAtwMWUXOR9sLLfIeI0+8KmBc4TPJ9VorzbFoy4cT4hSXOh3uMOc0oQv6x6k46Ba0fP17sgWlZJiwqAZDpu/IjHHUkk+A6+2wVApMuuZNA31Bw07672Llw/mezWOA2OOwUAD8yjPvjvavO/6FPjDx2J0Xp58xHBLLF3Xzj8PoZde9nqdlJBIjex97DJ/1MQDgNskkK/9JZc3pqtpaGbf0dwcYQkL/PT8dJk/kqtLui4QkGm82nreLQTtXeKcR7oelnJTjX6vUZtWdCTau673tSzlyRKZWG9f0ixb+C7OS3bhQnfAgMBAAECggEAU82sw1hOkHv4b0Wtlr8/9EcqrMfIN2NKUZZDSageVlraRCNO5Jpa32EuY229VLe/mTjFgImJuXwN/GYjwc9+jii5QSwC4Hvkul7yjkiWckednSlh7pd1SCxD8cArtZau/o36T49p2yuftzBAqmHSMEi0OlrV+2idQk28mUx0l271y+iDM9NZX0zkLsaXpqiarv0EjesgybAWjDPq1WyLGAGKD8uxCMmx5VI1aNNomJoqjxuShiaOBTlFSfW0vuyQRKxFCf8PkY/TrIuu8D7yoM22Xm1NiCOXRO5uQ+EK4ux3DPzylXA3g5IKV/f2vmBAf9DwDMN7ZBFDZ9mvsYmAYQKBgQDzRsLw0740lDZQfrnt+DF7ZXwRtJVEwHLy9RTzhk08x6tk5Jko+KcgLXAgtwroj8HlDXTogMeDWfyhPfavxUgVVITREnm4yu7E03/cW5lBjZCfh8WloK5P5NdP2TAIHZynQkLeNJIQBijCcSZPcIm0g/BLjfP0qlkv05t73zS7sQKBgQCTMu+qX1mleHmIX0miyNRMdqqhLNXsDCRTWm2QuCMkOsADFZkSc0VLLAptz6P/4Cq1Om+nsYhj7uwVb9rskdXr9rAgI7G9ppv8C30e1ylCPbNpMWK94I1m2YJyJv7Zmkao+xMmir8Fok1HATr4gnRMjz31tfxmPcnNcvu2R+nSjwKBgCRJ+epSq5zMPw3i2XlV/Iubp9Y8ScfnrT3wsR9ieUMHxdlXAEHMVaHHJWK76zSlvRad20KTcy90zOqAg7vUgdwsr2NAjkeyfct+gSQtxb6xj1E8v47lWRsx16xhiXisciHBEJh03xTk1k+q8TwIXYI/7ChZFHr6rjMkLZ1cvlEBAoGAbwmkavPEbyMjInEm3en647c8XZqxwH8kQ9BaCCovMBw1Td5T+uwDYIJXV6CjiNhzvwPWyDwOs7u+USlwjrYwFfCfyY7DfFmbHxUXjFUoJXTfysFbR/qFEAmR8kRiSImtNbk4KAHPuRNGkgJmlqHp0vrW9WwTepivixBquoUi6BcCgYBE9X2xZVX8Q4gi8bH9BAFe/uDSrkixAvIEcjOEAyz23JZATNpo0r6xKXiSsS28Mrhw54KXi5tS0BBDmp/OQj055U38lXZYC2fge4AXy0d/3uXuMIAL5CbYhr/vzaOPZnEl1/niGKvIPYnfLD9Mus5QnfG7dx7YwDkau1pS/Jk36A==',
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
