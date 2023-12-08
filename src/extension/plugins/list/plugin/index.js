import isHotkey from 'is-hotkey';
import { getActiveListType } from '../helpers';
import { handleTab } from './on-tab-handle';
import { insertBreakList } from './insert-break-list';
import { insertFragmentList } from './insert-fragment-list';
import { normalizeList } from './normalize-list';
import { LIST_TYPES } from '../constant';
import { handleShortcut } from './shortcut';

const withList = (editor) => {
  const { insertBreak, onHotKeyDown, deleteBackWord, insertText } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    if (insertBreakList(editor)) return;
    insertBreak();
    return;
  };

  newEditor.deleteBackWord = (unit) => {
    const { selection } = newEditor;
    if (selection === null) {
      deleteBackWord(unit);
      return;
    }
    // nothing todo
    deleteBackWord(unit);
  };

  newEditor.insertText = (text) => {
    console.log('text', text);
    const isPreventInsert = handleShortcut(newEditor, text);
    console.log('isPreventInsert', isPreventInsert);
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
