import { getHeaderType } from '../header/helper';
import { IMAGE } from '../../constants/element-types';
import {  Transforms } from 'slate';
import { generateEmptyElement } from '../../core';

export const isMenuDisabled = (editor, readonly) => {
  if (readonly) return true;
  const isHeader = getHeaderType(editor);
  if (isHeader) return true;
  return false;
};

export const insertImage = (editor, url) => {
  const imageNode = { ...generateEmptyElement(IMAGE), url };
  Transforms.insertNodes(editor, imageNode, { at: editor.selection, select: true });
};
