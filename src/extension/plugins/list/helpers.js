import { Editor, Element, Node, Range, Text } from 'slate';
import { CHECK_LIST_ITEM, CODE_BLOCK, CODE_LINE, LIST_ITEM, TABLE } from '../../constants/element-types';
import { LIST_TYPES } from './constant';
import { transformsToList } from './transforms';

export const isMenuDisabled = (editor, readonly) => {
  if (readonly || !editor.selection) return true;
  // Match disable node
  const [matchedDisabledNode] = Editor.nodes(editor, {
    match: node => {
      if (!Element.isElement(node)) return false;
      const isVoidOrBlock = Editor.isVoid(editor, node) && Editor.isBlock(editor, node);
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
 * @returns {ORDERED_LIST | UNORDERED_LIST | undefined} Return the list type of the selected list
 */
export const getActiveListType = (editor) => {
  const { selection } = editor;
  if (!selection) return;
  let selectedListNodeEntry;
  if (Range.isCollapsed(selection)) {
    const [nodeEntry] = Editor.nodes(editor, {
      match: node => LIST_TYPES.includes(node.type),
      mode: 'lowest'
    });
    selectedListNodeEntry = nodeEntry;
  } else {
    const { anchor, focus } = selection;
    const commonNodeEntry = Node.common(editor, anchor.path, focus.path);
    //  Select condition:
    // 1. Select in one list
    // 2. Select in one list item
    // 3. Select in one line
    if (LIST_TYPES.includes(commonNodeEntry[0].type)) { // Select in one list
      selectedListNodeEntry = commonNodeEntry;
    } else if (commonNodeEntry[0].type === LIST_ITEM) { // Select in one list item
      selectedListNodeEntry = Editor.parent(editor, commonNodeEntry[1]);
    } else if (Text.isText(commonNodeEntry[0])) { // Select in one line
      const [nodeEntry] = Editor.nodes(editor, { at: commonNodeEntry[1], match: node => LIST_TYPES.includes(node.type), mode: 'lowest' });
      selectedListNodeEntry = nodeEntry;
    }
  }
  return selectedListNodeEntry && selectedListNodeEntry[0].type;
};

export const setListType = (editor, type) => {
  transformsToList(editor, type);
};

export const getBeforeText = (editor) => {
  const { selection } = editor;
  if (selection == null) return { beforeText: '', range: null };
  const { anchor } = selection;
  // Find the near text node above the current text
  const [, aboveNodePath] = Editor.above(editor);
  const aboveNodeStartPoint = Editor.start(editor, aboveNodePath); // The starting position of the text node
  const range = { anchor, focus: aboveNodeStartPoint };
  const beforeText = Editor.string(editor, range) || '';
  return { beforeText, range };
};
