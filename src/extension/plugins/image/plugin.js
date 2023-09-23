import { ELementTypes } from '../../constants';

const withImages = (editor) => {
  const { isInline, isVoid } = editor;
  const newEditor = editor;

  newEditor.isInline = (element) => {
    const { type } = element;
    if (type === ELementTypes.IMAGE) return true;
    return isInline(element);
  };

  newEditor.isVoid = (element) => {
    const { type } = element;

    if (type === ELementTypes.IMAGE) return true;
    return isVoid(element);
  };

<<<<<<< HEAD
  return newEditor;
};

=======


  return newEditor;
};


>>>>>>> 8397516 (feat: image-plugin)
export default withImages;
