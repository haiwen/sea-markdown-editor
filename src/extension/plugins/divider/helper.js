import { Transforms } from "slate";
import { focusEditor, generateElement } from "../../core";
import { DIVIDER } from "../../constants/element-types";

export const transformToDivider = (editor) => {
  if (!editor.selection) return;
  Transforms.setNodes(editor, { type: DIVIDER });
  focusEditor(editor);
};

export const insertDivider = (editor) => {
  if (!editor.selection) return;

  const dividerNode = generateElement(DIVIDER)
  Transforms.insertNodes(editor, dividerNode);
  focusEditor(editor);
}
