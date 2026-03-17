import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { DIVIDER } from '../../../constants/element-types';
import { insertDivider } from '../helper';
import { MENUS_CONFIG_MAP } from '../../../constants';
import DropdownMenuItem from '../../../commons/dropdown-menu-item';

const menuConfig = MENUS_CONFIG_MAP[DIVIDER];
const propTypes = {
  isRichEditor: PropTypes.bool,
  className: PropTypes.string,
  readonly: PropTypes.bool,
  editor: PropTypes.object,
};

const DividerMenu = ({ readonly, editor, toggle }) => {

  const onMousedown = useCallback((e) => {
    e.preventDefault();
    insertDivider(editor);
    toggle && toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownMenuItem disabled={readonly} menuConfig={menuConfig} className="pr-2" onClick={onMousedown}>
    </DropdownMenuItem>
  );
};

DividerMenu.propTypes = propTypes;

export default DividerMenu;
