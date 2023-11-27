import { Transforms } from 'slate';
import { PARAGRAPH } from '../../constants/element-types';
import { focusEditor } from '../../core';

export const transformToParagraph = (editor, focusLocation) => {
  if (!editor.selection) return;
  Transforms.setNodes(editor, { type: PARAGRAPH });
  focusEditor(editor, focusLocation);
};
