import { Editor, Transforms, Element, Node } from '@seafile/slate';
import { LIST_ITEM, LIST_LIC, PARAGRAPH } from '../../../constants';
import { getAboveBlockNode, getAboveNode, getNodeType } from '../../../core';
import { getListTypes } from '../queries';

export const unwrapList = (editor, { at } = {}) => {
  const ancestorListTypeCheck = () => {
    if (getAboveNode(editor, {match: { type: getListTypes() }})) {
      return true;
    }

    // The selection's common node might be a list type
    if (!at && editor.selection) {
      const commonNode = Node.common(
        editor,
        editor.selection.anchor.path,
        editor.selection.focus.path
      );
      if (Element.isElement(commonNode[0]) && getListTypes().includes(commonNode[0].type)) {
        return true;
      }
    }

    return false;
  };

  Editor.withoutNormalizing(editor, () => {
    do {
      const licEntry = getAboveBlockNode(editor, {at, match: {type: LIST_LIC}});
      if (licEntry) {
        Transforms.setNodes(editor, {type: PARAGRAPH});
      }

      Transforms.unwrapNodes(editor, {
        at,
        match: (n) => getNodeType(n) === LIST_ITEM,
        split: true,
      });

      Transforms.unwrapNodes(editor, {
        at,
        match: (n) => getListTypes().includes(getNodeType(n)),
        split: true,
      });

    } while(ancestorListTypeCheck());
  });
};

