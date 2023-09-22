/** (1/4) initialize config object */
let config = {
  serviceUrl: 'https://dev.seafile.com/seahub',
  username: '**',
  password: '***',
  name: '***',
  contact_email: '**',
  lib_name: '个人资料',
  repoID: '2a77b4e3-0040-4c77-86e2-306cc8f53264',
  // seafileCollabServer: 'http://127.0.0.1:4000',
  dirPath: '/',
  filePath: '/aaa.md',
  fileName: 'aaa.md',
};

/** (2/4) load local development settings ./setting.local.js (if exist) */
try {
  config.local = require('./setting.local.js').default || {};
  config = {...config, ...{loadVerbose: true}, ...config.local};
  config.loadVerbose && console.log('[SeaTable Plugin Development] Configuration merged with "./src/setting.local.js" (this message can be disabled by adding `loadVerbose: false` to the local development settings)');
  delete config.local;
  delete config.loadVerbose;
} catch (error) {
  // fall-through by intention
  console.error('[SeaTable Plugin Development] Please create "./src/setting.local.js" (from `setting.local.dist.js`)');
  throw error;
}

/** (3/4) remove server trailing slash(es) (if any, common configuration error)*/
if (config.serviceUrl !== config.serviceUrl.replace(/\/+$/, '')) {
  console.log(`[SeaTable Plugin Development] Server "${config.server}" trailing slash(es) removed (this message will go away by correcting the \`server: ...\` entry in the local development settings)`);
  config.serviceUrl = config.serviceUrl.replace(/\/+$/, '');
}

/* (4/4) init window.dtablePluginConfig  */
export { config as serverConfig };
