import { ELementTypes } from '../../constants';

const withDivider = (editor) => {
  const { isVoid } = editor;
  const newEditor = editor;

  newEditor.isVoid = (element) => {
    const { type } = element;

    if (type === ELementTypes.DIVIDER) return true;
    return isVoid(element);
  };

  return newEditor;
};

export default withDivider;
