import { Editor } from 'slate';
import { CHECK_LIST_ITEM, CODE_BLOCK, CODE_LINE, TABLE } from '../../constants/element-types';
import { getNodeType } from '../../core/queries';

export const isMenuDisabled = (editor, readonly) => {
  if (readonly || !editor.selection) return true;
  // Match disable node
  const [matchedDisabledNode] = Editor.nodes(editor, {
    match: node => {
      const isVoidOrBlock = Editor.isVoid(editor, node) || Editor.isBlock(editor, node);
      if (isVoidOrBlock) return true;
      const disabledNodeTypes = [CODE_LINE, CODE_BLOCK, TABLE, CHECK_LIST_ITEM];
      const isDisabledNode = disabledNodeTypes.includes(node.type);
      if (isDisabledNode) return true;
      return false;
    },
  });
  if (matchedDisabledNode) return true;
  return false;
};

/**
 * @param {object} editor
 * @param {keyof LIST_TYPES} type
 */
export const getListEntries = (editor, type) => {
  const match = (n) => getNodeType(n) === type;
  const nodeEntries = Editor.nodes(editor, { match, universal: true });
  return nodeEntries;
};
