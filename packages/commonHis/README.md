# 重庆沙坪坝区妇幼保健院支付宝小程序版（凯桥标准接口） 

蓝湖地址：https://lanhuapp.com/web/#/item/project/product?tid=8d89db45-f465-4199-8811-cf247de0627c&pid=d0078297-1f4f-433f-8c77-59158ddfe081&versionId=18a8fd04-bc76-4e73-8ec4-7cdd21af3929&docId=16fe659b-d9a4-43a2-8a36-4b87d25865ab&docType=axure&pageId=2a164f29fbe54a3bbe2401fc60a9deed&image_id=16fe659b-d9a4-43a2-8a36-4b87d25865ab&parentId=f5a62c3c-491f-4577-bacf-73ae6bb2c713

使用 Remax 开发跨平台移动应用程序。

- H5公众号版开发环境地址：https://tihs.cqkqinfo.com/patients/p40064-his-test/#/pages/home/index
- H5公众号版测试环境地址：https://tihs.cqkqinfo.com/patients/p40064-his/#/pages/home/index
- H5公众号版正式环境地址：https://ihs.cqkqinfo.com/patients/p40064-his/#/pages/home/index
- H5医保App开发环境地址：https://tihs.cqkqinfo.com/patients/p40064-his-app-test/#/pages/home/index
- H5医保App测试环境地址：https://tihs.cqkqinfo.com/patients/p40064-his-app/#/pages/home/index
- H5医保App正式环境地址：https://ihs.cqkqinfo.com/patients/p40064-his-app/#/pages/home/index
- 支付宝小程序正式环境首页地址：https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001195610360%26page%3Dpages%2Fhome%2Findex

处方单扫码付地址（patCardNo动态参数）：
- H5公众号正式环境地址：https://ihs.cqkqinfo.com/patients/p40064-his/#/pages2/payment/order-list/index?patCardNo=02710713
- 支付宝小程序正式环境地址：https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001195610360%26page%3Dpages2%2Fpayment%2Forder-list%2Findex%3FpatCardNo%3D02710713
- 聚合支付页面地址：https://ihs.cqkqinfo.com/patients/p40064-his/#/pages2/payment/scan/index?patCardNo=02750854

微信小程序 CI 配置：
- 更改 wxci.config.js 内容 
- 运营后台获取 key，更改 miniprogram.upload.key
- 运营后台配置服务器上传白名单
- 放开.gitlab-ci.yml微信小程序CI配置

支付宝小程序 CI 配置(配合miniu):
- 本地生成公钥在运营后台配置获取toolId
```
运行miniu key create 生成公钥、私钥（pkcs8 rsa2 格式）；
运行miniu key upload自动打开浏览器配置页或直接前往工具密钥设置 页面进行工具公钥和 IP 白名单（可选）设置。将第一步生成的 私钥 在此页面配置，设置完成后系统会为您分配一个工具ID（toolId）；
```
- 更改 miniu.config.js 内容，将第一步生成的 公钥 以及运营后台生成的 toolId 配置
- 放开.gitlab-ci.yml支付宝小程序CI配置
- 支付宝小程序开发可以使用 miniu dev（yarn ali:dev） 开发，开发效率比IDE快
