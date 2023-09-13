const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')

module.exports = function getCommon(config) {
  const lessLoader = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
    },
    {
      loader: 'postcss-loader',
    },
    {
      loader: 'less-loader',
      options: {
        modifyVars: {
          'so-prefix': process.env.SO_PREFIX || 'so',
          ...config.modifyVars,
        },
      },
    },
  ]
  const jsLoaders = [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  ]
  const plugins = [
    new MiniCssExtractPlugin({
      filename: `${config.extractTextPluginPath}`,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        SO_PREFIX: JSON.stringify(process.env.SO_PREFIX || ''),
        CSS_MODULE: !!process.env.LOCAL_IDENT_NAME,
        LOG_ENV: JSON.stringify(process.env.LOG_ENV || ''),
      },
    }),
  ]
  if (config.IGNORE_LESS) {
    jsLoaders.splice(0, 0, { loader: 'remove-less-loader' })
    plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.less$/,
      })
    )
  }
  return {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin({}),
      ],
    },
    externals: config.externals,
    resolve: {
      alias: config.alias,
      extensions: ['.js', '.json', '.jsx'],
    },
    resolveLoader: {
      modules: ['node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: [/node_modules/],
          use: jsLoaders,
        },

        {
          test: /\.less$/,
          use: config.DEV ? 'ignore-loader' : lessLoader,
        },

        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },

        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: './images/[name].[ext]',
              },
            },
          ],
        },

        {
          test: /\.(ttf|eot|woff|woff2|otf|svg)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: './font/[name].[ext]',
              },
            },
          ],
        },

        {
          test: /\.md$/,
          use: 'raw-loader',
        },
      ],
    },

    plugins,
  }
}
