import { Editor, Element, Point, Transforms, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { CODE_BLOCK, PARAGRAPH } from '../../constants/element-types';
import { generateEmptyElement } from '../../core';

const withCodeBlock = (editor: Editor) => {
  const { insertBreak, insertText, deleteBackward } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    const { selection } = editor;
    if (selection == null) return insertBreak();

    const [nodeEntry] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && n.type === CODE_BLOCK,
      universal: true,
    });
    if (!nodeEntry) return insertBreak();
    insertText('\n');
  };

  return newEditor;
};

export default withCodeBlock;
