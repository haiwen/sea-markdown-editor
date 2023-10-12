import { Editor, Element, node } from 'slate';
import { getNodeType, getSelectedNodeEntryByType, isBlockAboveEmpty } from '../../core';
import { ORDERED_LIST, UNORDERED_LIST } from '../../constants/element-types';
import { getListAndListItemEntry } from './helpers';

const withList = (editor: Editor) => {
  const { insertBreak, deleteBackWord, handleTab } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {

    // if (insertBreakList(editor)) return;
    const nodeEntries = Editor.nodes(editor, { match: node => Element.isElement(node) && [ORDERED_LIST, UNORDERED_LIST].includes(node.type) })
    const nodeEntryList = [...nodeEntries]
    console.log('nodeEntryList', nodeEntryList);
    (!nodeEntryList.length || !newEditor.selection) && insertBreak();
    const listAndListItemEntry = getListAndListItemEntry(editor, { at: newEditor.selection });
    let isMove = false;
    if (listAndListItemEntry) {
      const { listEntry, listItemEntry } = listAndListItemEntry;
      const isAboveBlockEmpty = isBlockAboveEmpty(newEditor);
        // if selection is in a li, and li content is empty
      if(isAboveBlockEmpty) {

      }
    }
    // const [listNode, listPath] = listEntry;
    // console.log('listNode,listPath', listNode, listPath)
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

  // newEditor.handleTab = (event) => {
  //   if (!newEditor.selection) {
  //     handleTab && handleTab();
  //     return;
  //   }

  //   if (onTabHandle(newEditor, event)) return;

  //   handleTab && handleTab();
  // };

  // newEditor.insertFragment = insertFragmentList(newEditor);

  // newEditor.normalizeNode = normalizeList(editor);

  return newEditor;
};

export default withList;
