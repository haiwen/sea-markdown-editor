import isHotkey from 'is-hotkey';
import { getActiveListType } from '../helpers';
import { handleTab } from './on-tab-handle';
import { insertBreakList } from './insert-break-list';
import { insertFragmentList } from './insert-fragment-list';
import { normalizeList } from './normalize-list';
import { LIST_TYPES } from '../constant';
import { handleShortcut } from './shortcut';
import { getListItemEntry, isListNested } from '../queries';
import { isFirstNode, isSelectionAtBlockStart } from '../../../core';
import { unwrapList } from '../transforms';
import { LIST_ITEM } from '../../../constants/element-types';

const withList = (editor) => {
  const { insertBreak, onHotKeyDown, deleteBackward, insertText } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    if (insertBreakList(editor)) return;
    insertBreak();
    return;
  };

  newEditor.deleteBackward = (unit) => {
    const { selection } = newEditor;
    if (selection === null) {
      deleteBackward(unit);
      return;
    }
    const res = getListItemEntry(editor, {});
    if (res && isSelectionAtBlockStart(editor, { match: (node) => node.type === LIST_ITEM })) {
      const { list, listItem } = res;
      if (isFirstNode(list[0], listItem[0]) && !isListNested(editor, list[1])) {
        unwrapList(editor);
      }
    }
    // nothing todo
    deleteBackward(unit);
  };

  newEditor.insertText = (text) => {
    const isPreventInsert = handleShortcut(newEditor, text);
    if (isPreventInsert) return;
    return insertText(text);
  };

  newEditor.onHotKeyDown = (event) => {
    const activeListType = getActiveListType(editor);
    const isListActive = LIST_TYPES.includes(activeListType);
    if (isListActive) {
      if (isHotkey(['tab', 'shift+tab'], event)) {
        if (handleTab(newEditor, event)) return true;
      }
    }

    return onHotKeyDown && onHotKeyDown(event);
  };

  newEditor.insertFragment = insertFragmentList(newEditor);

  newEditor.normalizeNode = normalizeList(newEditor);

  return newEditor;
};

export default withList;
