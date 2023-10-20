import { Editor, Node, Range, Transforms } from 'slate';
import { getPrevNode, getSelectedNodeEntryByType, isStartPoint } from '../../core';
import { CHECK_LIST_ITEM, PARAGRAPH } from '../../constants/element-types';

const withParagraph = (editor) => {
  const { deleteBackward } = editor;
  const newEditor = editor;

  newEditor.deleteBackward = (unit) => {
    const { selection } = newEditor;
    if (!selection) {
      deleteBackward(unit);
      return;
    }
    const selectedParagraphNodeEntry = getSelectedNodeEntryByType(newEditor, PARAGRAPH);
    if (selectedParagraphNodeEntry) {
      const isCollapsed = Range.isCollapsed(selection);
      const isCursorAtStartOfLine = isStartPoint(editor, selection.anchor, selection);
      const previouseNodeEntry = getPrevNode(newEditor);
      const isCheckListAtPrevious = previouseNodeEntry && previouseNodeEntry[0].type === CHECK_LIST_ITEM;
      // If cursor is at start of line and previous node is check list,remove the paragraph
      // instead of delete backward, which fix the bug that the check list will be removed when user
      // press backspace at start of line.
      if (isCollapsed && isCursorAtStartOfLine && isCheckListAtPrevious) {
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
    return deleteBackward(unit);
  };
  return newEditor;
};

export default withParagraph;