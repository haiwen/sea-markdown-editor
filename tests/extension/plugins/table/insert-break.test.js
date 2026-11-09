import { createEditor, Editor, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { baseEditor } from '../../../../src/extension/editor';
import withTable from '../../../../src/extension/plugins/table/plugin';
import { insertRow } from '../../../../src/extension/plugins/table/table-operations';

const createTableEditor = () => {
  const editor = baseEditor();
  editor.children = [
    { type: 'paragraph', children: [{ text: 'before' }] },
    {
      type: 'table',
      align: [null, null],
      children: ['first', 'last'].map(text => ({
        type: 'table_row',
        children: [
          { type: 'table_cell', children: [{ text }] },
          { type: 'table_cell', children: [{ text: 'other' }] },
        ],
      })),
    },
    { type: 'paragraph', children: [{ text: 'after' }] },
  ];
  return editor;
};

describe('Enter inside a table cell', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([0, 2, 5])('inserts a newline at offset %s without adding a row or cell', (offset) => {
    const editor = createTableEditor();
    Transforms.select(editor, { path: [1, 0, 0, 0], offset });

    editor.insertBreak();

    expect(editor.children[1].children).toHaveLength(2);
    expect(editor.children[1].children[0].children).toHaveLength(2);
    expect(Node.string(editor.children[1].children[0].children[0])).toBe('first'.slice(0, offset) + '\n' + 'first'.slice(offset));
    expect(editor.selection.anchor).toEqual({ path: [1, 0, 0, 0], offset: offset + 1 });
    expect(editor.selection.focus).toEqual(editor.selection.anchor);
  });

  it('keeps repeated line breaks in the last cell of the table', () => {
    const editor = createTableEditor();
    Transforms.select(editor, Editor.end(editor, [1, 1, 1]));

    editor.insertBreak();
    editor.insertBreak();

    expect(Node.string(editor.children[1].children[1].children[1])).toBe('other\n\n');
    expect(editor.children[1].children).toHaveLength(2);
    expect(editor.selection.anchor.path).toEqual([1, 1, 1, 0]);
  });

  it('replaces selected text inside the same cell with a newline', () => {
    const editor = createTableEditor();
    Transforms.select(editor, {
      anchor: { path: [1, 0, 0, 0], offset: 1 },
      focus: { path: [1, 0, 0, 0], offset: 4 },
    });

    editor.insertBreak();

    expect(Node.string(editor.children[1].children[0].children[0])).toBe('f\nt');
    expect(editor.children[1].children).toHaveLength(2);
  });

  it('preserves active text formatting for the line break and subsequent text', () => {
    const editor = createTableEditor();
    Transforms.select(editor, Editor.end(editor, [1, 0, 0]));
    Editor.addMark(editor, 'bold', true);

    editor.insertBreak();
    editor.insertText('next');

    const cell = editor.children[1].children[0].children[0];
    expect(Node.string(cell)).toBe('first\nnext');
    expect(cell.children.some(child => child.bold && child.text.includes('\nnext'))).toBe(true);
  });

  it('does not merge cells when the selection spans multiple cells', () => {
    const editor = createTableEditor();
    Transforms.select(editor, {
      anchor: { path: [1, 0, 0, 0], offset: 1 },
      focus: { path: [1, 0, 1, 0], offset: 2 },
    });
    const originalTable = JSON.stringify(editor.children[1]);

    editor.insertBreak();

    expect(JSON.stringify(editor.children[1])).toBe(originalTable);
  });

  it('still splits paragraphs outside tables', () => {
    const editor = createTableEditor();
    Transforms.select(editor, { path: [0, 0], offset: 2 });

    editor.insertBreak();

    expect(editor.children.slice(0, 2).map(Node.string)).toEqual(['be', 'fore']);
    expect(editor.children[2].type).toBe('table');
  });

  it.each(['shiftKey', 'ctrlKey'])('preserves the %s+Enter shortcut for leaving the table', (modifier) => {
    const editor = createTableEditor();
    Transforms.select(editor, { path: [1, 0, 0, 0], offset: 1 });
    const event = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, which: 13, [modifier]: true, cancelable: true });

    expect(editor.onHotKeyDown(event)).toBe(true);

    expect(event.defaultPrevented).toBe(true);
    expect(editor.selection.anchor.path).toEqual([2, 0]);
    expect(editor.children[1].children).toHaveLength(2);
  });

  it('keeps row insertion available through table operations', () => {
    const editor = createTableEditor();
    Transforms.select(editor, { path: [1, 0, 0, 0], offset: 1 });

    insertRow(editor);

    expect(editor.children[1].children).toHaveLength(3);
    expect(editor.children[1].children[1].children).toHaveLength(2);
  });

  it.each([
    { path: [1, 0, 0, 0], shiftKey: false, expected: [1, 0, 1, 0], rows: 2 },
    { path: [1, 0, 1, 0], shiftKey: true, expected: [1, 0, 0, 0], rows: 2 },
    { path: [1, 1, 1, 0], shiftKey: false, expected: [1, 2, 0, 0], rows: 3 },
  ])('preserves Tab navigation for $path, shift=$shiftKey', ({ path, shiftKey, expected, rows }) => {
    jest.spyOn(ReactEditor, 'focus').mockImplementation(() => {});
    const editor = createTableEditor();
    Transforms.select(editor, { path, offset: 0 });
    const event = new KeyboardEvent('keydown', { key: 'Tab', which: 9, shiftKey, cancelable: true });

    expect(editor.onHotKeyDown(event)).toBe(true);

    expect(editor.selection.anchor.path).toEqual(expected);
    expect(editor.children[1].children).toHaveLength(rows);
  });

  it('delegates to the original insertBreak without a selection', () => {
    const editor = createEditor();
    const insertBreak = jest.fn();
    editor.insertBreak = insertBreak;
    withTable(editor);

    editor.insertBreak();

    expect(insertBreak).toHaveBeenCalledTimes(1);
  });
});
