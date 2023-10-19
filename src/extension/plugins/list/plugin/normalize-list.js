import { Node, Element, Transforms, Path } from 'slate';
import { generateElement, getChildren, getNode, getPreviousPath, match } from '../../../core';
import { moveListItemsToList, normalizeListItem, normalizeNestedList } from '../transforms';
import { LIST_TYPES } from '../constant';
import { LIST_ITEM, LIST_LIC, PARAGRAPH } from '../../../constants/element-types';

export const normalizeList = (editor) => {
  const { normalizeNode } = editor;
  return ([node, path]) => {
    if (!Element.isElement(node)) {
      return normalizeNode([node, path]);
    }

    // If current node is list, check if it's children is list item, if not, wrap it with list item
    if (LIST_TYPES.includes(node.type)) {
      const children = getChildren([node, path]);
      const nonLiChild = children.find(([child]) => child.type !== LIST_ITEM);

      if (nonLiChild) {
        const listItem = generateElement(LIST_ITEM, { childrenOrText: [] });
        Transforms.wrapNodes(editor, listItem, { at: nonLiChild[1] });
        return;
      }
    }

    if (match(node, [], { type: LIST_TYPES })) {
      // Search empty list in editor, if found, remove it
      if (!node.children.length || !node.children.find(item => item.type === LIST_ITEM)) {
        Transforms.removeNodes(editor, { at: path });
        return;
      }

      const nextPath = Path.next(path);
      const nextNode = getNode(editor, nextPath);

      // Merge next list to current list if they are same type
      if (nextNode?.type === node.type) {
        moveListItemsToList(editor, {
          fromList: [nextNode, nextPath],
          toList: [node, path],
          deleteFromList: true,
        });
      }

      const prevPath = getPreviousPath(path);
      const prevNode = getNode(editor, prevPath);

      if (prevNode?.type === node.type) {
        editor.normalizeNode([prevNode, prevPath]);
        return;
      }

      if (normalizeNestedList(editor, { nestedListItem: [node, path] })) {
        return;
      }
    }

    if (node.type === LIST_ITEM) {
      if (normalizeListItem(editor, { listItem: [node, path] })) {
        return;
      }
    }

    // Transform list to paragraph if it's parent is not list item
    if (node.type === LIST_LIC) {
      const node = Node.parent(editor, path);
      if (node?.type !== LIST_ITEM) {
        Transforms.setNodes(editor, { type: PARAGRAPH }, { at: path });
        return;
      }
    }

    normalizeNode([node, path]);
  };
};
