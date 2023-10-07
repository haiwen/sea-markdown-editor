import { Editor, Transforms } from 'slate';
import { CODE_BLOCK, PARAGRAPH } from '../../constants/element-types';
import { focusEditor, getSelectedElems } from '../../core';

export const isMenuDisabled = (editor, readonly) => {
  if (readonly) return true;
  const { selection } = editor;
  if (!selection) return true;
  const selectedElments = getSelectedElems(editor);
  const isSelectedVoid = selectedElments.some(node => editor.isVoid(node));
  if (isSelectedVoid) return true;
  // Disable the menu when the selection is not in the paragraph or code block
  const isEnable = selectedElments.some(node => [CODE_BLOCK, PARAGRAPH].includes(node.type));
  return !isEnable;
};

export const isMenuActive = (editor) => {
  console.log('123', 123)
  if (!editor.selection) return false;
  const [node] = Editor.nodes(editor, {
    match: n => {
      console.log('n', n)
      return n.type === CODE_BLOCK;
    }
  });
  return !!node;
};

export const transformToCodeBlock = (editor) => {
  Transforms.setNodes(editor, { type: CODE_BLOCK });
  focusEditor(editor);
};

export const unwrapCodeBlock = (editor) => {
  Transforms.setNodes(editor, { type: PARAGRAPH });
  focusEditor(editor);
};
