import { Node } from 'slate';
import mdStringToSlate from '../../src/slate-convert/md-to-slate';
import slateToMdString from '../../src/slate-convert/slate-to-md';
import { processor, processorWithMath } from '../../src/slate-convert/md-to-html';

const table = children => [{
  type: 'table',
  align: [null],
  children: [{ type: 'table_row', children: [{ type: 'table_cell', children }] }],
}];

const getCell = nodes => nodes[0].children[0].children[0];

describe('table cell line breaks', () => {
  it.each(['first\nsecond', '\nfirst', 'first\n', 'first\n\nsecond', '\n\n'])('preserves %j through saving and reopening', (text) => {
    const markdown = slateToMdString(table([{ text }]));
    const reopened = mdStringToSlate(markdown);

    expect(markdown).toContain('<br>');
    expect(reopened).toHaveLength(1);
    expect(reopened[0].children).toHaveLength(1);
    expect(Node.string(getCell(reopened))).toBe(text);
  });

  it.each([{ bold: true }, { italic: true }, { underline: true }, { code: true }, { bold: true, italic: true, underline: true }])('preserves multiline text formatted with %o', (marks) => {
    const text = '\nfirst\nsecond\n';
    const reopened = mdStringToSlate(slateToMdString(table([{ text, ...marks }])));
    const cell = getCell(reopened);

    expect(Node.string(cell)).toBe(text);
    for (const child of cell.children.filter(child => child.text.trim())) {
      expect(child).toMatchObject(marks);
    }
  });

  it('preserves line breaks and formatting in link labels', () => {
    const nodes = table([
      { text: '' },
      {
        type: 'link',
        url: 'https://example.com',
        title: null,
        children: [{ text: 'first\nsecond', bold: true }],
      },
      { text: '' },
    ]);
    const reopened = mdStringToSlate(slateToMdString(nodes));
    const link = getCell(reopened).children.find(child => child.type === 'link');

    expect(link.url).toBe('https://example.com');
    expect(Node.string(link)).toBe('first\nsecond');
    expect(link.children.filter(child => child.text.trim()).every(child => child.bold)).toBe(true);
  });

  it.each(['<br>', '<br/>', '<br />', '<BR>'])('opens existing table breaks written as %s', (tag) => {
    const reopened = mdStringToSlate(`| first${tag}second |\n| --- |`);

    expect(Node.string(getCell(reopened))).toBe('first\nsecond');
  });

  it('keeps literal HTML and code text as text', () => {
    const nodes = table([{ text: '<br>\n**literal** | <img src=x>' }]);
    const reopened = mdStringToSlate(slateToMdString(nodes));

    expect(Node.string(getCell(reopened))).toBe('<br>\n**literal** | <img src=x>');
  });

  it.each([processor, processorWithMath])('renders saved table line breaks in previews', async (previewProcessor) => {
    const markdown = slateToMdString(table([{ text: 'first\n\nsecond' }]));
    const html = String(await previewProcessor.process(markdown));
    const container = document.createElement('div');
    container.innerHTML = html;

    expect(container.querySelectorAll('tr')).toHaveLength(1);
    expect(container.querySelectorAll('th br')).toHaveLength(2);
    expect(container.querySelector('th').textContent).toBe('firstsecond');
  });
});
