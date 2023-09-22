const config = {
  serviceUrl: 'http://127.0.0.1', // required
  name: '**', // required, current user's name
  username: '**', // required
  password: '**', // required
  avatarURL: '**', // required, current user's avatar_url
  contact_email: '**',
  lib_name: '**',
  repoID: '8c911722-6a67-420d-a52d-aa6e8dcd6279', // required
  dirPath: '/', // required
  docPath: '/aaa.sdoc',  // required
  docName: 'aaa.sdoc', // required
  docUuid: '66d73184-4a41-4ee9-9e12-3a64c3527fbb', // required
  sdocServer: 'http://127.0.0.1:7070', // required
  accessToken: '',
  isDevelopment: true,
  isOpenSocket: false,  // required
  lang: 'en', // optional
  assetsUrl: '/api/v2.1/seadoc/download-image/bf93b0a6-2d02-431a-9de5-9ec7a6f357c9', // required
  isShowInternalLink: false, // required
}

export default config;
