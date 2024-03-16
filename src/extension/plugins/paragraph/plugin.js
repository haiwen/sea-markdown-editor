import { Editor, Node, Transforms, Element, Path } from 'slate';
import { generateDefaultParagraph, getAboveBlockNode, getPrevNode, getSelectedNodeEntryByType } from '../../core';
import { PARAGRAPH, TABLE_CELL } from '../../constants/element-types';

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
      const nextPath = Path.next(aboveNode[1]);
      Transforms.insertNodes(newEditor, generateDefaultParagraph(), { at: nextPath, select: true });
      return;
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
