import { formatChildren } from '../../core/utils';
import { deserializeHtml } from '../../../src/slate-convert/html-to-slate';


describe('deserialize link', () => {
  it('a to slate node', () => {
    const html = '<a href="https://dev.seafile.com/seahub" title="seafile">Seafile</a>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            href: 'https://dev.seafile.com/seahub',
            title: 'seafile',
            children: [
              {
                text: 'Seafile'
              }
            ]
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('a to slate node', () => {
    const html = '<a href="https://dev.seafile.com/seahub" title="seafile"></a>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            href: 'https://dev.seafile.com/seahub',
            title: 'seafile',
            children: [
              {
                text: 'seafile'
              }
            ]
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('a to slate node', () => {
    const html = '<a href="https://dev.seafile.com/seahub" title=""></a>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            href: 'https://dev.seafile.com/seahub',
            title: '',
            children: [
              {
                text: 'https://dev.seafile.com/seahub'
              }
            ]
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });
});
