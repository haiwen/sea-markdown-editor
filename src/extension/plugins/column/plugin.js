import { ELementTypes } from '../../constants';

const withColumn = (editor) => {
  const { isInline, isVoid } = editor;
  const newEditor = editor;

  newEditor.isInline = (element) => {
    const { type } = element;
    if (type === ELementTypes.COLUMN) return true;
    return isInline(element);
  };

  newEditor.isVoid = (element) => {
    const { type } = element;

    if (type === ELementTypes.COLUMN) return true;
    return isVoid(element);
  };

  return newEditor;
};

export default withColumn;
