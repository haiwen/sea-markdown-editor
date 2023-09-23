import React from 'react';
import PropTypes from 'prop-types';
import { ELementTypes, MENUS_CONFIG_MAP } from '../../../constants';
import MenuItem from '../../../commons/menu/menu-item';
import { getIsMenuDisabled, getIsMenuActive } from '../helper';

const textStyleList = [ELementTypes.ITALIC, ELementTypes.BOLD,ELementTypes.CODE_LINE];

const TextStyleMenu = (props) => {
  const { editor, isReadonly, type, isRichEditor, classname } = props;
  const config = MENUS_CONFIG_MAP[type];
  const isDisabled = getIsMenuDisabled(editor, isReadonly);
  const isActive = getIsMenuActive(editor, type);
  const handleClickMenu = (e,type) => {
    console.log('clicked');
  };
  return (
    <div>
      <MenuItem
        editor={editor}
        disabled={isDisabled}
        isActive={isActive}
        isRichEditor={isRichEditor}
        classname={classname}
        onMouseDown={handleClickMenu}
        {...config}
      />
    </div>
  );
};


TextStyleMenu.propTypes = {
  editor: PropTypes.object.isRequired,
  isReadonly: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(textStyleList).isRequired,
  isRichEditor: PropTypes.bool,
  classname: PropTypes.string,
};

export default TextStyleMenu;
