import { Editor, Range, Transforms } from 'slate';
import { getBeforeText, setListType } from '../helpers';
import { ORDERED_LIST, PARAGRAPH } from '../../../constants/element-types';
import { focusEditor, getPreviousPath } from '../../../core';

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
  const regShortcut = /^\s*[1]+\.\s*$/;
  const { beforeText, range } = getBeforeText(editor);
  const matchResult = beforeText.match(regShortcut);
  const matchedText = matchResult && matchResult[0];
  // If the match fails or the match is not at the beginning of the line, it is not a shortcut
  if (!matchResult || matchResult.index !== 0) return false;
  const previousNodePath = getPreviousPath(aboveNodePath);
  const [previousNode] = Editor.node(editor, previousNodePath);
  // If the previous node is not an ordered list and is not start with `1.`,it is not a shortcut
  if (previousNode.type !== ORDERED_LIST && matchedText !== '1.') return false;
  // If the previous node is not an ordered list and is start with `1.`,transforms to ordered list
  if (previousNode.type !== ORDERED_LIST && matchedText === '1.') {
    // Delete shortcut key text
    Transforms.delete(editor, { at: range });
    setListType(editor, ORDERED_LIST);
    focusEditor(editor);
    return true;
  }
  return false;
};
