import { getHeaderType } from '../header/helper';
import { IMAGE } from '../../constants/element-types';
import { Transforms } from 'slate';
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

export const getImagesUrlList = (nodes) => {
  let nodeIndex = 0;
  const list = [];
  while(nodes && nodeIndex <= nodes.length - 1) {
    const currentNode = nodes[nodeIndex];
    if (currentNode.type === 'image') {
      currentNode.data.src && list.push(currentNode.data.src);
    } else {
      list.push(...this.getImageNodes(currentNode.children));
    }
    nodeIndex++;
  }
  return list;
};
