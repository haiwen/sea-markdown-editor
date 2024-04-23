import { Editor, Transforms, Range } from 'slate';
import { transformsToList } from '../list/transforms';
import { getSelectedNodeByType } from '../../core';
import { TEXT_STYLE_MAP } from '../../constants';
import { HEADER1, HEADER2, HEADER3, HEADER4, HEADER5, HEADER6, UNORDERED_LIST, BLOCKQUOTE, PARAGRAPH, CODE_BLOCK } from '../../constants/element-types';
import { setBlockQuoteType } from '../blockquote/helpers';
import { transformToCodeBlock } from '../code-block/helpers';

const KEY_TO_TYPE_FOR_SPACE = {
  // Title shortcut
  '#': HEADER1,
  '##': HEADER2,
  '###': HEADER3,
  '####': HEADER4,
  '#####': HEADER5,
  '######': HEADER6,
  // List shortcut
  '*': UNORDERED_LIST,
  '-': UNORDERED_LIST,
  // Reference shortcut key
  '>': BLOCKQUOTE,
  '```': CODE_BLOCK,
};

const KEY_TO_INLINE_TYPE_FOR_SPACE = {
  // Inline shortcut keys
  '**': TEXT_STYLE_MAP.BOLD,
  '*': TEXT_STYLE_MAP.ITALIC,
  '***': TEXT_STYLE_MAP.BOLD_ITALIC,
  '__': TEXT_STYLE_MAP.BOLD,
  '_': TEXT_STYLE_MAP.ITALIC,
  '___': TEXT_STYLE_MAP.BOLD_ITALIC,
  '`': TEXT_STYLE_MAP.CODE,
};

const getBeforeText = (editor) => {
  const { selection } = editor;
  if (selection == null) return { beforeText: '', range: null };
  const { anchor } = selection;
  const range = {
    anchor,
    focus: {
      path: selection.focus.path,
      offset: 0
    }
  };
  const beforeText = Editor.string(editor, range) || '';
  return { beforeText, range };
};

