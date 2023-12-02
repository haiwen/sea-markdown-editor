import { ELementTypes } from '../../constants';

const withFormula = (editor) => {
  const { isVoid } = editor;
  const newEditor = editor;

  newEditor.isVoid = (element) => {
    const { type } = element;

    if (type === ELementTypes.IMAGE) return true;
    return isVoid(element);
  };

  return newEditor;
};

export default withFormula;
