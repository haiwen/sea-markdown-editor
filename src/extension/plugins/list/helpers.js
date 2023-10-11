import { Editor } from "slate";

export const isMenuDisabled = (editor: Editor, readonly: boolean) => {
  if (!readonly) return true;
  const { selection } = editor;
  if (!selection) return true;
  return false;
}

/**
 * @param {object} editor 
 * @param {LIST_ITEM | UNORDERED_LIST } type 
 * @returns boolean
 */
export const getListType = (editor: Editor) => {
  return false;
  const [match] = Editor.nodes(editor, {
    match: n => n.type === 'list',
  })

  return !!match;
}