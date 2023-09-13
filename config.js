const path = require('path');
const fs = require('fs');

const versions = {};
['react', 'react-dom', 'prop-types'].forEach(lib => {
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'node_modules/', lib, 'package.json')))
  versions[lib] = pkg.version
})

module.exports = {
  appName: '@seafile/seafile-editor',
  dev: {
    publishPort: 4000,
    webpackPort: 4001,
    scriptPath: '/*.*',
    scripts: [
      `/react@${versions['react']}/umd/react.production.min.js`,
      `/react-dom@${versions['react-dom']}/umd/react-dom.production.min.js`,
      `/prop-types@${versions['prop-types']}/prop-types.min.js`,
    ],
    styles: [
      // '/prism/1.15.0/themes/prism.min.css',
      'public/media/seafile-ui.css',
      'public/media/seafile-editor-font.css'
    ],
  },
  themes: ['default'],
  webpack: {
    entry: {
      app: './site/index.js',
    },
    output: {
      chunkFileName: '[name].[chunkhash].js',
      filename: '[name].js'
    },
    alias: {
      '@seafile/seafile-editor': path.resolve(__dirname, 'src')
    },
    devtool: 'cheap-module-source-map',
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
      'prop-types': {
        root: 'PropTypes',
        commonjs2: 'prop-types',
        commonjs: 'prop-types',
        amd: 'prop-types',
      },
    },
  }
}