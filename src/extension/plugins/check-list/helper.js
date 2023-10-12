
import { Editor, Element } from 'slate';
import { CHECK_LIST_ITEM } from '../../constants/element-types';

export const isDisabledMenu = (editor, isReadonly) => {
  if (isReadonly) return true;
  const { selection } = editor;
  if (!selection) return true;
  return false;
};

export const getCheckListEntryList = (editor) => {
  const checkListEntries = Editor.nodes(editor, {
    match: node => Element.isElement(node) && node.type === CHECK_LIST_ITEM,
    universal: true,
  });
  const checkListEntryList = Array.from(checkListEntries);
  return checkListEntryList;
};

export const transformToCheckList = (editor) => {
  if (!editor.selection) return;
  // TransformStream
  console.log('tranform');
};
