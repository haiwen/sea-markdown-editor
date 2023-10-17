import { Editor, Element } from 'slate';
import isHotkey from 'is-hotkey';
import {  isBlockAboveEmpty } from '../../../core';
import { LIST_ITEM, ORDERED_LIST, UNORDERED_LIST } from '../../../constants/element-types';
import { getListAndListItemEntry, getListEntries, insertListItem } from '../helpers';
import { handleTab } from './on-tab-handle';
import { moveListItemUp } from '../transforms/move-list-item-up';

const withList = (editor: Editor) => {
  const { insertBreak, deleteBackWord, onHotKeyDown } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    // if (insertBreakList(editor)) return;
    const nodeEntries = Editor.nodes(editor, { match: node => Element.isElement(node) && [ORDERED_LIST, UNORDERED_LIST].includes(node.type) });
    const nodeEntryList = [...nodeEntries];
    (!nodeEntryList.length || !newEditor.selection) && insertBreak();
    const listAndListItemEntry = getListAndListItemEntry(editor, { at: newEditor.selection });
    let isMoved = false;
    if (listAndListItemEntry) {
      const isAboveBlockEmpty = isBlockAboveEmpty(newEditor);
      // if selection is in a li, and li content is empty
      if (isAboveBlockEmpty) {
        isMoved = moveListItemUp(editor, listAndListItemEntry);
        if (isMoved) return true;
      }
    }
    if (!isMoved) {
      const inserted = insertListItem(newEditor);
      if (inserted) return true;
    }
    return;
  };

  // newEditor.deleteBackWord = (unit) => {
  //   const { selection } = newEditor;
  //   if (selection === null) {
  //     deleteBackWord(unit);
  //     return;
  //   }
  //   // nothing todo
  //   deleteBackWord(unit);
  // };

  newEditor.onHotKeyDown = (event) => {
    const listItemEntries = getListEntries(editor, LIST_ITEM);
    const listItemEntyList = Array.from(listItemEntries);
    if (listItemEntyList.length) {
      if (isHotkey(['tab', 'shift+tab'], event)) {
        if (handleTab(newEditor, event)) return true;
      }
    }
    return onHotKeyDown && onHotKeyDown(event);
  };

  // newEditor.insertFragment = insertFragmentList(newEditor);

  // newEditor.normalizeNode = normalizeList(editor);

  return newEditor;
};

export default withList;
