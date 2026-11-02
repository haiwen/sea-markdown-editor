import mdStringToSlate from '../../src/slate-convert/md-to-slate';
import slateToMdString from '../../src/slate-convert/slate-to-md';
import deserializeHtml from '../../src/slate-convert/html-to-slate';
import { processor, processorWithMath } from '../../src/slate-convert/md-to-html';
import { formatChildren } from '../core/utils';

const paragraph = (children) => [{ type: 'paragraph', children }];
const roundTrip = (nodes) => formatChildren(mdStringToSlate(slateToMdString(nodes)));

describe('underline conversion', () => {
  it('preserves underline and the surrounding plain text', () => {
    const nodes = paragraph([
      { text: 'before ' },
      { text: 'underlined', underline: true },
      { text: ' after' },
    ]);

    expect(slateToMdString(nodes)).toBe('before <u>underlined</u> after\n');
    expect(roundTrip(nodes)).toEqual(nodes);
  });

  it.each([
    {},
    { bold: true },
    { italic: true },
    { bold: true, italic: true },
    { code: true },
    { code: true, bold: true, italic: true },
  ])('preserves underline combined with %o', (marks) => {
    const nodes = paragraph([{ text: 'sample', underline: true, ...marks }]);

    expect(roundTrip(nodes)).toEqual(nodes);
  });

  it('escapes literal HTML and Markdown in underlined text', () => {
    const nodes = paragraph([{ text: '<u>literal</u> & **plain** | \\', underline: true }]);

    expect(roundTrip(nodes)).toEqual(nodes);
  });

  it('preserves leading spaces, trailing spaces, and line breaks', () => {
    const nodes = paragraph([{ text: '  first\nsecond  ', underline: true }]);

    expect(roundTrip(nodes)).toEqual(nodes);
  });

  it('preserves mixed styles inside a link', () => {
    const nodes = paragraph([
      { text: '' },
      {
        type: 'link',
        url: 'https://example.com',
        title: null,
        children: [
          { text: 'plain ' },
          { text: 'bold', underline: true, bold: true },
          { text: 'code', underline: true, code: true },
          { text: ' after' },
        ],
      },
      { text: '' },
    ]);

    expect(roundTrip(nodes)).toEqual(nodes);
  });

  it('keeps adjacent underlined and bold runs separate', () => {
    const nodes = paragraph([
      { text: 'first', underline: true, bold: true },
      { text: 'second', underline: true, bold: true, italic: true },
      { text: 'third', bold: true },
    ]);

    expect(roundTrip(nodes)).toEqual(nodes);
  });

  it('handles nested underline tags without leaking the mark', () => {
    const nodes = mdStringToSlate('before <u>a <u>b</u> c</u> after');

    expect(formatChildren(nodes)).toEqual(paragraph([
      { text: 'before ' },
      { text: 'a ', underline: true },
      { text: 'b', underline: true },
      { text: ' c', underline: true },
      { text: ' after' },
    ]));
  });

  it('tracks underline across Markdown emphasis boundaries', () => {
    const nodes = mdStringToSlate('<u>**underlined</u> bold** plain');

    expect(formatChildren(nodes)).toEqual(paragraph([
      { text: 'underlined', underline: true, bold: true },
      { text: ' bold', bold: true },
      { text: ' plain' },
    ]));
  });

  it('does not interpret underline tags inside inline code', () => {
    expect(formatChildren(mdStringToSlate('`<u>literal</u>`'))).toEqual(paragraph([
      { text: '<u>literal</u>', code: true },
    ]));
  });

  it.each([
    '<u><strong>sample</strong></u>',
    '<strong><u>sample</u></strong>',
    '<span><strong><u>sample</u></strong></span>',
    '<span style="text-decoration: underline"><strong>sample</strong></span>',
  ])('preserves underline and nested formatting when pasting %s', (html) => {
    expect(formatChildren(deserializeHtml(html))).toEqual(paragraph([
      { text: 'sample', underline: true, bold: true },
    ]));
  });

  it.each([processor, processorWithMath])('renders underline in Markdown previews', async (previewProcessor) => {
    const nodes = paragraph([{ text: 'sample', underline: true, bold: true }]);
    const html = String(await previewProcessor.process(slateToMdString(nodes)));

    expect(html).toContain('<u><strong>sample</strong></u>');
  });
});
