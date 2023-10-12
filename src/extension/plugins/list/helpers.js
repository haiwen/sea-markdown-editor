import { Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';
import slugid from 'slugid';
import { CODE_BLOCK, LIST_ITEM, LIST_LIC, ORDERED_LIST, PARAGRAPH, UNORDERED_LIST } from '../../constants/element-types';
import { findDescendant, getAboveBlockNode, getAboveNode, getNode, getNodeType, isLastChild } from '../../core/queries';
import { focusEditor } from '../../core';

export const isMenuDisabled = (editor, readonly) => {
  if (readonly || !editor.selection) return true;
  // Match disable node
  const [match] = Editor.nodes(editor, {
    match: n => [CODE_BLOCK].includes(n.type),
  });
  return !!match;
};

/**
 * @param {object} editor
 * @param {LIST_ITEM | UNORDERED_LIST } type
 */
export const getListLineEntries = (editor, type) => {
  const match = (n) => getNodeType(n) === type;
  const nodeEntries = Editor.nodes(editor, { match, universal: true });
  return nodeEntries;
};

export const transformToList = (editor, type) => {
  // Wrap list line of each selected paragraph
  const listChildren = { id: slugid.nice(), type, children: [] };
  Transforms.wrapNodes(editor, listChildren);
  const startPoint = Editor.start(editor, editor.selection);
  const paragraphEntires = Editor.nodes(editor, {
    match: node => node.type === PARAGRAPH,
    at: [startPoint.path.at(0)],
    universal: true,
  });
  if (!paragraphEntires) return;
  // Wrap list container
  for (const [paragraphNode, paragraphPath] of paragraphEntires) {
    Transforms.setNodes(editor, { type: LIST_LIC });
    const listline = { id: slugid.nice(), type: LIST_ITEM, children: [] };
    Transforms.wrapNodes(editor, listline, { at: paragraphPath });
  }
  focusEditor(editor);
};

export const transformToParagraph = (editor, { at } = {}) => {
  const listTypes = [ORDERED_LIST, UNORDERED_LIST];
  const isWrpaedListContainer = () => {
    const isWrped = getAboveNode(editor, { match: { type: listTypes } });
    if (isWrped) return true;
    // The selection's common node might be a list type
    if (!at && editor.selection) {
      const [beforPoint, afterPoint] = Range.edges(editor.selection);
      const commonNodeEntry = Node.common(editor, beforPoint.path, afterPoint.path);
      const commonNode = commonNodeEntry[0];
      if (Element.isElement(commonNode && listTypes.includes(commonNode.type))) return true;
    }
  };

  Editor.withoutNormalizing(editor, () => {
    do {
      const licEntry = getAboveBlockNode(editor, { at, match: { type: LIST_LIC } });
      licEntry && Transforms.setNodes(editor, { type: PARAGRAPH });
      Transforms.unwrapNodes(editor, {
        at,
        match: node => node.type === LIST_ITEM,
        split: true,
      });

      Transforms.unwrapNodes(editor, {
        at,
        match: node => listTypes.includes(node.type),
        split: true
      });
    } while (isWrpaedListContainer());
  });

  focusEditor(editor);
};

export const getListAndListItemEntry = (editor, { at = editor.selection } = {}) => {
  const isRange = Range.isRange(at);
  const _at = isRange ? Editor.start(editor, at).path : at;
  if (_at) {
    // Node must be on of list item(order list or unordered list) if exist
    const node = Node.get(editor, _at);
    if (node) {
      const listItemEntry = Editor.above(editor, { at: _at, match: node => Element.isElement(node) && node.type === LIST_ITEM });
      if (listItemEntry) {
        const listEntry = Editor.parent(editor, listItemEntry[1]);
        return { listEntry, listItemEntry }
      }
    }
  }

  return null
}

export const hasListChild = (node) => {
  const listTypes = [ORDERED_LIST, UNORDERED_LIST];
  return !!node.children.find(n => {
    return Element.isElement(n) && listTypes.includes(n.type);
  });
};

const moveListItemsIntoList = (editor, { fromListEntry, fromListItemEntry, fromStartIndex, to: _to, toListEntry, toListIndex = null, deleteFromList = true }) => {
  let fromListPath = null;
  let moved = false;

  Editor.withoutNormalizing(editor,() => {
    if(fromListItemEntry) {
      const fromListItemSubList = findDescendant(editor,{
        at: fromList
      })
    }
  })
}

export const movedListItemUp = (editor, { listEntry, listItemEntry }) => {
  const move = () => {
    const [listNode, listPath] = listEntry;
    const [liNode, liPath] = listItemEntry;
    const liParent = Editor.above(editor, { at: listPath, match: node => node.type === LIST_ITEM });
    // List is list top level ,`ol` or `ul`,since liParent is not exist
    if (!liParent) {
      let movedPath = null
      try {
        movedPath = Path.next(listPath);
      } catch (error) {
        return;
      }
      const isListItemHasChildren = hasListChild(liNode);
      const isNotLastListItemInList = isLastChild(listEntry, liPath);
      if (isListItemHasChildren || isNotLastListItemInList) {
        const newListNode = { id: slugid.nice(), type: listNode.type, children: [] };
        Transforms.insertNodes(editor, newListNode, { at: movedPath });
      }
      // Move children,list items, to new list node we just inserted,if liNode has children
      if (isListItemHasChildren) {
        const newListNode = getNode(editor, movedPath);
        if (!newListNode) return;

      }
    }
  }
}
