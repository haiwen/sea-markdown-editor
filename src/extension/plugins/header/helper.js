import { Editor, Transforms } from 'slate';
import { getNodeType, getParentNode, isTextNode } from '../../core/queries';
import { ELementTypes } from '../../constants';
import { focusEditor } from '../../core';

export const isMenuDisabled = (editor, readonly = false) => {
  if (readonly) return true;
  if (!editor.selection) return true;
  const [match] = Editor.nodes(
    editor,
    {
      match(node, path) {
        let type = getNodeType(node);
        if (!type && isTextNode(node) && node.id) {
          const parentNode = getParentNode(node, node.id);
          type = getNodeType(parentNode);
        }
        if (type === ELementTypes.PARAGRAPH) return true;
        if (type.startsWith(ELementTypes.HEADER)) return true;
        return false;
      },
      universal: true,
      mode: 'highest',
    },
  );
  return !match;
};

export const getHeaderType = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: node => {
      const nodeType = getNodeType(node);
      if (nodeType.includes(ELementTypes.HEADER)) return true;
      return false;
    },
    universal: true,
  });
  if (!match) return;
  const [matchedNode] = match;
  return getNodeType(matchedNode);
};

export const setHeaderType = (editor, type) => {
  if (!type) return;
  Transforms.setNodes(editor, { type });
  focusEditor(editor);
};
