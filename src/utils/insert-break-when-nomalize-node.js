import { Transforms } from 'slate';
import { generateDefaultParagraph, getNextNode, getPrevNode } from '../extension/core';

const insertBreakWhenNormalizeNode = (editor, path) => {
  const prevNode = getPrevNode(editor);
  const nextNode = getNextNode(editor);

  if (!prevNode) {
    const newParagraph = generateDefaultParagraph();
    Transforms.insertNodes(editor, newParagraph, { at: [path[0]] });
  }

  if (!nextNode) {
    const newParagraph = generateDefaultParagraph();
    const insertPath = !prevNode ? [path[0] + 2] : [path[0] + 1];
    Transforms.insertNodes(editor, newParagraph, { at: insertPath });
  }
};

export default insertBreakWhenNormalizeNode;
