# 通用智慧医院仓库

## 仓库介绍

> 此仓库是基于 `lerna + yarn` 打造的 `monorepo` 仓库，通用医院模板采用了[沙区妇幼医院](https://ourgit.cqkqinfo.com/fe-his-groups/apps/40064)。

目标在于最大限度复用智慧医院通用的页面和业务逻辑， 主要包括：

- 脚手架的统一升级及管理
- 减少重复代码在多家医院仓库的复制粘贴
- 一键部署新医院，并提供完整的智慧医院能力
- 通用功能统一迭代，不再需要多个医院仓库修改相同的功能逻辑或bug
- 支持各家医院的个性化ui及逻辑

### 仓库结构

```bash
├── README.md
├── commitlint.config.js
├── lerna.json
├── package.json
├── packages    # 医院相关的开发模块
│   ├── 40070   # 独立的医院项目，文件名即为医院Id
│   ├── commonHis  # 通用的医院模板
│   └── plugins    # 实现多仓库时配置的webpack、babel插件等
├── patches   # 对node_modules的源码改动
├── scripts   # monorepo的执行脚本，目前包括了生产新医院的代码
├── templates # 生成新医院的时需要使用的模板代码
└── yarn.lock

```

## 新医院开发

### 医院新增

进入根目录，执行 `yarn addHis`，依次输入`医院ID`和`医院名称`，会在`packages`目录下，生成对应医院的项目目录， 如：`packages/40064` 等。

如果需要调整相关新增医院的模板，需要在`templates > default`下面调整医院的模板代码。

### 医院页面配置

进入对应医院的项目目录， 在`src > app.config.ts`中配置需要应用的页面。 

`app.config.ts`页面中配置页面路由时，有这样一个规则： 优先在当前项目中寻找页面文件，如果在当前项目中没有找到对应的页面配置，则会去`packages > commonHis`中寻找对应的页面配置

比如在`packages > 40007`下面有这样一个配置：

```js
const pages = [
  'pages/home/index', // 首页
  'pages/mine/index', // 个人中心
]
```

在`packages > 40007`项目启动时，会优先使用`packages > 40007 > src`下面的`pages > home`和`pages > mine`页面， 如果`packages > 40007 > src`下面没有`pages > home`和`pages > mine`页面，则会去`packages > commonHis > src`下面寻找对应的页面配置。


### 如何处理智慧医院的个性化需求

这里分为不同的情形：

#### UI上的大量调整：

- 如果是涉及到页面的部分组件调整，则建议将`commonHis`中的页面组件颗粒化。 然后通过在医院项目中，通过相同文件位置的方式来实现项目直接替换。
- 如果是设计到页面的大量调整，则建议在医院项目中，通过相同文件位置的方式来实现项目直接替换。
  
#### 逻辑调整

- 涉及到功能开关、接口地址、接口参数等，建议在`commonHis > src > config  > his`相关目录中，增加各个医院不同的业务逻辑配置（注意： 不要把页面相关的逻辑放在这里配置！）。

### 如何处理引入问题

这里主要有两种引入方式：

- `@/`，这种引入方式是指优先从本项目中引入对应的文件，如果本项目中没有对应的文件，那么会去`commonHis`中寻找对应的文件。
- `commonHis/src/`这种引入方式是指直接引入`commonHis`中的公共模块
