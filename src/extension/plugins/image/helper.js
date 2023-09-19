import { Editor } from 'slate';

export const isMenuDisabled = ( editor, readonly ) => {
  // const { selection } = editor;
  if (readonly) return true;
  // todo 需要补充判断光标不在段落时，不可用的逻辑（刷新页面后Editor会失焦，这个就是想做的）
  return false;
};
