import { Editor } from 'slate';

const withImages = (editor: Editor) => {
  const { insertBreak, insertText, deleteBackward } = editor;
  const newEditor = editor;
  return newEditor;
};


export default withImages;
