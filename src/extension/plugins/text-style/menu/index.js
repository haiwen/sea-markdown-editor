import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { MENUS_CONFIG_MAP, TEXT_STYLE_MAP } from '../../../constants';
import MenuItem from '../../../commons/menu/menu-item';
import { isMenuDisabled, isMarkActive, toggleTextStyle } from '../helpers';

const textStyleList = [TEXT_STYLE_MAP.ITALIC, TEXT_STYLE_MAP.BOLD, TEXT_STYLE_MAP.CODE];

const TextStyleMenu = ({ editor, readonly, type, isRichEditor, className }) => {
  const config = MENUS_CONFIG_MAP[type];
  const isDisabled = isMenuDisabled(editor, readonly);
  const isActive = isMarkActive(editor, type);

  const handleClickMenu = useCallback((e, toggleType) => {
    toggleTextStyle(editor, type);
  }, [editor, type]);

  return (
    <div>
      <MenuItem
        editor={editor}
        disabled={isDisabled}
        isActive={isActive}
        isRichEditor={isRichEditor}
        className={className}
        onMouseDown={handleClickMenu}
        {...config}
      />
    </div>
  );
};

TextStyleMenu.propTypes = {
  editor: PropTypes.object.isRequired,
  readonly: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(textStyleList).isRequired,
  isRichEditor: PropTypes.bool,
  className: PropTypes.string,
};

export default TextStyleMenu;
