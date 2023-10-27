import { Editor, Node, Range, Transforms } from 'slate';
import { getPrevNode, getSelectedNodeByType, getSelectedNodeEntryByType, isStartPoint } from '../../core';
import { CHECK_LIST_ITEM, PARAGRAPH } from '../../constants/element-types';
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
      const selectedParagraphNodeEntry = getSelectedNodeEntryByType(newEditor, PARAGRAPH);
      // If cursor is at start of line and previous node is check list,remove the paragraph
      // instead of delete backward, which fix the bug that the check list will be removed when user
      // press backspace at start of line.
      if (selectedParagraphNodeEntry) {
        const isCursorAtStartOfLine = isStartPoint(editor, selection.anchor, selection);
        const previouseNodeEntry = getPrevNode(newEditor);
        const isCheckListAtPrevious = previouseNodeEntry && previouseNodeEntry[0].type === CHECK_LIST_ITEM;
        if (isCursorAtStartOfLine && isCheckListAtPrevious) {
          const focusPoint = Editor.end(newEditor, previouseNodeEntry[1]);
          const selectedParagraphText = Node.string(selectedParagraphNodeEntry[0]);
          const checkListText = Node.string(previouseNodeEntry[0]);
          const newCheckListText = checkListText + selectedParagraphText;
          Transforms.insertText(newEditor, newCheckListText, { at: previouseNodeEntry[1] });
          Transforms.removeNodes(newEditor, { at: selectedParagraphNodeEntry[1] });
          Transforms.select(newEditor, focusPoint);
          return;
        }
      }

      // If selected check list node is empty, transform it to paragraph.
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
