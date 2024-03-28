import { Editor, Node, Transforms, Element, Path } from 'slate';
import { focusEditor, generateDefaultParagraph, getAboveBlockNode, getNodeEntries, getPrevNode, getSelectedNodeEntryByType } from '../../core';
import { PARAGRAPH, TABLE, TABLE_CELL } from '../../constants/element-types';

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
  const { deleteBackward, insertBreak, insertFragment } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    if (!newEditor.selection) {
      insertBreak();
      return;
    }
    const [node] = Editor.nodes(newEditor, { mode: 'lowest' });
    if (node && node[0].code) {
      const aboveNode = getAboveBlockNode(newEditor, { match: (n) => Element.isElement(n), mode: 'highest' });
      if (isSelectionAtLineStart(editor, node[1]) && Node.string(node[0]).length !== 0) {
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

  newEditor.insertFragment = (fragment) => {
    const match = { type: [PARAGRAPH] };
    const [paragraphEntry] = getNodeEntries(newEditor, { match });
    if (!paragraphEntry) return insertFragment(fragment);

    const firstChild = fragment[0];
    if (fragment.length === 1 && firstChild.type === TABLE) {
      const hasVoidNode = paragraphEntry[0].children.some(item => Editor.isVoid(newEditor, item));
      if (Node.string(paragraphEntry[0]).length === 0 && !hasVoidNode) {
        Transforms.insertNodes(newEditor, fragment, { at: paragraphEntry[1] });
        return;
      }

      const nextPath = Path.next(paragraphEntry[1]);
      Transforms.insertNodes(newEditor, fragment, { at: nextPath });
      return;
    }
    return insertFragment(fragment);
  };

  return newEditor;
};

export default withParagraph;
