import { ELementTypes, INSERT_POSITION } from '../../constants';
import { IMAGE } from '../../constants/element-types';
import { handleUpdateFile } from './helper';

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
    if (data.types && data.types.includes('Files') && data.files) {
      if (!newEditor.isSupportMultipleFiles) {
        const file = data.files[0];
        if (!file.type.includes(IMAGE) && newEditor.isImageUploadOnly) return;
        handleUpdateFile(newEditor, file);
        return;
      }

      let files = [];
      for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        if (newEditor.isImageUploadOnly && !file.type.includes(IMAGE)) continue;
        files.push(file);
      }

      const hasImage = files.some(file => file.type.includes(IMAGE));
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        handleUpdateFile(newEditor, file, hasImage ? INSERT_POSITION.AFTER : INSERT_POSITION.CURRENT);
      }
      return;
    }
    return insertData(data);
  };

  return newEditor;
};

export default withImages;
