import { ELementTypes } from '../../constants';
import { getIsMarkActive, getIsMenuDisabled, handleSetMark, handleRemoveMark } from './helper';

const withTextStyle = (editor) => {
  const newEdtior = editor;
  const toggleTextStyle = (type) => {
    const isDisabled = getIsMenuDisabled(newEdtior);
    if (isDisabled) return;
    const isActive = !!getIsMarkActive(newEdtior, type);
    isActive ? handleRemoveMark(newEdtior, type) : handleSetMark(newEdtior, type);
  };

  newEdtior.toggleTextBold = () => {
    toggleTextStyle(ELementTypes.BOLD);
  };

  newEdtior.toggleTextItalic = () => {
    toggleTextStyle(ELementTypes.ITALIC);
  };

  return newEdtior;
};

export default withTextStyle;
