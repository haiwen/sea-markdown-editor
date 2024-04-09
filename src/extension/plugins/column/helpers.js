import { Editor, Transforms } from 'slate';
import slugid from 'slugid';
import { BLOCKQUOTE, CHECK_LIST_ITEM, COLUMN, IMAGE, ORDERED_LIST, PARAGRAPH, TABLE_CELL, UNORDERED_LIST } from '../../constants/element-types';
import { focusEditor, getNodeType } from '../../core';
import Column from './model';

export const isMenuDisabled = (editor, readonly) => {
  if (readonly) return true;
  if (editor.selection == null) return true;

  const [nodeEntry] = Editor.nodes(editor, {
    match: n => {
      const type = getNodeType(n);

      // Only available for p and blockquote
      if (type === PARAGRAPH) return true;
      if (type === BLOCKQUOTE) return true;
      if (type === UNORDERED_LIST) return true;
      if (type === ORDERED_LIST) return true;
      if (type === CHECK_LIST_ITEM) return true;
      if (type === IMAGE) return true;
      if (type === TABLE_CELL) return true;

      return false;
    },
    universal: true,
    mode: 'highest', // Match top level
  });

  // Match to p blockquote, do not disable
  if (nodeEntry) {
    return false;
  }
  return true;
};

export const getColumnType = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => getNodeType(n) === COLUMN,
    universal: true,
  });

  if (!match) return PARAGRAPH;
  const [n] = match;

  return getNodeType(n);
};

export const insertSeaTableColumn = (editor, active) => {
  if (!active) {
    const column = new Column({});
    column.id = slugid.nice();
    Transforms.insertNodes(editor, { ...column });
  }
  focusEditor(editor);
};

export const setSeaTableColumn = (editor, data) => {
  Transforms.setNodes(editor, { data: data }, {
    match: node => node.type === COLUMN,
    at: editor.selection
  });
};

export const getColumnByKey = (columns, key) => {
  const column = columns.find(item => item.key === key);
  return column || null;
};
