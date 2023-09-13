const webpack = require('webpack')
const { merge } = require('webpack-merge')
const config = require('../config')
const common = require('./config.common')
const cssConf = require('./utils/theme.css')

function getEntry(entry) {
  const newEntry = {}
  Object.keys(entry).forEach(key => {
    newEntry[key] = [
      'webpack/hot/dev-server.js',
      `webpack-dev-server/client/index.js?hot=true&live-reload=true&hostname=127.0.0.1&port=${config.dev.webpackPort}`,
      entry[key],
    ]
  })
  return newEntry
}

function getPublishPath() {
  if (config.dev.publishPort === 80) return 'http://localhost/'
  return `http://localhost:${config.dev.publishPort}/`
}

const jsConfig = merge(common({ ...config.webpack, DEV: true }), {
  devtool: config.webpack.devtool,
  entry: getEntry(config.webpack.entry),
  output: {
    filename: '[name].js',
    publicPath: getPublishPath(),
    libraryTarget: 'umd',
  },
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
});

const cssConfig = config.themes.map(name =>
  cssConf({
    mode: 'development',
    hot: true,
    name,
    entry: [
      `webpack-dev-server/client/index.js?hot=true&live-reload=true&hostname=127.0.0.1&port=${config.dev.webpackPort}`,
      'webpack/hot/only-dev-server',
      './site/index.js',
    ],
    output: { publicPath: getPublishPath() },
    clean: false,
    filename: '__css_hot_loader.js',
    prefix: '',
  })
);

module.exports = [jsConfig]
