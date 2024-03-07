import { Editor, Transforms } from 'slate';
import { CHECK_LIST_ITEM, CODE_BLOCK, CODE_LINE, LIST_ITEM, TABLE, TABLE_CELL, TABLE_ROW } from '../../constants/element-types';
import { focusEditor, getSelectedElems } from '../../core';

export const isMenuDisabled = (editor, isReadonly) => {
  if (isReadonly || !editor.selection) return true;
  const disabledElementTypes = [
    CODE_LINE,
    CODE_BLOCK,
    TABLE,
    TABLE_ROW,
    TABLE_CELL
  ];
  const isSelectedDisableElement = !!getSelectedElems(editor).find(elem => disabledElementTypes.includes(elem.type));
  if (isSelectedDisableElement) return true;
  return false;
};

export const getCheckListEntryList = (editor) => {
  const checkListEntries = Editor.nodes(editor,
    {
      match: node => node.type === CHECK_LIST_ITEM,
      universal: true
    });
  const checkListEntryList = Array.from(checkListEntries);
  return checkListEntryList;
};

export const transformToCheckList = (editor) => {
  if (!editor.selection) return;
  const isInList = getSelectedElems(editor).some(elem => elem.type === LIST_ITEM);
  isInList && Transforms.unwrapNodes(editor);
  Transforms.setNodes(editor, { type: CHECK_LIST_ITEM });
  focusEditor(editor);
};
