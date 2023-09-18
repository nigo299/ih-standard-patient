const miniu = require('miniu');
(async () => {
  miniu.setConfig({
    toolId: '0a4014a9aace472badfd2867f59002b2',
    // 小程序私钥
    privateKey:
      'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCbNDag9I1dub9VSDwyXXwOamfSfMxh23uA9ydRZD+yGVHNyW3l6rexFME9cSljvsiD23pIGKjCTol/OqHxplxEQA+pKZC9ksrevP1KeORjCxYXCw5iT7YGK3GzbYcb+ih+pS3zPIrgm/9QAEWqXcy5p6Rsu/svo7WRTT4BYkxpBCkkn3XJfj3nd/YjWS/qlRRYgM2bD1fJl+a2mZn+sPWvR7p4hihJKkWJR+2EKArCd33jPn4TIu0uTMV73wTmX1rRXpJnDGMw/YR/f+EVPO7g47TIImfg7tZVulYEuggfgFi7FQcefCrxZxaeg94jo2P3c+ps/iXPUv28WD1Dsos/AgMBAAECggEBAJIblVHw5yRUuMqQNhsz5pWrlhGRata0yI+gHGOC/HOtYlVYSx0m2cbawxAUd+JuuFVpSLSWgkhppwcfK1VSR4n4xMV7W8cbaeBGCi0Roe+bgDAxOFlUsQcd3uwLMCYmWfjfh2J0nEjWkoO9vdekdhZQu3mhfdZbR5KCJN0orMYuq1jbIqfclEybvzcRLCy4ZByKVY8pjxaANwwa49zVeiMhED30Ay0pZQ/BrB/lL9sO/+wJsBBE6bPZnbitKDs8cb40mWMVRn5dqjXT/4Yt8jKYWrDn6kR6pwAL8y95COTlEVRvyQlaXbO13jLOPT6TI5t6vS72Zy7bvcnN3W258AECgYEA3HBfBN29WCxpjZJQwgANXr2t0cdda7XoS9y20A9Ct1BLnHQR7EGlI1JOSG+gt3fpc0wcdRhi0Ngkze3sTcKfPjGMM8jZZpARPwROmVun480LVvW/7QrtcvQw3a9NQjCX4QUYnfMOvpfyO3hW6BZ/SQ2ObLhL56YAyyYNEagkYikCgYEAtD3I9ShN7P7XH3WcuzPwRS+cVgL354/nlPUqBoRwAdqffTmMZVGxJBoiSup/jwqPQdjztgRbOQwNEpDS+iik1onjAILrHPIIyJZJfYZn7f8Wc9MrqWPtSnC6Ytehpr0Ov7RjU2wTxHT+V4cvrtP6RTW4glAZuCobCpjmoDTzvycCgYAsOJKnLEBentIx50cyE8aa2dwzuBXClMRb65P02wrcMUxpv1MVHPoewtUXbOVFyNVZHsyapOC12pZPhUohM0i0tkXU4ZbTH1WGWbvWwe9FII4EzNnKmKWXqOrgndkWzR66skYE8YxkqaCbU4HDnze7lO+cWcBIYSHJnwGCKEPcOQKBgQCzmQkgOAwGBh0njNMiumtFFV7rWcPaKktw4yYAHoFZZ5YaeniKEO+48I2RJr76MmRzEZIuoYKggoCYKlT/zfYKjJT0Un+idQ4Jia8q8/2ladPej+HmxNqSnWcrzH+YHLSQk1eRrZS44nb5kowR4cl0o0X6G4S1PMd7NMZBhuIGawKBgQDM243b1/Oe3OVzcIjmxk+WOnYYfNNE6AeiKnDUZY6yE09PVOnCKFzRT4DuMGtJG7mgwRSzLIcZ3nIu6HlDNtl0SYkNYv/0knyvgWmX5ql282p5HFzvrnZKGE8ADBjs35Zg5ABFq7cbbB0WMPdQXfCXDUKqx2mu2FX5WL+Xln5ziA==',
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
