import { Editor, Element, Transforms, Node, Path } from 'slate';
import { generateDefaultParagraph, isFirstChild, isLastChild } from '../../core';
import { BLOCKQUOTE, CHECK_LIST_ITEM, PARAGRAPH, TABLE } from '../../constants/element-types';
import { setBlockQuoteType } from './helpers';
import { LIST_TYPES } from '../list/constant';

const getCurrentLineEntry = (editor) => {
  // blockquote > paragraph
  // blockquote > check_list_item
  // blockquote > list > list_item > paragraph
  const [currentLineEntry] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
    mode: 'lowest',
  });
  if (!currentLineEntry) return null;
  const type = currentLineEntry[0].type;
  if (type === PARAGRAPH) {
    const parentPath = Path.parent(currentLineEntry[1]);
    if (parentPath.length === 1) return currentLineEntry; // top level element
    const [listEntry] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && LIST_TYPES.includes(n.type),
      mode: 'highest',
    });
    return listEntry;
  }
  return currentLineEntry;
};


const withBlockquote = (editor) => {
  const { insertBreak, deleteBackward, insertFragment } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    const { selection } = editor;
    if (selection == null) return insertBreak();

    const [blockquoteEntry] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && n.type === BLOCKQUOTE,
      universal: true,
    });
    if (!blockquoteEntry) return insertBreak();

    // blockquote > paragraph
    // blockquote > check_list_item
    // blockquote > list > list_item
    const currentLineEntry = getCurrentLineEntry(newEditor);
    if (!currentLineEntry) return insertBreak();

    // handle this case by list plugin
    const currentLineType = currentLineEntry[0].type;
    if (LIST_TYPES.includes(currentLineType) || currentLineType === CHECK_LIST_ITEM) {
      insertBreak();
      return;
    }

    const isEmptyLine = Node.string(currentLineEntry[0]).length === 0;
    const isFirst = isFirstChild(blockquoteEntry, currentLineEntry[1]);

    if (isEmptyLine && isFirst && blockquoteEntry[0].children.length === 1) {
      Transforms.unwrapNodes(editor, {
        mode: 'highest',
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      });
      return;
    }

    const isLast = isLastChild(blockquoteEntry, currentLineEntry);
    if (isEmptyLine && isLast) {
      const nextPath = Path.next(blockquoteEntry[1]);
      Transforms.moveNodes(newEditor, { at: currentLineEntry[1], to: nextPath });
      return;
    }

    // In other cases, insert a newline
    Transforms.insertNodes(newEditor, generateDefaultParagraph(), { at: newEditor.selection, select: true });
  };

  newEditor.deleteBackward = (unit) => {
    const { selection } = newEditor;
    if (selection === null) {
      deleteBackward(unit);
      return;
    }

    const [blockquoteEntry] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && n.type === BLOCKQUOTE,
      universal: true,
    });
    if (!blockquoteEntry) return deleteBackward(unit);

    // blockquote > paragraph
    // blockquote > check_list_item
    // blockquote > list > list_item
    const currentLineEntry = getCurrentLineEntry(editor);
    if (!currentLineEntry) return deleteBackward(unit);

    // handle this case by list plugin
    const currentLineType = currentLineEntry[0].type;
    if (LIST_TYPES.includes(currentLineType) || currentLineType === CHECK_LIST_ITEM) {
      deleteBackward(unit);
      return;
    }

    const isEmptyLine = Node.string(currentLineEntry[0]).length === 0;
    const isFirst = isFirstChild(blockquoteEntry, currentLineEntry[1]);
    if (isEmptyLine && isFirst && blockquoteEntry[0].children.length === 1) {
      setBlockQuoteType(editor, PARAGRAPH);
      return;
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
