const axios = require('axios')
const path = require('path');
const Koa = require('koa')
const send = require('koa-send')
const Router = require('koa-router')
const cors = require('koa2-cors');
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { version } = require('./package.json')
const config = require('./config')
const webpackConfig = require('./config/config.dev')
const ejs = require('./scripts/ejs')

// error handle
process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', (err, origin) => {
  console.log(err);
  throw err;
});

['SIGINT', 'SIGTERM'].forEach(function(sig) {
  process.on(sig, function() {
    process.exit();
  });
});

// webpack server ===========================================

const serverConfig = {
  hot: true,
  client: false,
  host: '127.0.0.1',
  static: {
    directory: path.join(__dirname, 'public'),
  },
  port: config.dev.webpackPort,
  // noInfo: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const webpackServer = new WebpackDevServer(serverConfig, webpack(webpackConfig));

webpackServer.startCallback(() => {
  console.log(`webpack server is running on http://127.0.0.1:${config.dev.webpackPort}`)
});


// dev server ================================================
const app = new Koa()
const router = new Router()

// use devlopment version React
router.get('**/react.production.min.js', async ctx => {
  await send(ctx, 'node_modules/react/umd/react.development.js')
})

router.get('**/react-dom.production.min.js', async ctx => {
  await send(ctx, 'node_modules/react-dom/umd/react-dom.development.js')
})

router.get('**/prop-types.min.js', async ctx => {
  await send(ctx, 'node_modules/prop-types/prop-types.js')
})

router.get('/public/**', async ctx => {
  await send(ctx, `${ctx.path}`);
})

router.get('/images/**', async ctx => {
  await send(ctx, `site/${ctx.path}`)
})

// dev code proxy: webpack packaged file
router.get(config.dev.scriptPath, async (ctx, next) => {
  // console.log(ctx.url)
  let url = ctx.url.split('/')
  url = url[url.length - 1]
  if (
    url.indexOf('simple-editor') > -1 ||
    url.indexOf('markdown-viewer') > -1 ||
    url.indexOf('seafile-markdown-editor') > -1
  ) {
    await next()
  } else if (url.endsWith('.Form') || url.endsWith('.List')) {
    await next()
  } else {
    const options = {
      url: `http://127.0.0.1:${config.dev.webpackPort}/${url}`,
      method: 'GET',
    }
    const result = await axios(options);
    ctx.body = result.data;
  }
})

// react-hot-loader proxy
router.get('/*.hot-update.json?', async ctx => {
  const options = {
    url: `http://127.0.0.1:${config.dev.webpackPort}/${ctx.url}`,
    method: 'GET',
  }
  ctx.set('Access-Control-Allow-Origin', '*')
  const result = await axios(options);
  ctx.body = result.data;
})

router.get('/*', async ctx => {
  // if (ctx.url === '/') ctx.redirect('/index')

  const prepath = config.dev.scriptPath.replace('**', version)

  const scripts = [
    ...(config.dev.scripts || []),
    ...Object.keys(config.webpack.entry).map(s => prepath.replace('*.*', `${s}.js`)),
    // '__css_hot_loader.js',
  ]

  const styles = config.dev.styles || []
  ctx.type = 'text/html; charest=utf-8'
  ctx.body = await ejs.renderFile(`./site/index.html`, {
    scripts,
    env: 'development',
    appName: config.appName,
    styles,
    description: '',
    icoUrl: 'public/favicon.ico',
  })
})

// if (config.proxy) config.proxy(router)

app.use(cors())
app.use(router.routes())

app.listen(`${config.dev.publishPort}`, () => {
  const ps = config.dev.publishPort === 80 ? '' : `:${config.dev.publishPort}`
  console.log(`server running on http://127.0.0.1${ps}/`)
})

