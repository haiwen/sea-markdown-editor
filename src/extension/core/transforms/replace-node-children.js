import { Editor, Transforms } from 'slate';
import { removeNodeChildren } from './remove-node-children';

export const replaceNodeChildren = (editor, { at, nodes, insertOptions, removeOptions }) => {

  Editor.withoutNormalizing(editor, () => {
    removeNodeChildren(editor, at, removeOptions);

    Transforms.insertNodes(editor, nodes, {
      ...insertOptions,
      at: at.concat([0])
    });
  });
};
