import { Editor, Element, Node, Text, Transforms } from "slate";

export const getIsMenuDisabled = (editor: Editor, isReadonly) => {
  if (isReadonly) return true;
  const { selection } = editor;
  if (!selection) return true;
  const { anchor, focus } = selection;
  if (anchor && focus) {
    return anchor.key !== focus.key;
  }
  return true;
};

export const getIsMarkActive = (editor: Editor, mark) => {
  const marks = Editor.marks(editor);
  return marks && Boolean(marks[mark]);
};

export const handleSetMark = (editor: Editor, type) => {
  Editor.addMark(editor, type, true);
};

export const handleRemoveMark = (editor: Editor, type) => {
  console.log('unmark')
  Editor.removeMark(editor, type);
};