const withMarkDown = (editor) => {
  const { insertText } = editor;
  const newEditor = editor;

  // When entering a space, convert markdown
  newEditor.insertText = text => {
    const { selection } = editor;
    if (selection == null) return insertText(text);
    if (Range.isExpanded(selection)) return insertText(text);
    if (getSelectedNodeByType(editor, PARAGRAPH) == null) return insertText(text); // It must be in paragraph
    if (text !== ' ') return insertText(text); // The value must be an input space

    // Gets the text before the space
    const { beforeText, range } = getBeforeText(editor);
    if (!beforeText || !range) return insertText(text);

    // Based on the keyword, find the type of element you want to convert
    const type = KEY_TO_TYPE_FOR_SPACE[beforeText.trim()];
    const italicAndBoldType = KEY_TO_INLINE_TYPE_FOR_SPACE[beforeText.slice(-3)];
    const boldType = KEY_TO_INLINE_TYPE_FOR_SPACE[beforeText.slice(-2)];
    const italicType = KEY_TO_INLINE_TYPE_FOR_SPACE[beforeText.slice(-1)];
    const inlineCode = KEY_TO_INLINE_TYPE_FOR_SPACE[beforeText.slice(-1)];
    if (!type && !boldType && !italicType && !italicAndBoldType) return insertText(text);

    if (italicAndBoldType === TEXT_STYLE_MAP.BOLD_ITALIC) {
      const SYMBOL = beforeText.slice(-3);
      const restStr = beforeText?.slice(0, beforeText.length - 3);
      const startOffset = restStr?.lastIndexOf(SYMBOL);
      const endOffset = beforeText?.lastIndexOf(SYMBOL) + 3;

      if (startOffset === -1) {
        return insertText(text);
      }

      if (startOffset !== -3) {
        Transforms.delete(editor, {
          at: {
            anchor: {
              path: range.focus.path,
              offset: startOffset
            },
            focus: { ...selection.focus }
          },
          voids: true
        });

        const newText = beforeText.slice(startOffset + 3, endOffset - 3);
        Editor.addMark(editor, TEXT_STYLE_MAP.BOLD, true);
        Editor.addMark(editor, TEXT_STYLE_MAP.ITALIC, true);
        insertText(newText);

        Editor.removeMark(editor, TEXT_STYLE_MAP.BOLD);
        Editor.removeMark(editor, TEXT_STYLE_MAP.ITALIC);
        return;
      }

      return;
    }

    if (boldType === TEXT_STYLE_MAP.BOLD) {
      const SYMBOL = beforeText.slice(-2);
      const restStr = beforeText.slice(0, beforeText.length - 2);
      const startOffset = restStr.lastIndexOf(SYMBOL);
      const endOffset = beforeText.lastIndexOf(SYMBOL) + 2;

      if (startOffset === -1) {
        return insertText(text);
      }

      Transforms.delete(editor, {
        at: {
          anchor: {
            path: range.focus.path,
            offset: startOffset
          },
          focus: { ...selection.focus }
        },
        voids: true
      });

      const newType = boldType.toLowerCase();
      const newText = beforeText.slice(startOffset + 2, endOffset - 2);
      Editor.addMark(editor, newType, true);
      insertText(newText);

      Editor.removeMark(editor, newType);
      return;
    }

    // demos
    // 1 '*'
    // 2 'acd * add *'
    if (italicType === TEXT_STYLE_MAP.ITALIC) {
      const SYMBOL = beforeText.slice(-1);
      const restStr = beforeText?.slice(0, beforeText.length - 1);
      const startOffset = restStr?.lastIndexOf(SYMBOL);
      const endOffset = beforeText?.lastIndexOf(SYMBOL) + 1;

      // start: restStr =  '`' | '   `'
      if (restStr === '' || restStr === '_') {
        return insertText(text);
      }

      // end: restStr = '   _' | 'aaaaa_'
      if (startOffset + 1 === restStr.length) {
        return insertText(text);
      }

      if (startOffset === -1 && restStr.length > 0) {
        return insertText(text);
      }

      if (startOffset !== -1) {
        Transforms.delete(editor, {
          at: {
            anchor: {
              path: range.focus.path,
              offset: startOffset
            },
            focus: { ...selection.focus }
          },
          voids: true
        });

        const newType = italicType.toLowerCase();
        const newText = beforeText.slice(startOffset + 1, endOffset - 1);
        Editor.addMark(editor, newType, true);
        insertText(newText);

        Editor.removeMark(editor, newType);
        return;
      }
    }

    if (type !== CODE_BLOCK && inlineCode === TEXT_STYLE_MAP.CODE) {
      const restStr = beforeText?.slice(0, beforeText.length - 1);
      const startOffset = restStr?.lastIndexOf('`');
      const endOffset = beforeText?.lastIndexOf('`') + 1;

      // start: restStr =  '`' | '   `'
      if (restStr === '' || restStr === '`') {
        return insertText(text);
      }

      // end: restStr = '   `' | 'aaaaa`'
      if (startOffset + 1 === restStr.length) {
        return insertText(text);
      }

      if (startOffset === -1 && restStr.length > 0) {
        return insertText(text);
      }

      if (startOffset !== -1) {
        Transforms.delete(editor, {
          at: {
            anchor: {
              path: range.focus.path,
              offset: startOffset
            },
            focus: { ...selection.focus }
          },
          voids: true
        });

        const newType = inlineCode.toLowerCase();
        const newText = beforeText.slice(startOffset + 1, endOffset - 1);
        Editor.addMark(editor, newType, true);
        insertText(newText);

        // add space with inline code
        Editor.removeMark(editor, newType);
        insertText(' ');
        return;
      }
    }

    // Delete element
    Transforms.select(editor, range);
    Transforms.delete(editor);

    if (type === UNORDERED_LIST) {
      transformsToList(editor, type);
      return;
    }

    if (type === BLOCKQUOTE) {
      setBlockQuoteType(editor, false);
      return;
    }

    if (type === CODE_BLOCK) {
      transformToCodeBlock(editor);
      return;
    }

    Transforms.setNodes(editor, { type });
  };

  return newEditor;
};

export default withMarkDown;
