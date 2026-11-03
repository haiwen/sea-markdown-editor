/** @jest-environment node */

import editorApi from '../../site/api';

jest.mock('seafile-js', () => ({
  SeafileAPI: jest.fn().mockImplementation(() => ({ init: jest.fn() }))
}));

jest.mock('../../site/setting', () => ({
  serverConfig: { serviceUrl: 'https://dev.seafile.com/seahub' }
}));

const serviceUrl = 'https://dev.seafile.com/seahub';
const repoID = '12345678-1234-1234-1234-123456789abc';

beforeEach(() => {
  editorApi.serviceUrl = serviceUrl;
});

describe.each([
  ['isInternalFileLink', `/lib/${repoID}/file/a.md`],
  ['isInternalFileLink', `/lib/${repoID}/file%2Fa.md?raw=1`],
  ['isInternalDirLink', `/#common/lib/${repoID}/folder`],
  ['isInternalDirLink', `/#common/lib/${repoID}%2Ffolder`],
  ['isInternalDirLink', `/#/lib/${repoID}/folder`]
])('%s: %s', (method, suffix) => {
  it('accepts the configured server and deployment prefix', () => {
    expect(editorApi[method](serviceUrl + suffix)).toBe(true);
  });

  it.each([
    'https://devXseafileYcom/seahub',
    'https://dev.seafile.com.evil.invalid/seahub',
    'https://dev.seafile.com/other',
    'http://dev.seafile.com/seahub',
    `https://evil.invalid/?next=${serviceUrl}`
  ])('rejects an external or embedded URL: %s', (prefix) => {
    expect(editorApi[method](prefix + suffix)).toBe(false);
  });

  it('matches regex metacharacters in a deployment prefix literally', () => {
    editorApi.serviceUrl = 'https://example.com:8443/team+docs';
    expect(editorApi[method](editorApi.serviceUrl + suffix)).toBe(true);
    expect(editorApi[method]('https://example.com:8443/teamdocs' + suffix)).toBe(false);
  });
});
