import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const focusEditor = (editor, target) => {
  if (target) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.deselect(editor);
      Transforms.select(editor, target);
    });
  }
  ReactEditor.focus(editor);
};
