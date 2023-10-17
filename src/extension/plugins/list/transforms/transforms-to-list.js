import { Editor, Element, Node, Range, Transforms } from 'slate';
import { findNode, generateElement, getSelectedNodeByType, isRangeAcrossBlocks } from '../../../core';
import { getListItemEntry } from '../queries';
import { LIST_TYPES } from '../constant';
import { LIST_ITEM, LIST_LIC, PARAGRAPH } from '../../../constants/element-types';
import { unwrapList } from './unwrap-list';

const wrapLineList = (editor, type) => {
  const emptyList = generateElement(type, { childrenOrText: [] });
  Transforms.wrapNodes(editor, emptyList);
  const paragraphEntry = getSelectedNodeByType(editor, PARAGRAPH);
  if (!paragraphEntry) return;
  const [paragraphNode, paragraphPath] = paragraphEntry;
  if (paragraphNode.type !== LIST_LIC) {
    Transforms.setNodes(editor, { type: LIST_LIC });
  }
  const emptyListItem = generateElement(LIST_ITEM, { childrenOrText: [] });
  Transforms.wrapNodes(editor, emptyListItem, { at: paragraphPath });
};

const wrapRangeList = (editor, type) => {
  const [startPoint, endPoint] = Range.edges(editor.selection);
  const [commonAncestorNode, commonAncestorPath] = Node.common(editor, startPoint.path, endPoint.path);

  // If common anchestor is of list,order list, unordered list, list of items,wrap or un wrap it
  if ([...LIST_TYPES, LIST_ITEM].includes(commonAncestorNode.type)) {
    // Change to another list type, if select different depth of list,set the shallowest depth to the given type
    if (commonAncestorNode.type !== type) {
      const options = { at: startPoint, match: { type: LIST_TYPES, mode: 'lowest' } };
      const startListEntry = findNode(editor, options);
      const endListEntry = findNode(editor, { ...options, at: endPoint });
      const selectDepth = Math.min(startListEntry[1].length, endListEntry[1].length);
      Transforms.setNodes(editor, { type }, {
        match: (node, path) => Element.isElement(node) && LIST_TYPES.includes(node.type) && path.length >= selectDepth,
        mode: 'all',
      });
    } else {
      unwrapList(editor);
    }
    return;
  }

  const commonAncestorDepth = commonAncestorPath.length;
  const selectedNodeEntries = Editor.nodes(editor, { mode: 'all' });
  // Filter out the nodes lower than the common ancestor
  const nodeEntryList = Array.from(selectedNodeEntries)
    .filter(([node, path]) => path.length === commonAncestorDepth + 1);

  nodeEntryList.forEach(([node, path]) => {
    if (LIST_ITEM.includes(node.type)) {
      Transforms.setNodes(editor, { type }, {
        at: path,
        match: n => Element.isElement(n) && LIST_ITEM.includes(n.type),
        mode: 'all',
      });
    } else {
      (node.type !== LIST_LIC) && Transforms.setNodes(editor, { type: LIST_LIC }, { at: path });
      const emptyListItem = generateElement(LIST_ITEM, { childrenOrText: [] });
      Transforms.wrapNodes(editor, emptyListItem, { at: path });
      const emptyList = generateElement(type, { childrenOrText: [] });
      Transforms.wrapNodes(editor, emptyList, { at: path });
    }
  });

};

/**
 * @param {object} editor
 * @param {keyof LIST_TYPES} type
 */
const setListType = (editor, type) => Transforms.setNodes(editor, { type }, {
  match: node => LIST_TYPES.includes(node.type),
  mode: 'lowest',
});

/**
 * @param {object} editor
 * @param {keyof LIST_TYPES} type
 */
export const transformsToList = (editor, type) => {
  Editor.withoutNormalizing(editor, () => {
    const { selection } = editor;
    if (!selection) return;
    if (Range.isCollapsed(editor) || !isRangeAcrossBlocks(editor)) {
      const res = getListItemEntry(editor);
      // Unwrap list if `res` exist which means selected in list,or wrap it
      if (res) {
        const { list } = res;
        // Change list type to another, if list type is different from the given type
        list[0].type !== type ? setListType(editor, type) : unwrapList(editor);
      } else {
        wrapLineList(editor, type);
      }
      return;
    }
    // Selection is a range
    wrapRangeList(editor, type);
  });
};
