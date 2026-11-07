import { formatChildren } from '../../core/utils';
import { deserializeHtml } from '../../../src/slate-convert';


describe('deserialize text', () => {
  it.each([
    ['span', {}],
    ['strong', { bold: true }],
    ['b', { bold: true }],
    ['em', { italic: true }],
    ['i', { italic: true }],
    ['u', { underline: true }],
    ['code', { code: true }],
    ['del', { delete: true }],
    ['ins', { add: true }],
  ])('preserves a newline separating words inside %s', (tag, marks) => {
    const html = `<${tag}><span>hello</span>\n<span>world</span></${tag}>`;

    expect(formatChildren(deserializeHtml(html))).toEqual([
      { type: 'paragraph', children: [{ text: 'hello\nworld', ...marks }] },
    ]);
  });

  it('preserves a newline between differently formatted words', () => {
    const html = '<u><strong>hello</strong>\n<em>world</em></u>';

    expect(formatChildren(deserializeHtml(html))).toEqual([
      {
        type: 'paragraph',
        children: [
          { text: 'hello', bold: true, underline: true },
          { text: '\n', underline: true },
          { text: 'world', italic: true, underline: true },
        ],
      },
    ]);
  });

  it('still discards formatting newlines between blocks', () => {
    const html = '<div><p>hello</p>\n<p>world</p></div>';

    expect(formatChildren(deserializeHtml(html))).toEqual([
      { type: 'paragraph', children: [{ text: 'hello' }] },
      { type: 'paragraph', children: [{ text: 'world' }] },
    ]);
  });

  it('span to slate node', () => {
    const html = '<span>Hello, seafile sdoc editor</span>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('i to slate node', () => {
    const html = '<i>Hello, seafile sdoc editor</i>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            italic: true,
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('b to slate node', () => {
    const html = '<b>Hello, seafile sdoc editor</b>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('strong to slate node', () => {
    const html = '<strong>Hello, seafile sdoc editor</strong>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('del to slate node', () => {
    const html = '<del>Hello, seafile sdoc editor</del>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            delete: true,
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('ins to slate node', () => {
    const html = '<ins>Hello, seafile sdoc editor</ins>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            add: true,
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('code to slate node', () => {
    const html = '<code>Hello, seafile sdoc editor</code>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            code: true,
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

});
