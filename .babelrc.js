module.exports = {
  presets: ['@babel/env', '@babel/react'],
  plugins: [
    ['import', { libraryName: 'antd', style: 'css' }, 'import-antd'],
    ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'import-lodash'],
  ],
};
