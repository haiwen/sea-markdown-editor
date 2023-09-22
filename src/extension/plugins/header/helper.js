import { Editor, Transforms } from 'slate';
import { getNodeType, getParentNode, isTextNode } from '../../core/queries';
import { ELementTypes } from '../../constants';

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

        if (type === ELementTypes.CODE_LINE) return true;
        if (type === ELementTypes.CODE_BLOCK) return true;
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

/**
 * @param {Editor} editor
 * @returns {String | undefined} header type | undefined
 * @description get header type of current selection,if not header-type will return undefined
 */
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
  const [machedNode] = match;
  return getNodeType(machedNode);
};

export const setHeaderType = (editor, type) => {
  if (!type) return;
  Transforms.setNodes(editor, { type });
};
