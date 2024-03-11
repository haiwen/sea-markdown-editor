import { Editor, Element, Point, Transforms, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { generateEmptyElement, getSelectedNodeByType, isSelectionAtBlockStart } from '../../core';
import { BLOCKQUOTE, PARAGRAPH, TABLE } from '../../constants/element-types';
import { setBlockQuoteType } from './helpers';

/**
 *
 * @param {Editor} editor
 * @returns
 */
const withBlockquote = (editor) => {
  const { insertBreak, insertText, deleteBackward, insertFragment } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    const { selection } = editor;
    if (selection == null) return insertBreak();

    const [nodeEntry] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && n.type === BLOCKQUOTE,
      universal: true,
    });
    if (!nodeEntry) return insertBreak();

    const quoteElem = nodeEntry[0];
    const quotePath = ReactEditor.findPath(editor, quoteElem);
    const quoteEndLocation = Editor.end(editor, quotePath);

    if (Point.equals(quoteEndLocation, selection.focus)) {
      // Cursor is at the end of blockquote
      const str = Node.string(quoteElem);
      // The last of the blockquote text is \n;
      if (str && str.slice(-1) === '\n') {
        // Step 1: Remove the last \n
        editor.deleteBackward('character');
        // Step 2: Insert a paragraph
        const p = generateEmptyElement(PARAGRAPH);
        Transforms.insertNodes(newEditor, p, { mode: 'highest' });
        return;
      }
    }

    // In other cases, insert a newline
    insertText('\n');
  };

  newEditor.deleteBackward = (unit) => {
    const { selection } = newEditor;
    if (selection === null) {
      deleteBackward(unit);
      return;
    }

    const node = getSelectedNodeByType(editor, BLOCKQUOTE);
    if (node) {
      if (isSelectionAtBlockStart(editor)) {
        setBlockQuoteType(editor, PARAGRAPH);
        return;
      }
    }

    deleteBackward(unit);
  };

  newEditor.insertFragment = (data) => {
    const { selection } = editor;
    if (selection == null) return insertFragment(data);
    const insertData = data.filter((node) => node.type !== TABLE);
    return insertFragment(insertData);
  };

  return newEditor;
};

export default withBlockquote;
