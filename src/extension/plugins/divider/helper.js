import { Editor, Element, Node, Path, Transforms } from 'slate';
import { focusEditor, generateDefaultParagraph, generateElement, isSelectionAtBlockEnd } from '../../core';
import { DIVIDER, PARAGRAPH } from '../../constants/element-types';

export const transformToDivider = (editor) => {
  if (!editor.selection) return;
  Transforms.setNodes(editor, { type: DIVIDER });
  focusEditor(editor);
};

export const insertDivider = (editor) => {
  if (!editor.selection) return;

  const blockEntry = Editor.above(editor, {
    at: editor.selection,
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
    mode: 'highest',
  });
  const dividerNode = generateElement(DIVIDER);
  const paragraphNode = generateDefaultParagraph();

  const focusInsertedParagraph = () => {
    const [paragraphEntry] = Editor.nodes(editor, {
      at: [],
      match: node => node.id === paragraphNode.id,
      mode: 'highest',
    });

    if (paragraphEntry) {
      focusEditor(editor, Editor.start(editor, paragraphEntry[1]));
      return;
    }

    focusEditor(editor);
  };

  if (!blockEntry) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, [dividerNode, paragraphNode]);
      focusInsertedParagraph();
    });
    return;
  }

  const [blockNode, blockPath] = blockEntry;
  const isEmptyParagraph = blockNode.type === PARAGRAPH && Node.string(blockNode) === '';
  const insertPath = isEmptyParagraph ? blockPath : (isSelectionAtBlockEnd(editor, { at: editor.selection }) ? Path.next(blockPath) : null);

  if (insertPath) {
    Editor.withoutNormalizing(editor, () => {
      if (isEmptyParagraph) {
        Transforms.removeNodes(editor, { at: blockPath });
      }

      Transforms.insertNodes(editor, [dividerNode, paragraphNode], { at: insertPath });
      focusInsertedParagraph();
    });
    return;
  }

  Transforms.insertNodes(editor, dividerNode);
  focusEditor(editor);
};
