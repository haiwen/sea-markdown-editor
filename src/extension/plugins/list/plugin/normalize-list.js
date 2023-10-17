import { Node, Element, Transforms, Path } from '@seafile/slate';
import { LIST_ITEM, LIST_LIC, PARAGRAPH } from '../../../constants';
import { getChildren, getNode, getPreviousPath, match } from '../../../core';
import { getListTypes } from '../queries';
import { moveListItemsToList, normalizeListItem, normalizeNestedList } from '../transforms';
import { generateEmptyListItem } from '../model';

export const normalizeList = (editor) => {
  const { normalizeNode } = editor;
  return ([node, path]) => {
    if (!Element.isElement(node)) {
      return normalizeNode([node, path]);
    }

    const listTypes = getListTypes();

    // root
    if (listTypes.includes(node.type)) {
      const children = getChildren([node, path]);
      const nonLiChild = children.find(([child]) => child.type !== LIST_ITEM);

      if (nonLiChild) {
        const listItem = generateEmptyListItem();
        Transforms.wrapNodes(editor, listItem, {at: nonLiChild[1]});
        return;
      }
    }

    if (match(node, [], {type: listTypes})) {
      if (!node.children.length || !node.children.find(item => item.type === LIST_ITEM)) {
        Transforms.removeNodes(editor, {at: path});
        return;
      }

      const nextPath = Path.next(path);
      const nextNode = getNode(editor, nextPath);

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

      if (normalizeNestedList(editor, {nestedListItem: [node, path]})) {
        return;
      }
    }

    if (node.type === LIST_ITEM) {
      if (normalizeListItem(editor, {listItem: [node, path]})) {
        return;
      }
    }

    if (node.type === LIST_LIC && LIST_LIC !== PARAGRAPH) {
      const node = Node.parent(editor, path);
      if (node?.type !== LIST_ITEM) {
        Transforms.setNodes(editor, {type: PARAGRAPH}, {at: path});
        return;
      }
    }

    normalizeNode([node, path]);
  };
};
