import { ELementTypes } from '../../constants';
import { IMAGE } from '../../constants/element-types';
import { handleUpdateImage } from './helper';

const withImages = (editor) => {
  const { isInline, isVoid, insertData } = editor;
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

  newEditor.insertData = (data) => {
    if (data.types && data.types.includes('Files') && data.files[0].type.includes(IMAGE)) {
      const file = data.files[0];
      handleUpdateImage(newEditor, file);
      return;
    }
    return insertData(data);
  };

  return newEditor;
};

export default withImages;
