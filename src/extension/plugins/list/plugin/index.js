import isHotkey from 'is-hotkey';
import { getActiveListType } from '../helpers';
import { handleTab } from './on-tab-handle';
import { insertBreakList } from './insert-break-list';
import { insertFragmentList } from './insert-fragment-list';
import { normalizeList } from './normalize-list';
import { LIST_TYPES } from '../constant';

const withList = (editor) => {
  const { insertBreak, onHotKeyDown } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    if (insertBreakList(editor)) return;
    insertBreak();
    return;
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

  newEditor.normalizeNode = normalizeList(editor);

  return newEditor;
};

export default withList;
