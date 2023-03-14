const fs = require('fs-extra');
const path = require('path');

module.exports = class DynamicImportPlugin {
  constructor() {
    this.commonHisSrcPath = this.getCommonHisSrcPath();
    this.tryExt = ['ts', 'tsx'];
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      'DynamicImportPlugin',
      (normalModuleFactory) => {
        normalModuleFactory.hooks.beforeResolve.tap(
          'DynamicImportPlugin',
          (result) => {
            if (!result) return;
            if (result.context.includes('node_modules')) {
              return result;
            }
            const regText = /(.*packages.*src).*/;
            if (result.request.includes('@/') && regText.test(result.context)) {
              const pathDir = result.context.match(regText);
              const rootPath = pathDir[1];
              if (rootPath) {
                const newPath = path.resolve(
                  rootPath,
                  result.request.replace('@/', ''),
                );
                const commonHisPath = path.resolve(
                  this.commonHisSrcPath,
                  result.request.replace('@/', ''),
                );
                if (this.tryExist(newPath)) {
                  result.request = newPath;
                } else {
                  result.request = path.resolve(commonHisPath);
                }
              }
            }
            return result;
          },
        );
      },
    );
  }

  getCommonHisSrcPath() {
    return path.resolve(__dirname, '../commonHis/src');
  }

  tryExist(pathDir) {
    if (fs.existsSync(pathDir)) {
      return true;
    }
    return this.tryExt.some((ext) => {
      if (
        fs.existsSync(`${pathDir}${ext}`) ||
        fs.existsSync(path.resolve(pathDir, `index.${ext}`))
      ) {
        return true;
      }
      return false;
    });
  }
};
