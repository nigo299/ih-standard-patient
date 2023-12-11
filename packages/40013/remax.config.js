/* eslint-disable @typescript-eslint/no-var-requires */
const less = require('@remax/plugin-less');
const DynamicImportPlugin = require('plugins/dynamicImportPlugin');
const path = require('path');
const REMAX_PLATFORM = process.env.REMAX_PLATFORM;

module.exports = {
  one: true,
  output: 'dist/' + REMAX_PLATFORM,
  plugins: [
    less({
      lessOptions: {
        modifyVars: { '@brand-primary': '#CF000E' },
        javascriptEnabled: true,
      },
    }),
  ],
  configWebpack({ config }) {
    config.plugin('DynamicImportPlugin').use(
      new DynamicImportPlugin({
        hisId: '40013',
      }),
    );
    config.resolve.alias.merge({
      react: path.resolve(__dirname, '../../node_modules/react'),
    });
    if (REMAX_PLATFORM !== 'web') {
      // 取消mini-css错误提示
      config.plugin('mini-css-extract-plugin').tap((args) => {
        args[0].ignoreOrder = true;
        return args;
      });
      // 取消不必要的输出，清爽界面
      config.devServer.quiet(true);
    } else {
      config.output.publicPath(process.env.REMAX_PUBLIC_PATH || '/');
      config.devServer.proxy({
        '/api/ihis': {
          target: process.env.REMAX_APP_REQUESET_DOMIN,
          changeOrigin: true,
        },
        '/api': {
          target: process.env.REMAX_APP_REQUESET_DOMIN,
          changeOrigin: true,
          // pathRewrite: { "^/api": "" } // 匹配 api 将 api 替换为 空
        },
      });
    }
  },
};
