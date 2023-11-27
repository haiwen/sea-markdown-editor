import { Editor, Transforms, Element } from 'slate';
import slugid from 'slugid';
import { BLOCKQUOTE, CHECK_LIST_ITEM, IMAGE, ORDERED_LIST, PARAGRAPH, UNORDERED_LIST } from '../../constants/element-types';
import { focusEditor, getNodeType } from '../../core';

export const isMenuDisabled = (editor, readonly) => {
  if (readonly) return true;
  if (editor.selection == null) return true;

  const [nodeEntry] = Editor.nodes(editor, {
    match: n => {
      const type = getNodeType(n);

      // Only available for p and blockquote
      if (type === PARAGRAPH) return true;
      if (type === BLOCKQUOTE) return true;
      if (type === UNORDERED_LIST) return true;
      if (type === ORDERED_LIST) return true;
      if (type === CHECK_LIST_ITEM) return true;
      if (type && type.startWith && type.startWith('header')) return true;
      if (type === IMAGE) return true;

      return false;
    },
    universal: true,
    mode: 'highest', // Match top level
  });

  // Match to p blockquote, do not disable
  if (nodeEntry) {
    return false;
  }
  return true;
};

export const getBlockQuoteType = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => getNodeType(n) === BLOCKQUOTE,
    universal: true,
  });

  if (!match) return PARAGRAPH;
  const [n] = match;

  return getNodeType(n);
};

export const setBlockQuoteType = (editor, active) => {
  if (!active) {
    const blockquoteNode = {
      id: slugid.nice(),
      type: BLOCKQUOTE,
    };
    Transforms.wrapNodes(editor, blockquoteNode, {
      mode: 'highest',
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
    });
  } else {
    Transforms.unwrapNodes(editor, {
      mode: 'highest',
      match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
    });
  }
  focusEditor(editor);
};
