import isHotkey from 'is-hotkey';
import { TEXT_STYLE_MAP } from '../../constants';
import { isMenuDisabled, toggleTextStyle } from './helpers';

const withTextStyle = (editor) => {
  const { onHotKeyDown } = editor;
  const newEditor = editor;

  newEditor.onHotKeyDown = (event) => {

    // Does not meet text hotkey processing conditions
    if (!isHotkey('mod+b', event) && !isHotkey('mod+i', event)) {
      return onHotKeyDown && onHotKeyDown(event);
    }

    // handled by text hotkey
    if (isMenuDisabled(newEditor)) {
      return true;
    }

    if (isHotkey('mod+b', event)) {
      toggleTextStyle(newEditor, TEXT_STYLE_MAP.BOLD);
      return true;
    }

    if (isHotkey('mod+i', event)) {
      toggleTextStyle(newEditor, TEXT_STYLE_MAP.ITALIC);
      return true;
    }

    return false;
  };

  return newEditor;
};

export default withTextStyle;
