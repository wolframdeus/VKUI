const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfig = require('../webpack.config.js');

const { externals, plugins = [], devServer, resolve = {}, output = {}, ...baseWebpackConfig } = webpackConfig;

module.exports = {
  ...baseWebpackConfig,
  entry: {
    main: [path.resolve(__dirname, '../src/__benchmark__/index.tsx')],
    vkui: [path.resolve(__dirname, 'styles.test.css')],
  },
  output: {
    ...output,
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    ...resolve,
    alias: {
    ...resolve.alias,
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
  },
  devServer: {
    ...devServer,
    contentBase: path.join(__dirname, 'dist'),
    port: 6060,
  },
  module: {
    ...webpackConfig.module,
    rules: [
      ...(webpackConfig.module || {}).rules,
      {
        test: /\.css$/i,
        use: [
        { loader: MiniCssExtractPlugin.loader },
        { loader: 'css-loader', options: { url: false } },
        'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin(),
  ],
};
