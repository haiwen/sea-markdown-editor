import { Node, Range, Transforms } from 'slate';
import { getSelectedNodeByType } from '../../core';
import { CHECK_LIST_ITEM } from '../../constants/element-types';
import { transformToParagraph } from '../paragraph/helper';

const withCheckList = (editor) => {
  const { insertBreak, deleteBackward } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    if (!newEditor.selection) {
      insertBreak();
      return;
    }
    const checkListNode = getSelectedNodeByType(newEditor, CHECK_LIST_ITEM);
    if (!checkListNode) {
      insertBreak();
      return;
    }
    const nodeText = Node.string(checkListNode);
    if (nodeText.length === 0) {
      transformToParagraph(newEditor);
    } else {
      Transforms.splitNodes(newEditor, { always: true });
    }
  };

  newEditor.deleteBackward = (unit) => {
    const { selection } = newEditor;
    if (selection && Range.isCollapsed(selection)) {
      const selectedCheckListNode = getSelectedNodeByType(newEditor, CHECK_LIST_ITEM);
      if (selectedCheckListNode) {
        const checkListNodeText = Node.string(selectedCheckListNode);
        if (!checkListNodeText.length) {
          transformToParagraph(newEditor);
          return;
        }
      }
    }
    deleteBackward(unit);
  };

  return newEditor;
};

export default withCheckList;
