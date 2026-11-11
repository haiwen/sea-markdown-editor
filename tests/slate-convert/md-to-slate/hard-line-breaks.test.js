import mdStringToSlate from '../../../src/slate-convert/md-to-slate';
import { formatChildren } from '../../core';

const paragraph = (children) => [{ type: 'paragraph', children }];

describe('Markdown hard line breaks', () => {
  it.each([
    ['two trailing spaces', 'first  \nsecond'],
    ['backslash', 'first\\\nsecond'],
    ['CRLF', 'first  \r\nsecond'],
    ['HTML break', 'first<br>second'],
    ['self-closing HTML break', 'first<br/>second'],
    ['uppercase HTML break', 'first<BR />second'],
  ])('preserves %s as newline text', (name, markdown) => {
    expect(formatChildren(mdStringToSlate(markdown))).toEqual(paragraph([
      { text: 'first' },
      { text: '\n' },
      { text: 'second' },
    ]));
  });

  describe.each([
    ['Markdown hard break', '  \n'],
    ['HTML break', '<br/>'],
  ])('%s', (name, separator) => {
    it('keeps a bold label separate from its italic description', () => {
      const markdown = `**Back up motion photos**${separator}*Keep the original photo and its short video.*`;

      expect(formatChildren(mdStringToSlate(markdown))).toEqual(paragraph([
        { text: 'Back up motion photos', bold: true },
        { text: '\n' },
        { text: 'Keep the original photo and its short video.', italic: true },
      ]));
    });

    describe.each([
      ['bold', '**', '**', { bold: true }],
      ['italic', '*', '*', { italic: true }],
      ['bold and italic', '***', '***', { bold: true, italic: true }],
      ['underline', '<u>', '</u>', { underline: true }],
    ])('%s text', (style, opening, closing, marks) => {
      it('preserves the marks on the newline without leaking them', () => {
        const markdown = `${opening}first${separator}second${closing} plain`;

        expect(formatChildren(mdStringToSlate(markdown))).toEqual(paragraph([
          { text: 'first', ...marks },
          { text: '\n', ...marks },
          { text: 'second', ...marks },
          { text: ' plain' },
        ]));
      });

      it('preserves the newline, marks and destination inside a link', () => {
        const markdown = `[${opening}first${separator}second${closing}](https://example.com)`;

        expect(formatChildren(mdStringToSlate(markdown))).toEqual(paragraph([
          { text: '' },
          {
            type: 'link',
            url: 'https://example.com',
            title: null,
            children: [
              { text: 'first', ...marks },
              { text: '\n', ...marks },
              { text: 'second', ...marks },
            ],
          },
          { text: '' },
        ]));
      });
    });
  });

  it('preserves soft breaks as text', () => {
    expect(formatChildren(mdStringToSlate('first\nsecond'))).toEqual(paragraph([
      { text: 'first\nsecond' },
    ]));
  });

  it('keeps HTML break syntax literal inside inline code', () => {
    expect(formatChildren(mdStringToSlate('`first<br>second`'))).toEqual(paragraph([
      { text: 'first<br>second', code: true },
    ]));
  });

  it('keeps escaped HTML break syntax literal', () => {
    expect(formatChildren(mdStringToSlate('first\\<br>second'))).toEqual(paragraph([
      { text: 'first<br>second' },
    ]));
  });
});
