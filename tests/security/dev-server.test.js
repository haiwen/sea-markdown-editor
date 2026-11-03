/** @jest-environment node */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { IncomingMessage, ServerResponse } = require('http');
const { Socket } = require('net');
const Koa = require('koa');
const Router = require('koa-router');

const axios = jest.fn();
const listen = jest.fn();
const router = new Router();
const repoRoot = path.resolve(__dirname, '../..');
let app;

const modules = {
  axios,
  koa: class extends Koa {
    constructor() {
      super();
      app = this;
    }

    listen(...args) {
      listen(...args);
    }
  },
  'koa-router': function() {
    return router;
  },
  webpack: jest.fn(),
  'webpack-dev-server': class {
    startCallback() {}
  },
  './package.json': { version: 'test' },
  './config': {
    dev: { webpackPort: 4001, publishPort: 4000, scriptPath: '/*.*' },
    webpack: { entry: { app: './site/index.js' } }
  },
  './config/config.dev': {},
  './scripts/ejs': { renderFile: jest.fn() }
};

vm.runInNewContext(fs.readFileSync(path.join(repoRoot, 'dev-server.js'), 'utf8'), {
  require: (name) => Object.prototype.hasOwnProperty.call(modules, name) ? modules[name] : require(name),
  __dirname: repoRoot,
  process: { on: jest.fn(), exit: jest.fn() },
  console: { log: jest.fn() }
});

function createContext(url) {
  const request = new IncomingMessage(new Socket());
  request.method = 'GET';
  request.url = url;
  return app.createContext(request, new ServerResponse(request));
}

beforeEach(() => {
  axios.mockReset();
  axios.mockResolvedValue({ data: 'webpack asset' });
});

it('only listens on the loopback interface', () => {
  expect(listen).toHaveBeenCalledWith('4000', '127.0.0.1', expect.any(Function));
});

it.each([
  '/app.js',
  '/chunk-id_1.js',
  '/main.abc.hot-update.js',
  '/main.abc.hot-update.json',
  '/app.js.map',
  '/styles.css',
  '/app.js?cache=123&next=https://evil.invalid/'
])('proxies a valid asset to the fixed webpack server: %s', async (url) => {
  const ctx = createContext(url);
  await router.routes()(ctx, jest.fn());

  expect(axios).toHaveBeenCalledTimes(1);
  const options = axios.mock.calls[0][0];
  expect(options.url).toBe('http://127.0.0.1:4001' + url.split('?')[0]);
  expect(options.maxRedirects).toBe(0);
  expect(options.proxy).toBe(false);
  expect(ctx.body).toBe('webpack asset');
});

describe.each(['/*.*', '/*.hot-update.json?'])('%s proxy handler', (route) => {
  const handler = router.stack.find(layer => layer.path === route).stack[0];

  it.each([
    '//evil.invalid/app.js',
    '/nested/app.js',
    '/../app.js',
    '/nested/../app.js',
    '/%2e%2e%2fapp.js',
    '/%252e%252e%252fapp.js',
    '/%5cevil.invalid/app.js',
    '/app.js%3fredirect=evil',
    '/app.txt'
  ])('rejects unsafe asset paths before making a request: %s', async (url) => {
    await expect(handler(createContext(url), jest.fn())).rejects.toMatchObject({ status: 400 });
    expect(axios).not.toHaveBeenCalled();
  });

  it('returns hot-update JSON from the webpack server', async () => {
    const data = { c: ['app'], r: [], m: [] };
    axios.mockResolvedValue({ data });
    const ctx = createContext('/main.abc.hot-update.json?cache=123');

    await handler(ctx, jest.fn());

    expect(axios.mock.calls[0][0].url).toBe('http://127.0.0.1:4001/main.abc.hot-update.json');
    expect(ctx.body).toBe(data);
  });
});

it.each(['/seafile-editor.js', '/seafile-viewer.js', '/wiki-viewer.js', '/example.Form', '/example.List'])(
  'preserves the page route exclusion: %s', async (url) => {
    const handler = router.stack.find(layer => layer.path === '/*.*').stack[0];
    const next = jest.fn();
    await handler(createContext(url), next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(axios).not.toHaveBeenCalled();
  }
);
