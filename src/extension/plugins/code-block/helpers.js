import { Editor, Element, Node, Point, Range, Transforms, isBlock } from 'slate';
import { CODE_BLOCK, CODE_LINE, PARAGRAPH } from '../../constants/element-types';
import { focusEditor, generateElementInCustom, getSelectedElems, getSelectedNodeEntryByType } from '../../core';
// eslint-disable-next-line no-unused-vars
import { EXPLAIN_TEXT, LANGUAGE_MAP } from './render-elem/constant';

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

export const getCodeBlockNodeEntry = (editor) => {
  if (!editor.selection) return;
  const [codeBlock] = Editor.nodes(editor, {
    match: node => node.type === CODE_BLOCK,
    mode: 'highest'
  });
  return codeBlock;
};

export const isInCodeBlock = (editor) => {
  if (!editor.selection) return false;
  const [codeBlock] = Editor.nodes(editor, {
    match: node => node.type === CODE_BLOCK,
    mode: 'highest'
  });
  if (!codeBlock) return false;
  const selectedElments = getSelectedElems(editor);
  const isNotInCodeBlock = !selectedElments.find(element => ![CODE_BLOCK, CODE_LINE].includes(element.type));
  return isNotInCodeBlock;
};

export const transformToCodeBlock = (editor) => {
  const selectedElments = getSelectedElems(editor);
  const selectedCodeBlockNum = selectedElments.reduce(
    (coudeBlockNum, node) => node.type === CODE_BLOCK
      ? ++coudeBlockNum
      : coudeBlockNum
    , 0);
  if (selectedCodeBlockNum > 0) return;
  const customSelection = editor.selection;
  const { anchor: customAnchor, focus: customFocus } = customSelection;
  const textList = [];
  const nodeEntries = Editor.nodes(editor, {
    match: node => editor.children.includes(node), // Match the highest level node that custom selected
    universal: true,
  });
  for (let nodeEntry of nodeEntries) {
    const [node] = nodeEntry;
    if (node) {
      textList.push(Node.string(node));
    }
  }
  // Generate code block
  const codeBlockChildren = textList.map(text => generateElementInCustom(CODE_LINE, text));
  const codeBlock = generateElementInCustom(CODE_BLOCK, codeBlockChildren, { lang: EXPLAIN_TEXT });

  Transforms.removeNodes(editor, {
    at: editor.selection,
    mode: 'highest',
    match: node => Element.isElement(node) && isBlock(editor, node)
  });

  const selectedPath = Editor.path(editor, customSelection);
  const isCollapsed = editor.selection && Range.isCollapsed(editor.selection);
  const beginPath = Point.isBefore(customAnchor, customFocus) ? customAnchor.path : customFocus.path;
  const focusPoint = Point.isAfter(customFocus, customAnchor) ? customFocus : customAnchor;
  const insertPath = selectedPath && Object.keys(selectedPath).length ? [selectedPath[0]] : [beginPath[0]];
  Transforms.insertNodes(editor, codeBlock, { at: insertPath });
  focusEditor(editor, isCollapsed ? Editor.end(editor, insertPath) : focusPoint);
};

export const unwrapCodeBlock = (editor) => {
  const selectedCodeBlock = getSelectedNodeEntryByType(editor, CODE_BLOCK);
  if (!selectedCodeBlock) return;
  const selectedCodeBlockPath = selectedCodeBlock[1];
  const codeLineEntries = Editor.nodes(editor, {
    at: selectedCodeBlockPath,
    match: node => node.type === CODE_LINE,
  });
  const paragraphNodes = [];
  for (const codeLineEntry of codeLineEntries) {
    const [codeLineNode] = codeLineEntry;
    const paragraph = generateElementInCustom(PARAGRAPH, Node.string(codeLineNode));
    paragraphNodes.push(paragraph);
  }
  Transforms.removeNodes(editor, { at: selectedCodeBlockPath, match: node => node.type === CODE_BLOCK, mode: 'highest' });
  Transforms.insertNodes(editor, paragraphNodes, { at: selectedCodeBlockPath });
  const focusPath = [selectedCodeBlockPath[0] + paragraphNodes.length - 1];
  focusEditor(editor, Editor.end(editor, focusPath));
};

/**
 * @param {Object} editor
 * @param {keyof LANGUAGE_MAP} [language = EXPLAIN_TEXT] by default is 'none'
 */
export const setCodeBlockLanguage = (editor, language) => {
  const selectedNode = getSelectedNodeEntryByType(editor, CODE_BLOCK);
  Transforms.setNodes(editor, { lang: language }, { at: selectedNode[1] });
};
