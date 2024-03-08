import insertBreakWhenNormalizeNode from '../../../utils/insert-break-when-nomalize-node';
import { ELementTypes } from '../../constants';
import { IMAGE } from '../../constants/element-types';
import { focusEditor } from '../../core';
import { handleUpdateImage } from './helper';

const withImages = (editor) => {
  const { isInline, isVoid, insertData, normalizeNode } = editor;
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
      focusEditor(newEditor);
      return;
    }
    return insertData(data);
  };

  newEditor.normalizeNode = ([node, path]) => {
    if (node.type === IMAGE) {
      insertBreakWhenNormalizeNode(newEditor, path);
    }
    return normalizeNode([node, path]);
  };

  return newEditor;
};

export default withImages;
