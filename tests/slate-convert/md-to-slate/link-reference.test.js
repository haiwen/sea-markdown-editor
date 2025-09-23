import mdStringToSlate from '../../../src/slate-convert/md-to-slate';
import { ELementTypes } from '../../../src/extension/constants';
import { formatChildren } from '../../core';

describe('link reference test', () => {
  it('The link reference index exceeds the definition\'s index.', () => {
    const mdString = 'link reference test[你好文档1][1]  \n\n  \n\n [你好文档2][10] \n\n[1]: https://manual.seafile.com/12.0/upgrade/upgrade_a_cluster_binary/ "Upgrade a Seafile cluster (binary)"\n\n[2]: https://manual.seafile.com/12.0/setup_binary/https_with_nginx/ "Enabling HTTPS with Nginx"';
    const nodes = mdStringToSlate(mdString);
    const expectResult = [
      {
        type: ELementTypes.PARAGRAPH,
        children: [
          { text: 'link reference test' },
          {
            identifier: '1',
            label: '你好文档1',
            referenceType: 'full',
            type: 'link-reference',
            children: [{ text: '' }]
          }
        ]
      }, {
        type: ELementTypes.PARAGRAPH,
        children: [{ text: '[你好文档2][10]' }]
      }, {
        identifier: '1',
        title: 'Upgrade a Seafile cluster (binary)',
        type: ELementTypes.DEFINITION,
        url: 'https://manual.seafile.com/12.0/upgrade/upgrade_a_cluster_binary/',
        children: [{ text: 'Upgrade a Seafile cluster (binary)' }]
      }, {
        identifier: '2',
        title: 'Enabling HTTPS with Nginx',
        type: ELementTypes.DEFINITION,
        url: 'https://manual.seafile.com/12.0/setup_binary/https_with_nginx/',
        children: [{ text: 'Enabling HTTPS with Nginx' }]
      }
    ];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });

  it('The link reference index is within the definition\'s index range.', () => {
    const mdString = 'link reference test[你好文档1][1]  \n\n  \n\n [你好文档2][2] \n\n[1]: https://manual.seafile.com/12.0/upgrade/upgrade_a_cluster_binary/ "Upgrade a Seafile cluster (binary)"\n\n[2]: https://manual.seafile.com/12.0/setup_binary/https_with_nginx/ "Enabling HTTPS with Nginx"';
    const nodes = mdStringToSlate(mdString);
    const expectResult = [
      {
        type: ELementTypes.PARAGRAPH,
        children: [
          { text: 'link reference test' },
          {
            identifier: '1',
            label: '你好文档1',
            referenceType: 'full',
            type: 'link-reference',
            children: [{ text: '' }]
          }
        ]
      }, {
        type: ELementTypes.PARAGRAPH,
        children: [
          {
            identifier: '2',
            label: '你好文档2',
            referenceType: 'full',
            type: 'link-reference',
            children: [{ text: '' }]
          }
        ]
      }, {
        identifier: '1',
        title: 'Upgrade a Seafile cluster (binary)',
        type: ELementTypes.DEFINITION,
        url: 'https://manual.seafile.com/12.0/upgrade/upgrade_a_cluster_binary/',
        children: [{ text: 'Upgrade a Seafile cluster (binary)' }]
      }, {
        identifier: '2',
        title: 'Enabling HTTPS with Nginx',
        type: ELementTypes.DEFINITION,
        url: 'https://manual.seafile.com/12.0/setup_binary/https_with_nginx/',
        children: [{ text: 'Enabling HTTPS with Nginx' }]
      }
    ];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });
});
