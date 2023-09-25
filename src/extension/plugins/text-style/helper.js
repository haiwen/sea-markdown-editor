import { Editor } from 'slate';
import { focusEditor } from '../../core';

export const getIsMenuDisabled = (editor, isReadonly) => {
  if (isReadonly) return true;
  const { selection } = editor;
  if (!selection) return true;
  return false;
};

export const getIsMarkActive = (editor, mark) => {
  const marks = Editor.marks(editor);
  return marks && Boolean(marks[mark]);
};

export const handleSetMark = (editor, type) => {
  Editor.addMark(editor, type, true);
  focusEditor(editor);
};

export const handleRemoveMark = (editor, type) => {
  Editor.removeMark(editor, type);
  focusEditor(editor);
};
