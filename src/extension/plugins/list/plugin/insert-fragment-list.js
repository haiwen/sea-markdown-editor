import { Element, Path, Transforms, Node, Editor, insertFragment } from 'slate';
import slugid from 'slugid';
import { findNode, generateDefaultText, getCommonNode, getInlineNodes, getNode, getNodes } from '../../../core';
import { LIST_TYPES } from '../constant';
import { LIST_ITEM, PARAGRAPH } from '../../../constants/element-types';

const isListRoot = (node) => {
  return Element.isElement(node) && LIST_TYPES.includes(node.type);
};

const getFirstAncestorOfType = (root, entry, { type }) => {
  let ancestor = Path.parent(entry[1]);
  while (getNode(root, ancestor).type !== type) {
    ancestor = Path.parent(ancestor);
  }
  return [getNode(root, ancestor), ancestor];
};

const findListItemsWithContent = (first) => {
  let prev = null;
  let node = first;
  while (isListRoot(node) || (node.type === LIST_ITEM && node.children[0].type !== PARAGRAPH)) {
    prev = node;
    [node] = node.children;
  }
  return prev ? prev.children : [node];
};

const trimList = (listRoot) => {
  if (!isListRoot(listRoot)) {
    return [listRoot];
  }

  const _texts = Node.texts(listRoot);
  const textEntries = Array.from(_texts);

  const commonAncestorEntry = textEntries.reduce((commonAncestor, textEntry) => {
    return (Path.isAncestor(commonAncestor[1], textEntry[1])
      ? commonAncestor
      : (getCommonNode(listRoot, textEntry[1], commonAncestor[1]))
    );
  }, getFirstAncestorOfType(listRoot, textEntries[0], { type: LIST_ITEM }));

  // is ul/ol: return children
  // is not ul/ol
  const [first, ...rest] = isListRoot(commonAncestorEntry[0]) ? commonAncestorEntry[0].children : [commonAncestorEntry[0]];
  return [...findListItemsWithContent(first), ...rest];
};

const wrapNodeIntoListItem = (node) => {
  if (node.type === LIST_ITEM) return node;
  const children = getInlineNodes(node);

  return {
    id: slugid.nice(),
    type: LIST_ITEM,
    children: [{
      id: slugid.nice(),
      type: PARAGRAPH,
      children,
    }]
  };
};

const isSingleLic = (fragment) => {
  const isFragmentOnlyListRoot = fragment.length === 1 && isListRoot(fragment[0]);
  return (
    isFragmentOnlyListRoot &&
    [...getNodes({ children: fragment })]
      .filter(entry => Element.isElement(entry[0]))
      .filter(([node]) => node.type === PARAGRAPH).length === 1
  );
};

export const getTextAndListItemNodes = (editor, fragment, liEntry, licEntry) => {
  const [, liPath] = liEntry;
  const [licNode, licPath] = licEntry;
  const isEmptyNode = !Node.string(licNode);
  // format copied fragment
  // first: lic, path: [...liPath, 0, 0]
  // rest: children, path: [...liPath, 1, 0]
  const [first, ...rest] = fragment.flatMap(trimList).map(wrapNodeIntoListItem);

  let textNode = null;
  let listItemNodes = [];
  if (isListRoot(fragment[0])) {
    if (isSingleLic(fragment)) {
      textNode = first;
      listItemNodes = rest;
    } else if (isEmptyNode) {
      const li = getNode(editor, liPath);
      const [, ...currentSubLists] = li.children; // old

      const [newLic, ...newSubLists] = first.children; // copied
      // insert copied contents
      Transforms.insertNodes(editor, newLic, {
        at: Path.next(licPath),
        select: true,
      });
      Transforms.removeNodes(editor, { at: licPath });

      if (newSubLists.length) {
        if (currentSubLists.length) {
          const path = [...liPath, 1, 0];
          Transforms.insertNodes(editor, newSubLists[0].children, {
            at: path,
            select: true,
          });
        } else {
          Transforms.insertNodes(editor, newSubLists, {
            at: Path.next(licPath),
            select: true,
          });
        }
      }

      textNode = generateDefaultText();
      listItemNodes = rest;
    } else {
      textNode = generateDefaultText();
      listItemNodes = [first, ...rest];
    }
  } else {
    textNode = first;
    listItemNodes = rest;
    return { textNode, listItemNodes };
  }

  return { textNode, listItemNodes };
};

export const insertFragmentList = (editor) => {
  return (fragment) => {
    Editor.withoutNormalizing(editor, () => {
      let liEntry = findNode(editor, {
        match: { type: LIST_ITEM },
        mode: 'lowest'
      });
      if (!liEntry) {
        const nodes = isListRoot(fragment) ? [generateDefaultText(), ...fragment] : fragment;
        return insertFragment(editor, nodes);
      }

      insertFragment(editor, [generateDefaultText()]); // need ' '

      liEntry = findNode(editor, {
        match: { type: LIST_ITEM },
        mode: 'lowest'
      });

      const licEntry = findNode(editor, {
        match: { type: PARAGRAPH },
        mode: 'lowest'
      });

      if (!licEntry) {
        const nodes = isListRoot(fragment) ? [generateDefaultText(), ...fragment] : fragment;
        return insertFragment(editor, nodes);
      }

      const { textNode, listItemNodes } = getTextAndListItemNodes(editor, fragment, liEntry, licEntry);
      insertFragment(editor, [textNode]);

      const [, liPath] = liEntry;
      return Transforms.insertNodes(editor, listItemNodes, {
        at: Path.next(liPath),
        select: true,
      });

    });
  };
};
