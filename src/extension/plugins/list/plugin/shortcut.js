import { Editor, Range, Transforms } from 'slate';
import { getBeforeText, setListType } from '../helpers';
import { ORDERED_LIST, PARAGRAPH, UNORDERED_LIST } from '../../../constants/element-types';
import { focusEditor, getNodeEntries, getPreviousPath } from '../../../core';

/**
 * @param {Editor} editor
 * @param {String} text
 * @returns {Boolean} isPreventInsert
 */
export const handleShortcut = (editor, text) => {
  if (text !== ' ') return false;

  const { selection } = editor;

  if (!Range.isCollapsed(selection)) return false;

  let [aboveNode, aboveNodePath] = Editor.above(editor);

  if (aboveNode.type !== PARAGRAPH) return false;
  // Match ordered list shortcut
  const regOrderListShortcut = /^\s*[1]+\.\s*$/;
  const regUnorderedListShortcut = /^\s*\*+\s*$/;
  const { beforeText, range } = getBeforeText(editor);
  const matchOrderListResult = beforeText.match(regOrderListShortcut);
  const matchUnorderedListResult = beforeText.match(regUnorderedListShortcut);
  const matchedOrderListText = matchOrderListResult && matchOrderListResult[0];
  const matchedUnorderedListText = matchUnorderedListResult && matchUnorderedListResult[0];
  if (matchUnorderedListResult) {
    // Unordered list shortcut
    if (matchedUnorderedListText !== '*') return false;
    if (matchUnorderedListResult.index !== 0) return false;
    // Delete shortcut key text
    Transforms.delete(editor, { at: range });
    setListType(editor, UNORDERED_LIST);
    focusEditor(editor);
    return true;
  } else if (matchOrderListResult) {
    // Ordered list shortcut
    // If the match fails or the match is not at the beginning of the line, it is not a shortcut
    if (matchOrderListResult.index !== 0) return false;
    if (matchedOrderListText !== '1.') return false;
    const previousNodePath = getPreviousPath(aboveNodePath);
    const [previousNode] = Editor.node(editor, previousNodePath);
    // If the previous node is not an ordered list and is start with `1.`,transforms to ordered list
    if (previousNode.type !== ORDERED_LIST) {
    // Delete shortcut key text
      Transforms.delete(editor, { at: range });
      setListType(editor, ORDERED_LIST);
      focusEditor(editor);
      return true;
    }
  }

  return false;
};
