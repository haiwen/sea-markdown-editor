import { Transforms } from 'slate';
import { PARAGRAPH } from '../../constants/element-types';
import { focusEditor } from '../../core';

export const transformToParagraph = (ediotr, focusLocation) => {
  if (!ediotr.selection) return;
  Transforms.setNodes(ediotr, { type: PARAGRAPH });
  focusEditor(ediotr, focusLocation);
};
