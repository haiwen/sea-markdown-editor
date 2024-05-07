import React from 'react';
import PropTypes from 'prop-types';
import { MENUS_CONFIG_MAP, EXPAND_EDITOR } from '../constants';
import { MenuItem } from './menu';

const ExpandEditorMenu = ({ readonly, isRichEditor, onExpandEditorToggle, className }) => {
  const config = MENUS_CONFIG_MAP[EXPAND_EDITOR];

  return (
    <MenuItem
      disabled={readonly}
      isActive={false}
      isRichEditor={isRichEditor}
      type={EXPAND_EDITOR}
      onMouseDown={onExpandEditorToggle}
      className={className}
      {...config}
    />
  );
};

ExpandEditorMenu.propTypes = {
  readonly: PropTypes.bool,
  isRichEditor: PropTypes.bool,
  classnames: PropTypes.string,
  onExpandEditorToggle: PropTypes.func,
};

export default ExpandEditorMenu;
