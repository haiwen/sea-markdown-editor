import { Editor } from "slate";

export const isDisabled = (editor, readonly) => {
  const { selection } = editor;
  if (readonly || !selection) return true;

  return false;
};

export const isInTable = (editor) => {
  const { selection } = editor;
  if (!selection) return false;

  const { path } = selection.anchor;
  const [node] = Editor.node(editor, path);
  return node.type === 'table';
};
