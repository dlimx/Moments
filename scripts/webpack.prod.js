/* eslint-disable import/no-extraneous-dependencies */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common');

module.exports = {
  ...common,
  mode: 'production',
  module: {
    ...common.module,
    rules: [
      ...common.module.rules,
      {
        test: /\.css?$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [...common.plugins, new MiniCssExtractPlugin()],
  optimization: {
    minimize: true,
    minimizer: ['...', new CssMinimizerPlugin()],
  },
};
