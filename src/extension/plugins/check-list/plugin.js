import { Editor, Node, Range, Transforms } from 'slate';
import { getSelectedNodeByType } from '../../core';
import { CHECK_LIST_ITEM } from '../../constants/element-types';
import { transformToParagraph } from '../paragraph/helper';

const withCheckList = (editor: Editor) => {
  const { insertBreak, deleteBackward } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    if (!newEditor.selection) {
      insertBreak();
      return;
    }
    const checkListNode = getSelectedNodeByType(newEditor, CHECK_LIST_ITEM);
    console.log('checkListNode', checkListNode)
    if (!checkListNode) {
      insertBreak();
      console.log('888', 888)
      return;
    }
    console.log('999', 999)
    const nodeText = Node.string(checkListNode);
    if (nodeText.length === 0) {
      transformToParagraph(newEditor);
    } else {
      Transforms.splitNodes(editor, { always: true });
    }
  };

  newEditor.deleteBackward = (unit) => {
    if (!newEditor.selection) {
      deleteBackward(unit);
      return;
    }
    const { selection } = newEditor;
    if (selection && Range.isCollapsed(selection)) {
      const selectedCheckListNode = getSelectedNodeByType(newEditor, CHECK_LIST_ITEM);
      const checkListNodeText = Node.string(selectedCheckListNode);
      if (!checkListNodeText.length) {
        transformToParagraph(newEditor);
      }
    }
  };

  return newEditor;
};

export default withCheckList;


const abc: boolean = []
