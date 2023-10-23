import { Transforms, Editor, Path, Range } from 'slate';
import { generateElement, getAboveNode, isBlockTextEmptyAfterSelection, isStartPoint } from '../../../core';
import { LIST_ITEM, LIST_LIC } from '../../../constants/element-types';

export const insertListItem = (editor) => {
  const licEntry = getAboveNode(editor, { match: { type: LIST_LIC } });
  if (!licEntry) return false;

  const [, paragraphPath] = licEntry;
  const listItemEntry = Editor.parent(editor, paragraphPath);
  if (!listItemEntry) return false;

  const [listItemNode, listItemPath] = listItemEntry;

  if (listItemNode.type !== LIST_ITEM) return false;

  let success = false;
  Editor.withoutNormalizing(editor, () => {
    if (!Range.isCollapsed(editor.selection)) {
      // Delete selected text
      Transforms.delete(editor, { at: editor.selection });
    }
    const _isStartPoint = isStartPoint(editor, editor.selection?.focus, paragraphPath);
    const isEndPoint = isBlockTextEmptyAfterSelection(editor);
    const nextParagraphPath = Path.next(paragraphPath);
    const nextListItemPath = Path.next(listItemPath);
    if (_isStartPoint) { // List item has content, cursor at start
      const licItem = generateElement(LIST_LIC);
      Transforms.insertNodes(editor, licItem, { at: listItemPath });

      const listItem = generateElement(LIST_ITEM, { childrenOrText: [] });
      Transforms.wrapNodes(editor, listItem, { at: listItemPath });
      success = true;
      return;
    }
    if (!isEndPoint) { // List item has content, cursor at middle
      Transforms.splitNodes(editor);
      const listItem = generateElement(LIST_ITEM, { childrenOrText: [] });
      Transforms.wrapNodes(editor, listItem, { at: nextParagraphPath });
      Transforms.moveNodes(editor, {
        at: nextParagraphPath,
        to: nextListItemPath,
      });
      Transforms.select(editor, nextListItemPath);
      Transforms.collapse(editor, { edge: 'start' });
      success = true;
    } else { // List item has content, cursor at end
      const marks = Editor.marks(editor)?.key;
      const licItem = generateElement(LIST_LIC);
      Transforms.insertNodes(editor, { ...licItem, ...marks }, { at: nextListItemPath });
      const listItem = generateElement(LIST_ITEM, { childrenOrText: [] });
      Transforms.wrapNodes(editor, listItem, { at: nextListItemPath });
      Transforms.select(editor, nextListItemPath);
      success = true;
    }

    if (listItemNode.children.length > 1) {
      Transforms.moveNodes(editor, { at: nextParagraphPath, to: nextListItemPath.concat(1) });
      success = true;
    }
  });

  return success;

};
