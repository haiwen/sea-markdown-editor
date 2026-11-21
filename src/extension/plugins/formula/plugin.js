import { ELementTypes } from '../../constants';

const withFormula = (editor) => {
  const { isInline, isVoid } = editor;
  const newEditor = editor;

  newEditor.isInline = element => {
    if (element.type === ELementTypes.FORMULA && element.inline) return true;
    return isInline(element);
  };

  newEditor.isVoid = (element) => {
    const { type } = element;

    if (type === ELementTypes.FORMULA) return true;
    return isVoid(element);
  };

  return newEditor;
};

export default withFormula;
