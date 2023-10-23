import { Transforms, Path, Editor } from 'slate';
import { match } from '../../../core';
import { ORDERED_LIST, UNORDERED_LIST } from '../../../constants/element-types';

export const normalizeNestedList = (editor, { nestedListItem } = {}) => {
  const [, path] = nestedListItem;

  const parentNodeEntry = Editor.parent(editor, path);
  const hasParentList = parentNodeEntry && match(parentNodeEntry[0], [], {type: [ORDERED_LIST, UNORDERED_LIST]});

  if (!hasParentList) return false;

  let previousListItemPath = null;

  try {
    previousListItemPath = Path.previous(path);
  } catch (e) {
    return false;
  }

  const previousSiblingItem = Editor.node(editor, previousListItemPath);
  if (previousSiblingItem) {
    const [, previousPath] = previousSiblingItem;
    const newPath = previousPath.concat([1]);

    Transforms.moveNodes(editor, {at: path, to: newPath});
    return true;
  }

  return false;
};
