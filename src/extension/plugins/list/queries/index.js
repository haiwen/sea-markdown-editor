import { Editor, Element, Range, Node } from 'slate';
import { LIST_ITEM } from '../../../constants/element-types';
import { LIST_TYPES } from '../constant';

export const getListItemEntry = (editor, { at = editor.selection } = {}) => {
  let _at = null;

  if (Range.isRange(at) && !Range.isCollapsed(at)) {
    _at = at.focus.path;
  } else if (Range.isRange(at)) {
    _at = at.anchor.path;
  } else {
    _at = at;
  }

  if (_at) {
    const node = Node.get(editor, _at);
    if (node) {
      const listItem = Editor.above(editor, { at: _at, match: (n) => Element.isElement(n) && n.type === LIST_ITEM });
      if (listItem) {
        const list = Editor.parent(editor, listItem[1]);

        return { list, listItem };
      }
    }
  }
  return null;
};

export const hasListChild = (node) => {
  return node.children.some(n => {
    return Element.isElement(n) && LIST_TYPES.includes(n.type);
  });
};

export const isListNested = (editor, listPath) => {
  const listParentNode = Editor.parent(editor, listPath)?.[0];
  return listParentNode?.type === LIST_ITEM;
};
