import { Editor } from "slate";

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

export const getIsMenuActive = (editor: Editor,type) => {
  return false;
};
