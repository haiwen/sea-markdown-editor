import { Transforms, Path, Editor } from 'slate';
import { generateElement, getAboveNode, getNode, isLastChild } from '../../../core';
import { hasListChild } from '../queries';
import { moveListItemsToList } from './move-list-items-to-list';
import { unwrapList } from './unwrap-list';
import { LIST_ITEM } from '../../../constants/element-types';

export const movedListItemUp = (editor, { list, listItem }) => {
  const move = () => {
    const [listNode, listPath] = list;
    const [liNode, liPath] = listItem;

    // Get above node of list item
    const liParent = getAboveNode(editor, {
      at: listPath,
      match: { type: [LIST_ITEM] }
    });

    // Current list is the top hierarchy list, list[ol] > 'li', since there is no parent.
    if (!liParent) {
      let toListPath = null;
      try {
        toListPath = Path.next(listPath);
      } catch (err) {
        return;
      }

      const isHasLiChild = hasListChild(liNode);
      const isNotLastChild = !isLastChild(list, liPath);

      if (isHasLiChild || isNotLastChild) {
        // Create a new sibling node
        const list = generateElement(listNode.type);
        Transforms.insertNodes(editor, list, { at: toListPath });
      }

      // If contains child nodes, move the child nodes to the newly created node
      if (isHasLiChild) {
        const toListNode = getNode(editor, toListPath);
        if (!toListNode) return;

        moveListItemsToList(editor, {
          formListItem: listItem,
          toList: [toListNode, toListPath]
        });
      }

      // If not last child, move the next siblings to the newly created node
      if (isNotLastChild) {
        const toListNode = getNode(editor, toListPath);
        if (!toListNode) return;

        moveListItemsToList(editor, {
          fromList: list,
          fromStartIndex: liPath[liPath.length - 1] + 1,
          toList: [toListNode, toListPath],
          deleteFromList: false,
        });
      }

      // unwrap the list
      unwrapList(editor, { at: liPath.concat(0) });
      return true;
    }

    // If parent exists, the current list is a child list, li > list[ol] > 'li'.
    const [, liParentPath] = liParent;
    // is last: false
    // li > list[ol] > li
    //               > li
    const toListPath = liPath.concat([1]);
    if (!isLastChild(list, liPath)) {
      // Here is a trick.
      // First, move the sibling node of the current node to the child node of the current node "ol".
      // Second, move the child node of the current node to the sibling node of the current node.
      if (!hasListChild(liNode)) {
        const list = generateElement(listNode.type);
        Transforms.insertNodes(editor, list, { at: toListPath });
      }

      const toListNode = getNode(editor, toListPath);
      if (!toListNode) return;

      // Move next siblings to li sublist
      moveListItemsToList(editor, {
        fromListItem: liParent,
        toList: [toListNode, toListPath],
        fromStartIndex: liPath[liPath.length - 1] + 1,
        deleteFromList: false,
      });
    }

    // is last: true
    // li > list[ol] > li
    const movedUpLiPath = Path.next(liParentPath);
    Transforms.moveNodes(editor, { at: liPath, to: movedUpLiPath });
    return true;
  };

  let moved = false;
  Editor.withoutNormalizing(editor, () => {
    moved = move();
  });
  return moved;
};
