import { Editor, Location, Node, Path, Point, Range, Transforms, next } from 'slate';
import { CODE_BLOCK, PARAGRAPH } from '../../constants/element-types';
import { focusEditor, generateEmptyElement, getNextNode, getSelectedElems, getSelectedNodeByType, getSelectedNodeEntryByType, isEndPoint } from '../../core';

export const isMenuDisabled = (editor, readonly) => {
  if (readonly) return true;
  const { selection } = editor;
  if (!selection) return true;
  const selectedElments = getSelectedElems(editor);
  const isSelectedVoid = selectedElments.some(node => editor.isVoid(node));
  if (isSelectedVoid) return true;
  // Disable the menu when selection is not in the paragraph or code block
  const isEnable = selectedElments.some(node => [CODE_BLOCK, PARAGRAPH].includes(node.type));
  return !isEnable;
};

export const isCodeBlockNode = (editor) => {
  if (!editor.selection) return false;
  const [node] = Editor.nodes(editor, {
    match: node => node.type === CODE_BLOCK
  });
  return !!node;
};

export const transformToCodeBlock = (editor) => {
  const selectedNode = getSelectedNodeEntryByType(editor, PARAGRAPH);
  const endPointOfSelectParagraph = Editor.end(editor, selectedNode[1]);
  Transforms.select(editor, endPointOfSelectParagraph);
  Transforms.setNodes(editor, { type: CODE_BLOCK });
  const nextNode = getNextNode(editor);
  // If the next node is not empty, insert a new paragraph
  const isInsertParagraph = !(nextNode && nextNode[0].children.length === 1 && nextNode[0].children[0].text === '');
  if (isInsertParagraph) {
    Transforms.insertNodes(editor, generateEmptyElement(PARAGRAPH));
  }
  focusEditor(editor, endPointOfSelectParagraph);
};

export const unwrapCodeBlock = (editor) => {
  Transforms.setNodes(editor, { type: PARAGRAPH });
  focusEditor(editor);
};
