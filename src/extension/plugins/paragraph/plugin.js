import { Editor, Node, Transforms, Element, Path } from 'slate';
import { focusEditor, generateDefaultParagraph, getAboveBlockNode, getPrevNode, getSelectedNodeEntryByType } from '../../core';
import { PARAGRAPH, TABLE_CELL } from '../../constants/element-types';

const isSelectionAtLineEnd = (editor, path) => {
  const { selection } = editor;

  if (!selection) return false;
  const isAtLineEnd = Editor.isEnd(editor, selection.anchor, path) || Editor.isEnd(editor, selection.focus, path);
  return isAtLineEnd;
};

const isSelectionAtLineStart = (editor, path) => {
  const { selection } = editor;

  if (!selection) return false;
  const isAtLineEnd = Editor.isStart(editor, selection.anchor, path) || Editor.isStart(editor, selection.focus, path);
  return isAtLineEnd;
};

const withParagraph = (editor) => {
  const { deleteBackward, insertBreak } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    if (!newEditor.selection) {
      insertBreak();
      return;
    }
    const [node] = Editor.nodes(newEditor, { mode: 'lowest' });
    if (node && node[0].code) {
      const aboveNode = getAboveBlockNode(newEditor, { match: (n) => Element.isElement(n), mode: 'highest' });
      if (isSelectionAtLineStart(editor, node[1])) {
        Transforms.insertNodes(newEditor, generateDefaultParagraph(), { at: aboveNode[1], select: true });
        const startPosition = Editor.start(editor, Path.next(aboveNode[1]));
        const range = {
          anchor: startPosition,
          focus: startPosition,
        };
        focusEditor(newEditor, range);
        return;
      }

      if (isSelectionAtLineEnd(editor, node[1])) {
        const nextPath = Path.next(aboveNode[1]);
        Transforms.insertNodes(newEditor, generateDefaultParagraph(), { at: nextPath, select: true });
        return;
      }
    }
    insertBreak();
  };

  newEditor.deleteBackward = (unit) => {
    const { selection } = newEditor;
    if (!selection) {
      deleteBackward(unit);
      return;
    }
    const selectedParagraphNodeEntry = getSelectedNodeEntryByType(newEditor, PARAGRAPH);
    if (selectedParagraphNodeEntry) {
      if (Node.string(selectedParagraphNodeEntry[0]) === '') {
        const previousNodeEntry = getPrevNode(newEditor);
        if (previousNodeEntry && previousNodeEntry[0].type === TABLE_CELL) {
          Transforms.removeNodes(newEditor, { at: selectedParagraphNodeEntry[1] });
          return;
        }
      }
    }
    return deleteBackward(unit);
  };
  return newEditor;
};

export default withParagraph;
