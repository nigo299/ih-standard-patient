module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'parsec-hooks',
        camel2DashComponentName: false,
        customName: (name) => {
          return `parsec-hooks/lib/${name
            .replace(/^(use)/, '')
            .replace(/^\S/, (s) => s.toLowerCase())}Hooks`;
        },
      },
    ],
    [
      'import',
      {
        libraryName: 'ahooks',
        camel2DashComponentName: false,
        libraryDirectory: 'es',
      },
      'ahooks',
    ],
    [
      'import',
      {
        libraryDirectory: 'es',
        libraryName: '@kqinfo/ui',
      },
      '@kqinfo/ui',
    ],
  ],
};
