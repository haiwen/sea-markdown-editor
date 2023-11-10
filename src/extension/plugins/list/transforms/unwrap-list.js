import { Editor, Transforms, Element, Node } from 'slate';
import { getAboveNode, getNodeType } from '../../../core';
import { LIST_TYPES } from '../constant';
import { LIST_ITEM } from '../../../constants/element-types';

export const unwrapList = (editor, { at } = {}) => {
  const ancestorListTypeCheck = () => {
    if (getAboveNode(editor, { match: { type: LIST_TYPES } })) {
      return true;
    }

    // The selection's common node might be a list type
    if (!at && editor.selection) {
      const commonNode = Node.common(
        editor,
        editor.selection.anchor.path,
        editor.selection.focus.path
      );
      if (Element.isElement(commonNode[0]) && LIST_TYPES.includes(commonNode[0].type)) {
        return true;
      }
    }

    return false;
  };

  Editor.withoutNormalizing(editor, () => {
    do {
      Transforms.unwrapNodes(editor, {
        at,
        match: (n) => getNodeType(n) === LIST_ITEM,
        split: true,
      });

      Transforms.unwrapNodes(editor, {
        at,
        match: (n) => LIST_TYPES.includes(getNodeType(n)),
        split: true,
      });

    } while (ancestorListTypeCheck());
  });
};

