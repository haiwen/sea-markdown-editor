import { Editor, Node, Transforms } from 'slate';
import { getPrevNode, getSelectedNodeEntryByType } from '../../core';
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
      Editor.removeMark(newEditor, 'code');
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
