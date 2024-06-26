import { Editor, Range } from 'slate';
import { isInCodeBlock } from '../code-block/helpers';
import { TEXT_STYLE_MAP } from '../../constants';
import { focusEditor } from '../../core';

export const isMenuDisabled = (editor, isReadonly) => {
  if (isReadonly) return true;
  const { selection } = editor;
  if (!selection) return true;
  if (isInCodeBlock(editor)) return true;
  return false;
};

export const isMarkActive = (editor, mark) => {
  const { selection } = editor;
  if (!selection) return false;

  const marks = Editor.marks(editor);

  // If curMarks exists, you need to set this parameter manually. curMarks prevails
  if (marks && Object.keys(marks).length > 0) {
    return !!marks[mark];
  } else {
    const [match] = Editor.nodes(editor, {
      match: n => n[mark] === true,
    });

    return !!match;
  }
};

export const addMark = (editor, type) => {
  Editor.addMark(editor, type, true);
};

export const removeMark = (editor, type) => {
  Editor.removeMark(editor, type);
};

export const toggleTextStyle = (editor, type) => {
  const isActive = isMarkActive(editor, type);
  isActive ? removeMark(editor, type) : addMark(editor, type);
  if (type === TEXT_STYLE_MAP.CODE) {
    if (Range.isCollapsed(editor.selection)) {
      Editor.insertText(editor, '');
    }
    focusEditor(editor);
  }
};
